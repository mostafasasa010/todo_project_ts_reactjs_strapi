import { AxiosRequestConfig } from "axios";
import { TNameLogin, TNameRegister } from "../types";

export interface IRegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface ILoginForm {
  identifier: string;
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

export interface ILoginInput {
  type: string;
  name: TNameLogin;
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

export interface IErrorResponse {
  error: {
    message?: string;
  };
}

export interface ITodo {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface IAuthenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}
