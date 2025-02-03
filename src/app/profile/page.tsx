"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/forms/profile-form";
import Sidebar from "@/components/sidebar";

const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  const handleSave = (updatedData: any) => {
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
