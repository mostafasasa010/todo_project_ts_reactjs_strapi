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
import TodoSkeleton from "./skeleton/TodoSkeleton";
import NoTodosYet from "./NoTodosYet";
import BtnsTodoSkeleton from "./skeleton/BtnsTodoSkeleton";
import useSound from "use-sound";
import successSound from "../assets/audio/success.mp3";

const TodoList = () => {
  // Constants
  const defaultTodo = {
    id: 0,
    title: "",
    description: "",
    done: false,
  };
  const defaultAddTodo = {
    title: "",
    description: "",
    done: false,
  };
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userToken = `Bearer ${userData.jwt}`;

  // States
  const [queryVersion, setQueryVersion] = useState(1);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [todoToAdd, setTodoToAdd] = useState<ITodo>(defaultAddTodo);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodo);
  const [titleError, setTitleError] = useState("");
  const [todoDone, setTodoDone] = useState(false);
  const [stateDone, setStateDone] = useState(false);
  const [playSound] = useSound(successSound);
  const { data, isLoading, error, isFetching } = useAuthenticatedQuery({
    queryKey: ["todoList", `${queryVersion}`],
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

  const onCloseAddModal = () => {
    setTodoToAdd(defaultAddTodo);
    setIsAddModalOpen(false);
  };

  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeConfirmModal = () => {
    setTodoToEdit(defaultTodo);
    setIsOpenConfirmModal(false);
  };

  const openConfirmModal = (todo: ITodo) => {
    setIsOpenConfirmModal(true);
    setTodoToEdit(todo);
  };

  const handleAddOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
    setTitleError("");
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

  const handleCheckboxChange = () => {
    setTodoDone((prevTodoDone) => !prevTodoDone);
  };

  const handleCheckboxChangeTEdit = () => {
    setTodoToEdit((prevTodo) => ({
      ...prevTodo,
      done: !prevTodo.done,
    }));
  };

  const handleToggleTodoDone = async (todo: ITodo) => {
    const updatedTodo = { ...todo, done: !todo.done };
    try {
      setStateDone(true);
      const { status } = await axiosInstance.put(
        `/todos/${todo.id}`,
        {
          data: {
            done: updatedTodo.done,
          },
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (status === 200) {
        updatedTodo.done && playSound();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling todo status:", error);
    } finally {
      setStateDone(false);
    }
  };

  const handleAddOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description } = todoToAdd;
    if (title.trim().length < 5 || !title) {
      setTitleError("Must be todo title large than 5 characters!");
      return;
    }
    setIsLoadingEdit(true);
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        {
          data: {
            title,
            description,
            done: todoDone,
            user: [userData.user.id],
          },
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (status === 200) {
        toast.success("Done to add todo :) ", {
          position: "bottom-center",
          duration: 800,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        onCloseAddModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description, done } = todoToEdit;
    if (title.trim().length < 5 || !title) {
      setTitleError("Must be todo title large than 5 characters!");
      return;
    }
    setIsLoadingEdit(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: { title, description, done },
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
        onCloseEditModal();
        setQueryVersion((prev) => prev + 1);
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
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  if (isLoading || isFetching || stateDone)
    return (
      <>
        <div className="my-10 animate-pulse">
          <BtnsTodoSkeleton />
        </div>
        <div className="space-y-1 animate-pulse">
          {Array.from({ length: 3 }, (_, idx) => (
            <TodoSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  if (error) return <h3>{error?.message}</h3>;

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        <div className="flex items-center space-x-2">
          <Button
            className="font-semibold text-base"
            size={"sm"}
            onClick={onOpenAddModal}
          >
            Post new todo
          </Button>
        </div>
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo, idx: number) => (
          <div
            className={`flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100`}
            key={todo.id}
            onClick={() => handleToggleTodoDone(todo)}
          >
            <p
              className={`w-full font-semibold  ${
                todo.done ? "line-through" : ""
              }`}
            >
              {idx + 1} - {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                size={"sm"}
                onClick={(e) => {
                  e.stopPropagation(); // Stop propagation of the click event
                  onOpenEditModal(todo);
                }}
              >
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={(e) => {
                  e.stopPropagation(); // Stop propagation of the click event
                  openConfirmModal(todo);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <NoTodosYet />
      )}

      {/* Add todo modal */}
      <Modal
        isOpen={isAddModalOpen}
        closeModal={onCloseAddModal}
        title="Add a new todo"
      >
        <form className="space-y-3" onSubmit={handleAddOnSubmit}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={handleAddOnChange}
          />
          {titleError && <InputErrorMsg msg={titleError} />}
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={handleAddOnChange}
          />
          <label className="flex items-center cursor-pointer w-fit ml-auto">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={todoDone}
              onChange={handleCheckboxChange}
            />
            <div className="relative w-11 h-6 bg-gray-200  outline-none peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            <span className="ms-3 text-md font-medium text-gray-900 dark:text-gray-800">
              Done
            </span>
          </label>
          <div className="flex items-center space-x-3 mt-4">
            <Button
              type="submit"
              isLoading={isLoadingEdit}
              fullWidth
              className="bg-indigo-700 hover:bg-indigo-800"
            >
              Done
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

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
          <label className="flex items-center cursor-pointer w-fit ml-auto">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={todoToEdit.done}
              onChange={handleCheckboxChangeTEdit}
            />
            <div className="relative w-11 h-6 bg-gray-200  outline-none peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            <span className="ms-3 text-md font-medium text-gray-900 dark:text-gray-800">
              Done
            </span>
          </label>
          <div className="flex items-center space-x-3 mt-4">
            <Button
              type="submit"
              isLoading={isLoadingEdit}
              fullWidth
              className="bg-indigo-700 hover:bg-indigo-800"
            >
              Update
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete TODO CONFIRM MODAL */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
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
    </div>
  );
};

export default TodoList;
