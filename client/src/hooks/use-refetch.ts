import { useQueryClient } from "@tanstack/react-query";

const useRefetch = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.refetchQueries({
      type: "active",
      // queryKey: [key]
    });
  };
};

export default useRefetch;