import LoginForm from "@/components/forms/login-form";
import Sidebar from "@/components/sidebar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> 
      
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Login to Your Account</h1>
          <LoginForm /> 
        </div>
      </div>
    </div>
  );
}
