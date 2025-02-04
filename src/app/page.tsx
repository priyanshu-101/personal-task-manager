"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false); 
  }, [router]); 

  return (
    <div>
      {isLoading && <Spinner />}
    </div>
  );
}
