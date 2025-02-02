"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div>
{isLoading && <Spinner /> }
    </div>
  );
}
