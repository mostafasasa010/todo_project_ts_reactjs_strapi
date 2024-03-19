import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import InputErrorMsg from "./InputErrorMsg";

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

  // States
  const { pathname } = useLocation();
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodo);
  const [titleError, setTitleError] = useState("");
  const { data, isLoading, error } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
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
    if (title.length < 5 || !title) {
      setTitleError("Must be todo title large than 5 characters!");
      return;
    }
    setIsLoadingEdit(true);
    try {
      const res = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: { title: title, description: description },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (res.status) {
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
          location.replace(pathname);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

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
              <Button variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No Todos Yet!</h3>
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
    </div>
  );
};

export default TodoList;
