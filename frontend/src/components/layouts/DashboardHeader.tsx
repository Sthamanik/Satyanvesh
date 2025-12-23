import { Menu, Search, Bell, LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const user = useUser();
  const logoutMutation = useLogout();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-background-secondary shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Button (Mobile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                type="search"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 lg:w-96"
              />
            </div>
          </form>
        </div>

        {/* Right: Notifications & User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-status-error">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 hover:bg-background-secondary cursor-pointer border-b">
                  <p className="text-sm font-medium">New hearing scheduled</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Case #2024-123 hearing on Jan 15
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    2 hours ago
                  </p>
                </div>
                <div className="p-3 hover:bg-background-secondary cursor-pointer border-b">
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-text-secondary mt-1">
                    New evidence added to Case #2024-098
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    5 hours ago
                  </p>
                </div>
                <div className="p-3 hover:bg-background-secondary cursor-pointer">
                  <p className="text-sm font-medium">Case status updated</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Case #2024-067 moved to "Under Hearing"
                  </p>
                  <p className="text-xs text-text-secondary mt-1">1 day ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto py-2 px-3"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-medium">
                    {user ? getInitials(user.fullName) : "U"}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">
                    {user?.role || "Role"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="flex items-center cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="flex items-center cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-status-error cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
