import { useState } from "react";
import AdminLayout from "@/components/common/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Import custom components
import StaffTable from "@/components/admin/users/StaffTable";
import StaffForm from "@/components/admin/users/StaffForm";
import Pagination from "@/components/admin/users/Pagination";
import DeleteConfirmationDialog from "@/components/admin/users/DeleteConfirmationDialog";
import SearchInput from "@/components/admin/users/SearchInput";

// Import custom hook
import { useStaffManagement } from "@/hooks/useStaffManagement";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Use custom hook for staff management
  const {
    staffData,
    isLoading,
    error,
    createStaffMutation,
    updateStaffMutation,
    deleteStaffMutation,
    toggleActiveStatusMutation,
    refetch,
  } = useStaffManagement(currentPage, searchTerm);

  // Filter staff based on search term
  const filteredStaff =
    staffData?.data?.staff?.filter(
      (user) =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle create staff
  const handleCreateSubmit = (formData) => {
    createStaffMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  // Handle edit staff
  const handleEditSubmit = (formData) => {
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }
    updateStaffMutation.mutate(
      { id: selectedUser._id, data: updateData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        },
      }
    );
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteStaffMutation.mutate(deleteUserId, {
      onSuccess: () => {
        setDeleteUserId(null);
      },
    });
  };

  // Handle toggle status
  const handleToggleStatus = (id, isActive) => {
    toggleActiveStatusMutation.mutate({ id, isActive });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">Error loading staff members</p>
            <Button variant="outline" onClick={refetch} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage staff members and their permissions
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new staff member to the system
                </DialogDescription>
              </DialogHeader>
              <StaffForm
                onSubmit={handleCreateSubmit}
                onCancel={() => setIsCreateDialogOpen(false)}
                isLoading={createStaffMutation.isPending}
                submitLabel="Create Staff"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              View and manage all staff members in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search staff members..."
              />
            </div>

            {/* Staff Table */}
            <StaffTable
              staff={filteredStaff}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={setDeleteUserId}
              onToggleStatus={handleToggleStatus}
            />

            {/* Pagination */}
            <Pagination
              pagination={staffData?.data?.pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                Update staff member information and permissions
              </DialogDescription>
            </DialogHeader>
            <StaffForm
              initialData={selectedUser}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
              isLoading={updateStaffMutation.isPending}
              submitLabel="Update Staff"
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={!!deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteStaffMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
