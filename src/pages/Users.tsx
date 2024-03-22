import { Link } from "react-router-dom";
import NoTodosYet from "../components/NoTodosYet";
import Button from "../components/ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { IUsers } from "../interfaces";

const Users = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const { data } = useAuthenticatedQuery({
    queryKey: [`profile-page`],
    url: `/users?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  return (
    <section className="max-w-2xl mx-auto mb-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data?.length ? (
          data.map(
            ({ id, username, email, createdAt }: IUsers, idx: number) => (
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
            )
          )
        ) : (
          <NoTodosYet />
        )}
      </div>
    </section>
  );
};

export default Users;
