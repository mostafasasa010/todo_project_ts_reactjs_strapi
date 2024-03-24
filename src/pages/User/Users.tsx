import { Link } from "react-router-dom";
import NoTodosYet from "../../components/NoTodosYet";
import Button from "../../components/ui/Button";
import useAuthenticatedQuery from "../../hooks/useAuthenticatedQuery";
import { IUsers } from "../../interfaces";
import UsersSkeleton from "../../components/skeleton/UsersSkeleton";
import Modal from "../../components/ui/Modal";
import { useState } from "react";
import axiosInstance from "../../config/axios.config";
import toast from "react-hot-toast";

const Users = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  const [queryVersion, setQueryVersion] = useState(1);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(0);
  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: [`users-page-${queryVersion}`],
    url: `/users?populate=todos`,
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  // Handlers
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
        toast.success("Done to Delete User.", {
          position: "bottom-center",
          duration: 800,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        closeConfirmModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const filterdUsers = () =>
    [data][0].filter((user: IUsers) => user.id !== userData.user.id);

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
        {filterdUsers().length ? (
          filterdUsers().map(
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
                <div className="flex gap-2">
                  <Link to={`${id}`} className="w-full">
                    <Button className="py-2 w-full" variant={"cancel"}>
                      Show
                    </Button>
                  </Link>
                  <Button
                    className="py-2 w-full"
                    variant={"danger"}
                    onClick={() => openConfirmModal(id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          )
        ) : (
          <NoTodosYet />
        )}
      </div>

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

export default Users;
