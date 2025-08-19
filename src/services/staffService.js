import axiosInstance from "@/lib/axios";

export const staffService = {
  // Fetch staff members
  getStaff: async (page = 1, limit = 10, search = "") => {
    const { data } = await axiosInstance.get("/users/staff", {
      params: { page, limit, search },
    });
    return data;
  },

  // Create staff member
  createStaff: async (staffData) => {
    const { data } = await axiosInstance.post("/users/staff", staffData);
    return data;
  },

  // Update staff member
  updateStaff: async (id, staffData) => {
    const { data } = await axiosInstance.put(`/users/staff/${id}`, staffData);
    return data;
  },

  // Delete staff member
  deleteStaff: async (id) => {
    const { data } = await axiosInstance.delete(`/users/staff/${id}`);
    return data;
  },

  // Toggle active status
  toggleActiveStatus: async (id, isActive) => {
    const endpoint = isActive ? "deactivate" : "activate";
    const { data } = await axiosInstance.patch(
      `/users/staff/${id}/${endpoint}`
    );
    return data;
  },
};
