import { ChangeEvent, useState } from "react";
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("ASC");
  const { data, isLoading, isFetching, error } = useAuthenticatedQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?populate=user&pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
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

  const onChangePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+event.target.value);
  };

  const onChangeSortBy = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  if (isLoading || isFetching)
    return (
      <div className="space-y-1 animate-pulse mt-20">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeletonPagination key={idx} />
        ))}
      </div>
    );
  if (error) return <h3>{error?.message}</h3>;

  return (
    <section>
      {data.meta.pagination.pageCount !== 0 && (
        <div className="flex items-center justify-end mb-4 gap-2">
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-10">
        {data.data.length ? (
          data.data.map(({ id, attributes }: ITodoPaginator, idx: number) => (
            <div
              className="flex items-center justify-between bg-gray-200 hover:bg-gray-300 duration-300 p-3 rounded-md even:bg-gray-100"
              key={id}
            >
              <p className="w-full font-semibold">
                {idx + 1} - {attributes.title}
              </p>
              <p className="w-full font-semibold text-right">
                Username:{" "}
                <span className="text-indigo-500 font-bold">
                  {attributes.user.data.attributes.username}
                </span>
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
