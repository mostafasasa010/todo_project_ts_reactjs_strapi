import { ILoginInput, IRegisterInput, IUser } from "../interfaces";

export const registerInputs: IRegisterInput[] = [
  {
    type: "text",
    name: "username",
    placeholder: "Username",
    validation: {
      required: "Username is required!",
      minLength: {
        value: 5,
        message: "Username must be at least 5 characters long",
      },
    },
  },
  {
    type: "email",
    name: "email",
    placeholder: "Email address",
    validation: {
      required: "Email is required!",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    type: "password",
    name: "password",
    placeholder: "Password",
    validation: {
      required: "Password is required!",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
      },
    },
  },
];

export const loginInputs: ILoginInput[] = [
  {
    type: "email",
    name: "identifier",
    placeholder: "Email address",
    validation: {
      required: "Email is required!",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    type: "password",
    name: "password",
    placeholder: "Password",
    validation: {
      required: "Password is required!",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
      },
    },
  },
];

export const users: IUser[] = [
  (data) => ({
    label: "Username:",
    value: data.username,
  }),
  (data) => ({
    label: "Email:",
    value: data.email,
  }),
  (data) => ({
    label: "Date created:",
    value: data.createdAt,
  }),
];
