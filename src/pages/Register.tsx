import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMsg from "../components/InputErrorMsg";
import { registerInputs } from "../data";
import { IErrorResponse, IRegisterForm } from "../interfaces";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";

const RegisterPage = () => {
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
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
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
