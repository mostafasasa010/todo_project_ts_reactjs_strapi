import { Link } from "react-router-dom";
import NoTodosYet from "../../components/NoTodosYet";
import Button from "../../components/ui/Button";
import useAuthenticatedQuery from "../../hooks/useAuthenticatedQuery";
import { IUsers } from "../../interfaces";
import UsersSkeleton from "../../components/skeleton/UsersSkeleton";

const Users = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`profile-page`],
    url: `/users?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  // Handlers
  // Because creating error
  // const filteredData = data
  //   ? [data][0].filter((user: IUsers) => user.id !== userData.user.id)
  //   : null;

  if (isLoading || isFetching)
    return (
      <div className="animate-pulse grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, idx) => (
          <UsersSkeleton key={idx} />
        ))}
      </div>
    );
  if (error) return <h3>{error?.message}</h3>;

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[data][0].filter((user: IUsers) => user.id !== userData.user.id)
          ?.length ? (
          [data][0]
            .filter((user: IUsers) => user.id !== userData.user.id)
            .map(({ id, username, email, createdAt }: IUsers, idx: number) => (
              <div
                className="w-full flex flex-col gap-2 hover:bg-gray-200 duration-300 p-3 rounded-md bg-gray-100"
                key={id}
              >
                <p className="text-white bg-indigo-500 rounded-md py-1 text-center text-lg font-semibold">
                  {idx + 1}
                </p>
                <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
                  <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
                    Username:
                  </span>
                  <span className="truncate">{username}</span>
                </p>
                <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
                  <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
                    Email:
                  </span>
                  <span className="truncate">{email}</span>
                </p>
                <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white">
                  <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
                    Date created:
                  </span>
                  {createdAt?.split("T")[0]}
                </p>
                <Link to={`${id}`} className="w-full">
                  <Button className="py-2 w-full" variant={"cancel"}>
                    Show
                  </Button>
                </Link>
              </div>
            ))
        ) : (
          <NoTodosYet />
        )}
      </div>
    </section>
  );
};

export default Users;
