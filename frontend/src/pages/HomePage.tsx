import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  Search,
  TrendingUp,
  Eye,
  FileText,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/routes/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  // Fetch dynamic statistics
  const { data: stats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [casesRes, courtsRes, advocatesRes] = await Promise.allSettled([
        axiosInstance.get("/cases", { params: { limit: 1 } }),
        axiosInstance.get("/courts", { params: { limit: 1 } }),
        axiosInstance.get("/advocates", { params: { limit: 1 } }),
      ]);

      return {
        totalCases:
          casesRes.status === "fulfilled"
            ? casesRes.value.data?.data?.pagination?.total || 0
            : 0,
        totalCourts:
          courtsRes.status === "fulfilled"
            ? courtsRes.value.data?.data?.pagination?.total || 0
            : 0,
        totalAdvocates:
          advocatesRes.status === "fulfilled"
            ? advocatesRes.value.data?.data?.pagination?.total || 0
            : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Navigation */}
      <nav className="bg-white border-b border-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-primary">
                  Satyanvesh
                </h1>
                <p className="text-xs text-text-secondary">
                  न्यायको दस्तावेज, सत्यको गवाही।
                </p>
              </div>
            </Link>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-auto py-2 px-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-brand-primary text-white text-sm">
                          {getUserInitials(user.fullName || user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-text-primary">
                          {user.fullName || user.username}
                        </span>
                        <span className="text-xs text-text-secondary capitalize">
                          {user.role}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/cases")}>
                      Cases
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/bookmarks")}>
                      My Bookmarks
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-brand-primary hover:bg-brand-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary mb-4">
            Judiciary Transparency
            <br />
            <span className="text-brand-secondary">Made Simple</span>
          </h1>

          {/* Nepali Motto */}
          <p className="text-2xl font-semibold text-brand-accent mb-6">
            "न्यायको दस्तावेज, सत्यको गवाही।"
          </p>
          <p className="text-lg text-text-secondary italic mb-10">
            Record of justice, testimony of truth
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                type="search"
                placeholder="Search by case number, title, or court..."
                className="pl-12 h-14 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/cases");
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/cases">
              <Button variant="outline" size="lg">
                Browse Cases
              </Button>
            </Link>
            <Link to="/courts">
              <Button variant="outline" size="lg">
                View Courts
              </Button>
            </Link>
            <Link to="/advocates">
              <Button variant="outline" size="lg">
                Find Advocates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-primary mb-12">
            Why Choose Satyanvesh?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Full Transparency
                </h3>
                <p className="text-text-secondary">
                  Access complete case information, documents, and hearing
                  schedules in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Easy Search
                </h3>
                <p className="text-text-secondary">
                  Find cases quickly with our powerful search and filtering
                  system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-brand-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Real-time Updates
                </h3>
                <p className="text-text-secondary">
                  Get notified about case updates, hearings, and important
                  documents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-brand-primary mb-2">
                {stats?.totalCases?.toLocaleString() || "..."}
              </p>
              <p className="text-text-secondary">Total Cases</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-brand-primary mb-2">
                {stats?.totalCourts?.toLocaleString() || "..."}
              </p>
              <p className="text-text-secondary">Active Courts</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-brand-primary mb-2">
                {stats?.totalAdvocates?.toLocaleString() || "..."}
              </p>
              <p className="text-text-secondary">Registered Advocates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join Satyanvesh today and access transparent judiciary
              information.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-brand-primary hover:bg-white/90"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-background-secondary py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-text-secondary">
          <p className="mb-2">
            "न्यायको दस्तावेज, सत्यको गवाही।" - Record of justice, testimony of
            truth
          </p>
          <p>
            &copy; {new Date().getFullYear()} Satyanvesh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
