// src/app/login/page.tsx
import LoginForm from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Login to Your Account</h1>
        <LoginForm />
      </div>
    </div>
  );
}
