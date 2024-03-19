import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import InputErrorMsg from "./InputErrorMsg";
import NoTodosYet from "./noTodosYet";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
  // Constants
  const defaultTodo = {
    id: 0,
    title: "",
    description: "",
  };
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  // States
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodo);
  const [titleError, setTitleError] = useState("");
  const { data, isLoading, error } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: userToken,
      },
    },
  });

  // Handlers
  const onCloseEditModal = () => {
    setTodoToEdit(defaultTodo);
    setIsEditModalOpen(false);
  };

  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const closeConfirmModal = () => {
    setTodoToEdit(defaultTodo);
    setIsOpenConfirmModal(false);
  };

  const openConfirmModal = (todo: ITodo) => {
    setIsOpenConfirmModal(true);
    setTodoToEdit(todo);
  };

  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
    setTitleError("");
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description } = todoToEdit;
    if (title.trim().length < 5 || !title) {
      setTitleError("Must be todo title large than 5 characters!");
      return;
    }
    setIsLoadingEdit(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: { title: title, description: description },
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (status === 200) {
        toast.success("Done to edit todo :) ", {
          position: "bottom-center",
          duration: 800,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          onCloseEditModal();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const onSubmitRemoveTodo = async () => {
    setIsLoadingEdit(true);
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: userToken,
        },
      });
      if (status === 200) {
        toast.success("Done to Delete todo :) ", {
          position: "bottom-center",
          duration: 600,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          closeConfirmModal();
        }, 300);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1 p-3 animate-pulse">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );
  if (isLoading) return <h3>Loading...</h3>;
  if (error) return <h3>{error?.message}</h3>;

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo: ITodo, idx: number) => (
          <div
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            key={todo.id}
          >
            <p className="w-full font-semibold">
              {idx + 1} - {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => openConfirmModal(todo)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <NoTodosYet />
      )}

      {/* Edit todo modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={handleOnSubmit}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={handleOnChange}
          />
          {titleError && <InputErrorMsg msg={titleError} />}
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={handleOnChange}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              isLoading={isLoadingEdit}
              fullWidth
              className="bg-indigo-700 hover:bg-indigo-800"
            >
              Update
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE TODO CONFIRM MODAL */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button
            isLoading={isLoadingEdit}
            variant={"danger"}
            size={"sm"}
            onClick={onSubmitRemoveTodo}
          >
            Yes, remove
          </Button>
          <Button variant={"cancel"} size={"sm"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
