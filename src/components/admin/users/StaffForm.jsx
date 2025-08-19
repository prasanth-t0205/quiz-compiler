import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const StaffForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Create Staff",
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    permissions: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        password: "",
        permissions: initialData.permissions || [],
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      permissions: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullname">Full Name</Label>
        <Input
          id="fullname"
          value={formData.fullname}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              fullname: e.target.value,
            }))
          }
          placeholder="Enter full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          placeholder={
            initialData
              ? "Leave empty to keep current password"
              : "Enter password"
          }
          required={!initialData}
        />
      </div>

      <div className="space-y-2">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2">
          {["read", "write", "update", "delete"].map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={formData.permissions.includes(permission)}
                onCheckedChange={(checked) =>
                  handlePermissionChange(permission, checked)
                }
              />
              <Label htmlFor={permission} className="capitalize">
                {permission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;
