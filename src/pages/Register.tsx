import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMsg from "../components/InputErrorMsg";
import { RegisterInputs } from "../data";
import { IRegisterForm } from "../interfaces";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>();

  // Handlers
  const onSubmit: SubmitHandler<IRegisterForm> = (data) => console.log(data);

  // Renders
  const renderRegisterInputs = () => {
    return RegisterInputs.map(({ name, placeholder, validation }, index) => (
      <div key={index}>
        <Input
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
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterInputs()}
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
