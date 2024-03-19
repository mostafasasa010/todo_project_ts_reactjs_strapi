import { useState } from "react";
import NoTodosYet from "../components/NoTodosYet";
import Paginator from "../components/Paginator";
import TodoSkeleton from "../components/skeleton/TodoSkeleton";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodoPaginator } from "../interfaces";

const Todos = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ["paginatorTodos", `${page}`],
    url: "/todos",
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  // Handlers
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading)
    return (
      <div className="space-y-1 p-3 animate-pulse">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 mb-10">
      {data.data.length ? (
        data.data.map(({ id, attributes }: ITodoPaginator, idx: number) => (
          <div
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            key={id}
          >
            <p className="w-full font-semibold">
              {idx + 1} - {attributes.title}
            </p>
          </div>
        ))
      ) : (
        <NoTodosYet />
      )}
      <Paginator
        page={page}
        pageCount={4}
        pageSize={25}
        total={96}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
      />
    </div>
  );
};

export default Todos;
