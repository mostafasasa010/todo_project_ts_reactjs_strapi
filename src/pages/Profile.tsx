import NoTodosYet from "../components/NoTodosYet";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";

const Profile = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;
  const { data } = useAuthenticatedQuery({
    queryKey: [`profile-page`],
    url: `/users/me?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  return (
    <section className="max-w-2xl mx-auto">
      <h2>Profile Page</h2>
      <p>{data?.id}</p>
      <p>{data?.email}</p>
      <p>{data?.username}</p>
      <p>{data?.createdAt.split("T")[0]}</p>
      <div className="flex flex-col gap-1 mb-10">
        {data?.todos?.length ? (
          data?.todos?.map((todo: ITodo, idx: number) => (
            <div
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              key={todo.id}
            >
              <p className="w-full font-semibold">
                {idx + 1} - {todo.title}
              </p>
            </div>
          ))
        ) : (
          <NoTodosYet />
        )}
      </div>
    </section>
  );
};

export default Profile;
