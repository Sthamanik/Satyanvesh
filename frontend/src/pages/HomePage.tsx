import { Link } from "react-router-dom";
import { Scale, Search, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
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
              </div>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary mb-6">
            Judiciary Transparency
            <br />
            <span className="text-brand-secondary">Made Simple</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10">
            Access public case information, track hearings, and stay informed
            about the judicial process in Nepal.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                type="search"
                placeholder="Search by case number, title, or court..."
                className="pl-12 h-14 text-lg"
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

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-brand-primary mb-2">
                2,456
              </p>
              <p className="text-text-secondary">Total Cases</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-primary mb-2">48</p>
              <p className="text-text-secondary">Active Courts</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-primary mb-2">
                12,453
              </p>
              <p className="text-text-secondary">Documents</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-primary mb-2">342</p>
              <p className="text-text-secondary">Advocates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join Satyanvesh today and access transparent judiciary information.
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

      {/* Footer */}
      <footer className="bg-white border-t border-background-secondary py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-text-secondary">
          <p>
            &copy; {new Date().getFullYear()} Satyanvesh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
