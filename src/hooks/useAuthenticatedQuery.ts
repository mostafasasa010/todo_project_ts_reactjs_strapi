import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import { IAuthenticatedQuery } from "../interfaces";

const useAuthenticatedQuery = ({
  queryKey,
  url,
  config,
}: IAuthenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
  });
};

export default useAuthenticatedQuery;
