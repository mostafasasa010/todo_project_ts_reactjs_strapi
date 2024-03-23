const TodoSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3">
      <div>
        <div className="w-32 h-4 bg-gray-200 rounded-md dark:bg-gray-200"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-20 h-9 bg-gray-300 rounded-md dark:bg-gray-200"></div>
        <div className="w-20 h-9 bg-gray-300 rounded-md dark:bg-gray-200"></div>
      </div>
    </div>
  );
};

export default TodoSkeleton;
