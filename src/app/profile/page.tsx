"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/forms/profile-form";
import Sidebar from "@/components/sidebar";

// Define a strict type for user data
interface UserData {
  name: string;
  email: string;
  password: string;
  hashedPassword: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser) as UserData);
    }
  }, []);

  const handleSave = (updatedData: UserData) => {
    localStorage.setItem("user", JSON.stringify(updatedData));
    setUserData(updatedData);
    alert("Profile updated successfully!");
  };

  if (!userData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <ProfileForm userData={userData} onSave={handleSave} />
      </div>
    </div>
  );
};

export default ProfilePage;
