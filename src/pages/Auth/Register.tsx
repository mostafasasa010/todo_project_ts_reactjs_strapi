import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import InputErrorMsg from "../../components/InputErrorMsg";
import { registerInputs } from "../../data";
import { IErrorResponse, IRegisterForm } from "../../interfaces";
import axiosInstance from "../../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>();

  // Handlers
  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post("/auth/local/register", data);
      if (status === 200) {
        toast.success(
          "You will navigate to the home page after 2 seconds to login!",
          {
            position: "bottom-center",
            duration: 1200,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderRegisterInputs = () => {
    return registerInputs.map(
      ({ type, name, placeholder, validation }, index) => (
        <div key={index} className="relative">
          <Input
            id={name}
            type={type}
            className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-700 bg-gray-50 dark:bg-gray-200 border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-800 dark:border-gray-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            placeholder=" "
            {...register(name, {
              required: validation.required,
              minLength: validation.minLength,
              pattern: validation.pattern,
            })}
          />
          <label
            htmlFor={name}
            className="absolute text-sm text-gray-800 dark:text-gray-800 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            {placeholder}
          </label>
          {errors[name] && <InputErrorMsg msg={errors[name]?.message} />}
        </div>
      )
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterInputs()}
        <Button isLoading={isLoading} fullWidth>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
