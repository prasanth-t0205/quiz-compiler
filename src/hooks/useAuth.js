import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import axiosInstance from "@/lib/axios";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: authUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/current");
        return res.data.user;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      return error.response?.status !== 401 && failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const invalidateAuth = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  }, [queryClient]);

  const clearAuth = useCallback(() => {
    queryClient.setQueryData(["authUser"], null);
    queryClient.removeQueries({ queryKey: ["authUser"] });
    queryClient.removeQueries({ queryKey: ["userTests"] });
    queryClient.removeQueries({ queryKey: ["testResults"] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      clearAuth();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      return { success: false, error };
    }
  }, [clearAuth]);

  const isAuthenticated = Boolean(authUser);
  const isUser = authUser?.role === "user";
  const isAdmin = authUser?.role === "admin";

  return {
    authUser,
    isLoading,
    error,
    refetch,
    invalidateAuth,
    clearAuth,
    logout,
    isAuthenticated,
    isUser,
    isAdmin,
  };
};
