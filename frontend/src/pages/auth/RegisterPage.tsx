import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Scale, Upload, X } from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });


  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    setValue("avatar", undefined as unknown as FileList);
    setAvatarPreview(null);
  };

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar?.[0],
    };

    await registerMutation.mutateAsync(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-primary">Satyanvesh</h1>
          <p className="text-text-secondary mt-2">
            Judiciary Transparency Platform
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join Satyanvesh to access case information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label>Profile Picture (Optional)</Label>
                <div className="flex items-center gap-4">
                  {avatarPreview ? (
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-background-secondary"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 bg-status-error text-white rounded-full p-1 hover:bg-status-error/90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center">
                      <Upload className="w-8 h-8 text-text-secondary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      {...register("avatar")}
                      onChange={(e) => {
                        register("avatar").onChange(e);
                        handleAvatarChange(e);
                      }}
                      disabled={isSubmitting}
                      className="text-sm"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Max 5MB. JPG, PNG, or WEBP
                    </p>
                  </div>
                </div>
                {errors.avatar && (
                  <p className="text-sm text-status-error">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className={errors.fullName ? "border-status-error" : ""}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="text-sm text-status-error">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  {...register("username")}
                  className={errors.username ? "border-status-error" : ""}
                  disabled={isSubmitting}
                />
                {errors.username && (
                  <p className="text-sm text-status-error">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  className={errors.email ? "border-status-error" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-status-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type= "password"
                    placeholder="Create a strong password"
                    {...register("password")}
                    className={
                      errors.password ? "border-status-error pr-10" : "pr-10"
                    }
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-status-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type= "password"
                    placeholder="Re-enter your password"
                    {...register("confirmPassword")}
                    className={
                      errors.confirmPassword
                        ? "border-status-error pr-10"
                        : "pr-10"
                    }
                    disabled={isSubmitting}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-status-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-secondary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-text-secondary mt-8">
          &copy; {new Date().getFullYear()} Satyanvesh. All rights reserved.
        </p>
      </div>
    </div>
  );
}
