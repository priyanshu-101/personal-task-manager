"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Home, LogIn, LogOut, UserPlus, User, FolderPlus, CheckSquare, Menu } from "lucide-react";

interface User {
  name: string;
  email: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  guestOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home, requiresAuth: true },
  { href: "/project", label: "Create Project", icon: FolderPlus, requiresAuth: true },
  { href: "/task", label: "Create Task", icon: CheckSquare, requiresAuth: true },
  { href: "/profile", label: "Profile", icon: User, requiresAuth: true },
  { href: "/login", label: "Login", icon: LogIn, guestOnly: true },
  { href: "/register", label: "Register", icon: UserPlus, guestOnly: true },
];

export default function Sidebar() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem("user") || "null") as User | null;
      setStoredUser(user);
    }
  }, []);

  const handleLogout = async () => {
    if (!storedUser) return;
    try {
      await logoutUser(storedUser.email);
      localStorage.removeItem("user");
      setStoredUser(null);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden fixed top-1 left-4 z-50">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SidebarContent storedUser={storedUser} handleLogout={handleLogout} closeSidebar={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-background border-r p-4">
        <SidebarContent storedUser={storedUser} handleLogout={handleLogout} />
      </aside>
    </>
  );
}

function SidebarContent({
  storedUser,
  handleLogout,
  closeSidebar,
}: {
  storedUser: User | null;
  handleLogout: () => void;
  closeSidebar?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        {storedUser && <p className="text-sm text-muted-foreground mt-2">Welcome, {storedUser.name}</p>}
      </div>

      <nav className="space-y-6">
        <ul className="space-y-2">
          {navItems
            .filter((item) => (storedUser ? item.requiresAuth : item.guestOnly))
            .map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname === href ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
                  }`}
                  onClick={closeSidebar}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
        </ul>
        {storedUser && (
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                handleLogout();
                closeSidebar?.();
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 w-full transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
