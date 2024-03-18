import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMsg from "../components/InputErrorMsg";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);
  const { username, email, password } = errors;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            placeholder="Username"
            {...register("username", {
              required: "Username is required!",
              minLength: {
                value: 5,
                message: "Username must be at least 5 characters long",
              },
            })}
          />
          {username && <InputErrorMsg msg={username.message} />}
        </div>
        <div>
          <Input
            placeholder="Email address"
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {email && <InputErrorMsg msg={email.message} />}
        </div>
        <div>
          <Input
            placeholder="Password"
            {...register("password", {
              required: "Password is required!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {password && <InputErrorMsg msg={password.message} />}
        </div>
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
