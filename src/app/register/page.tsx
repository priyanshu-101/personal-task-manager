import RegisterForm from "@/components/forms/register-form";
import Sidebar from "@/components/sidebar";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
