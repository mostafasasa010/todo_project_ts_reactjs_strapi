interface IProps {
  msg: string | undefined;
}

const InputErrorMsg = ({ msg }: IProps) => {
  return (
    msg && (
      <div
        id="alert-border-1"
        className="flex items-center p-3 mb-4 mt-2 border-indigo-300 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-900 rounded-md hover:border-r-[6px] hover:border-indigo-600 duration-200"
        role="alert"
      >
        <svg
          className="flex-shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div className="ms-3 text-sm font-semibold">{msg}</div>
      </div>
    )
  );
};

export default InputErrorMsg;
