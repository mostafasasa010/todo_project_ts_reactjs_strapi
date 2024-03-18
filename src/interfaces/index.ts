import { TNameRegister } from "../types";

export interface IRegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterInput {
  type: string;
  name: TNameRegister;
  placeholder: string;
  validation: {
    required?: string;
    minLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
}
