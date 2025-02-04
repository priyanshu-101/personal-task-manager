"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginUser } from "../../api/auth";
import * as z from "zod";
import Spinner from "../spinner";

import {useRouter} from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSchema) {
      try {
        setLoading(true);
        const { email, password } = form;
        const response = await loginUser(email, password);
        if (response && response.user) {
          localStorage.setItem("accessToken", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          console.log("User data saved to localStorage:", response.user);
          router.push("/dashboard");
        }

      } catch (error) {
        console.error("Error during login:", error);
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loading ? (
        <Spinner/>
      ):(
        <>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">Login</Button>
      </>
      )}
    </form>
  );
}
