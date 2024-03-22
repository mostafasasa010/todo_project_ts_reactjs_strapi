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
  id?: number;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  done?: boolean;
  toggleDone?: () => void;
}

export interface ITodoPaginator {
  id?: number;
  attributes: {
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    user: {
      data: {
        attributes: {
          createdAt?: string;
          email: string;
          updatedAt?: string;
          username: string;
        };
        id: number;
      };
    };
  };
}

interface Todo {
  createdAt?: string;
  description: string;
  done?: boolean;
  id: number;
  publishedAt?: string;
  title: string;
  updatedAt?: string;
}

export interface IUsers {
  createdAt: string;
  email: string;
  username: string;
  id: number;
  todos: Todo[];
}

export interface IAuthenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}

export interface IApiPaginator {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  isLoading: boolean;
  onClickPrev: () => void;
  onClickNext: () => void;
}
