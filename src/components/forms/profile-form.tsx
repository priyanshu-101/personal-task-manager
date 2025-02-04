"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Eye, EyeOff } from "lucide-react";
import { updateuser } from "@/api/user";

// Define a type for user data
interface UserData {
  name: string;
  email: string;
  password: string;
  hashedPassword: string;
}

const ProfileForm = ({ userData }: { userData: UserData }) => {
  const [formData, setFormData] = useState<UserData>({
    name: userData.name || "",
    email: userData.email || "",
    password: "", // Leave blank initially
    hashedPassword: userData.hashedPassword || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  useEffect(() => {
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      password: "", // Reset password field
      hashedPassword: userData.hashedPassword || "",
    });
  }, [userData]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
    setIsPasswordChanged(true);
  };

  const handleSave = async () => {
    const updatedData: UserData & { isPasswordChanged: boolean } = {
      name: formData.name,
      email: formData.email,
      password: isPasswordChanged ? formData.password : formData.hashedPassword,
      hashedPassword: isPasswordChanged ? formData.password : formData.hashedPassword,
      isPasswordChanged,
    };

    try {
      await updateProfile(updatedData);
      alert("Profile updated successfully!");
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Corrected function signature with proper type
  const updateProfile = async (updatedData: UserData & { isPasswordChanged: boolean }) => {
    try {
      const response = await updateuser(updatedData.name, updatedData.email, updatedData.password);
      console.log("Update Profile Response:", response);
    } catch (error) {
      console.error("Error updating profile: " + error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label htmlFor="name" className="text-sm font-semibold">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mt-2"
            required
          />
        </div>

        <div className="relative">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password {isPasswordChanged ? "(Changed)" : "(Leave empty to keep current)"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handlePasswordChange}
              className="w-full mt-2 pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center justify-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {!isPasswordChanged && (
            <p className="text-sm text-gray-500 mt-1">Current password is stored securely</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
