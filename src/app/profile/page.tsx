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
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser) as UserData);
      }
    }
  }, []);

  if (!userData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <ProfileForm userData={userData} />
      </div>
    </div>
  );
};

export default ProfilePage;
