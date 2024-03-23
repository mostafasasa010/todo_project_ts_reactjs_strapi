import { Link, useParams } from "react-router-dom";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import UserSkeleton from "../components/skeleton/UserSkeleton";
import Button from "../components/ui/Button";

const Todo = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const params = useParams();
  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`profile-page`],
    url: `/todos/${params.id}?populate=user`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  if (isLoading || isFetching)
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 5 }, (_, idx) => (
          <UserSkeleton key={idx} />
        ))}
      </div>
    );
  if (error) return <h3>{error?.message}</h3>;
  console.log(data.data.attributes.user.data.id);

  return (
    <section>
      {data && (
        <div className="w-full flex flex-col gap-2 hover:bg-gray-200 duration-300 p-3 rounded-md bg-gray-100">
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Id:
            </span>
            <span className="truncate">{data.data.id}</span>
          </p>
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Title:
            </span>
            <span className="truncate">{data.data.attributes.title}</span>
          </p>
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Date created:
            </span>
            {data.data.attributes.createdAt?.split("T")[0]}
          </p>
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Done:
            </span>
            {data.data.attributes.done === true ? "Yes" : "No"}
          </p>
          <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <label
              htmlFor="comment"
              className="text-white text-center text-lg font-semibold"
            >
              Description:
            </label>
            <div className="px-4 py-2 mt-2 bg-white rounded-md dark:bg-gray-800">
              <textarea
                value={data.data.attributes.description}
                disabled
                rows={6}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <Link
            to={
              userData.user.id == data.data.attributes.user.data.id
                ? `/profile`
                : `/users/${data.data.attributes.user.data.id}`
            }
          >
            <Button className="py-2 px-4" variant={"cancel"}>
              Back
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Todo;
