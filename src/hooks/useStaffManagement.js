import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staffService";
import { toast } from "sonner";

export const useStaffManagement = (currentPage, searchTerm) => {
  const queryClient = useQueryClient();

  // Fetch staff members
  const {
    data: staffData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff", currentPage, searchTerm],
    queryFn: () => staffService.getStaff(currentPage, 10, searchTerm),
  });

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create staff member"
      );
    },
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => staffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update staff member"
      );
    },
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete staff member"
      );
    },
  });

  // Toggle active status mutation
  const toggleActiveStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      staffService.toggleActiveStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member status updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update staff member status"
      );
    },
  });

  return {
    staffData,
    isLoading,
    error,
    createStaffMutation,
    updateStaffMutation,
    deleteStaffMutation,
    toggleActiveStatusMutation,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  };
};
