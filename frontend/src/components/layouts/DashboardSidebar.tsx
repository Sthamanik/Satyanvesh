import { Link, useLocation } from "react-router-dom";
import {
  X,
  Scale,
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Gavel,
  Building2,
  Calendar,
  BookmarkIcon,
  BarChart3,
  Settings,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/routes/stores/auth.store";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[]; // If specified, only these roles can see this item
}

// Navigation items
const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "judge", "clerk"],
  },
  {
    name: "Cases",
    href: "/cases",
    icon: Briefcase,
  },
  {
    name: "My Cases",
    href: "/cases/my-cases",
    icon: Briefcase,
    roles: ["judge", "lawyer", "litigant"],
  },
  {
    name: "Hearings",
    href: "/hearings",
    icon: Calendar,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "Advocates",
    href: "/advocates",
    icon: Users,
  },
  {
    name: "Courts",
    href: "/courts",
    icon: Building2,
  },
  {
    name: "Case Types",
    href: "/case-types",
    icon: Gavel,
  },
  {
    name: "My Bookmarks",
    href: "/bookmarks",
    icon: BookmarkIcon,
  },
];

// Admin-only items
const adminNavigation: NavItem[] = [
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin", "judge"],
  },
  {
    name: "User Management",
    href: "/users",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const location = useLocation();
  const user = useUser();

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const filteredAdminNavigation = adminNavigation.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-background-secondary transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-background-secondary">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-primary">
                Satyanvesh
              </h1>
              <p className="text-xs text-text-secondary">Judiciary Platform</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {filteredAdminNavigation.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Administration
                </p>
              </div>
              <div className="space-y-1">
                {filteredAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-primary text-white"
                          : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-background-secondary">
          <div className="bg-background-secondary rounded-lg p-3">
            <p className="text-xs font-medium text-text-primary mb-1">
              Need Help?
            </p>
            <p className="text-xs text-text-secondary mb-2">
              Check our documentation and FAQs
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Documentation
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
