"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogIn, LogOut, UserPlus, User, FolderPlus, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/api/auth";
import Spinner from "./spinner";
import { useState } from "react";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  guestOnly?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
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
  const pathname = usePathname();
  const router = useRouter();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      if (storedUser?.email) {
        await logoutUser(storedUser.email); 
        localStorage.removeItem("user"); 
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (storedUser) {
      return item.requiresAuth || (!item.requiresAuth && !item.guestOnly);
    } else {
      return item.guestOnly || (!item.requiresAuth && !item.guestOnly);
    }
  });

  return (
    <aside className="w-64 min-h-screen bg-background border-r p-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">My App</h1>
            {storedUser && (
              <p className="text-sm text-muted-foreground mt-2">
                Welcome, {storedUser.name}
              </p>
            )}
          </div>

          <nav className="space-y-6">
            <ul className="space-y-2">
              {filteredNavItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === href
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground"
                    )}
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
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-md px-3 py-2 w-full transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
          </>
      )}

    </aside>
  );
}
