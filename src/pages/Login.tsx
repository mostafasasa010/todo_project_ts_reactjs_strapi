import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { IErrorResponse, ILoginForm } from "../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginInputs } from "../data";
import InputErrorMsg from "../components/InputErrorMsg";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  // Handlers
  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    setIsLoading(true);
    try {
      const { status, data: userData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      if (status === 200) {
        toast.success("You will navigate to the login page after 2 seconds!", {
          position: "bottom-center",
          duration: 1200,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        setTimeout(() => {
          location.replace("/");
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
    return loginInputs.map(({ type, name, placeholder, validation }, index) => (
      <div key={index}>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            required: validation.required,
            minLength: validation.minLength,
            pattern: validation.pattern,
          })}
        />
        {errors[name] && <InputErrorMsg msg={errors[name]?.message} />}
      </div>
    ));
  };
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterInputs()}
        <Button isLoading={isLoading} fullWidth>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
