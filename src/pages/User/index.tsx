import { Link, useNavigate, useParams } from "react-router-dom";
import useAuthenticatedQuery from "../../hooks/useAuthenticatedQuery";
import { ITodo, IUserData } from "../../interfaces";
import NoTodosYet from "../../components/NoTodosYet";
import UserSkeleton from "../../components/skeleton/UserSkeleton";
import TodoSkeletonPagination from "../../components/skeleton/TodoSkeletonPagination";
import Button from "../../components/ui/Button";
import { users } from "../../data";
import { useState } from "react";
import axiosInstance from "../../config/axios.config";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { OnLogout } from "../../utils";

const User = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const [queryVersion, setQueryVersion] = useState(1);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`user-page-${queryVersion}`],
    url: `/users/${params.id}?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const openConfirmModal = (id: number) => {
    setIsOpenConfirmModal(true);
    setUserToRemove(id);
  };

  const onSubmitRemoveTodo = async () => {
    setIsLoadingEdit(true);
    try {
      const { status } = await axiosInstance.delete(
        `/users/${userToRemove}?populate=todos`,
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (status === 200) {
        toast.success("Done to Delete todo.", {
          position: "bottom-center",
          duration: 800,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        closeConfirmModal();
        navigate(`/users`);
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  // Renders
  const renderUsers = (data: IUserData) => {
    return users.map((user, index) => (
      <p
        key={index}
        className="font-semibold bg-gray-700 rounded-md flex items-center text-white overflow-hidden"
      >
        <span className="bg-indigo-500 rounded-md p-1 px-2 text-center text-lg mr-2">
          {user(data).label}
        </span>
        <span className="truncate">{user(data).value}</span>
      </p>
    ));
  };

  if (isLoading || isFetching)
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 3 }, (_, idx) => (
          <UserSkeleton key={idx} />
        ))}
        <div className="flex flex-col gap-2 !mt-7">
          {Array.from({ length: 1 }, (_, idx) => (
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
          {renderUsers(data)}
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
          <div className="flex gap-2 mt-4">
            <Link to={`/users`}>
              <Button className="py-2 px-4" variant={"cancel"}>
                Back
              </Button>
            </Link>
            <Button
              className="py-2 w-fit"
              variant={"danger"}
              onClick={() => openConfirmModal(data.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Delete TODO CONFIRM MODAL */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this user from your Store?"
        description="Deleting this user will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button
            type="submit"
            isLoading={isLoadingEdit}
            variant={"danger"}
            size={"sm"}
            onClick={onSubmitRemoveTodo}
          >
            Yes, remove
          </Button>
          <Button
            type="button"
            variant={"cancel"}
            size={"sm"}
            onClick={closeConfirmModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default User;
