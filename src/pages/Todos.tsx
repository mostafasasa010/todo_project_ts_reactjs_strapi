import { useState } from "react";
import NoTodosYet from "../components/NoTodosYet";
import Paginator from "../components/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodoPaginator } from "../interfaces";
import TodoSkeletonPagination from "../components/skeleton/TodoSkeletonPagination";

const Todos = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching } = useAuthenticatedQuery({
    queryKey: [`todo-paginator-${page}`],
    url: `/todos?pagination[page]=${page}&pagination[pageSize]=10`,
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
      <div className="max-w-2xl mx-auto space-y-1 p-3 animate-pulse">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeletonPagination key={idx} />
        ))}
      </div>
    );

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-1 mb-10">
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
          pageCount={data.meta.pagination.pageCount}
          pageSize={data.meta.pagination.pageSize}
          total={data.meta.pagination.total}
          isLoading={isLoading || isFetching}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
    </section>
  );
};

export default Todos;
