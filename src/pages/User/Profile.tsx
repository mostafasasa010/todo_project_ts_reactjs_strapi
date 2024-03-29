import { useNavigate } from "react-router-dom";
import NoTodosYet from "../../components/NoTodosYet";
import TodoSkeletonPagination from "../../components/skeleton/TodoSkeletonPagination";
import UserSkeleton from "../../components/skeleton/UserSkeleton";
import useAuthenticatedQuery from "../../hooks/useAuthenticatedQuery";
import { ITodo } from "../../interfaces";
import { OnLogout } from "../../utils";

const Profile = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const navigate = useNavigate();
  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`profile-page`],
    url: `/users/me?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  if (isLoading || isFetching)
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 3 }, (_, idx) => (
          <UserSkeleton key={idx} />
        ))}
        <div className="flex flex-col gap-2 !mt-7">
          {Array.from({ length: 3 }, (_, idx) => (
            <TodoSkeletonPagination key={`todo_${idx}`} />
          ))}
        </div>
      </div>
    );

  if (error) {
    OnLogout();
    return;
  }

  return (
    <section>
      {data && (
        <div className="w-full flex flex-col gap-2 hover:bg-gray-200 duration-300 p-3 rounded-md bg-gray-100">
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Username:
            </span>
            <span className="truncate">{data.username}</span>
          </p>
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Email:
            </span>
            <span className="truncate">{data.email}</span>
          </p>
          <p className="font-semibold bg-gray-700 rounded-md flex items-center text-white">
            <span className="bg-indigo-500 rounded-md p-1 text-center text-lg mr-2">
              Date created:
            </span>
            {data.createdAt?.split("T")[0]}
          </p>
          <h2 className="text-xl font-bold text-gray-700">Todos:</h2>
          {data.todos?.length ? (
            data.todos.map(({ id, title }: ITodo, idx: number) => (
              <div
                className="flex items-center justify-between bg-gray-200 hover:bg-gray-100 duration-300 p-3 rounded-md"
                key={id}
                onClick={() => navigate(`/todos/${id}`)}
              >
                <p className="w-full font-semibold">
                  {idx + 1} - {title}
                </p>
              </div>
            ))
          ) : (
            <NoTodosYet />
          )}
        </div>
      )}
    </section>
  );
};

export default Profile;
