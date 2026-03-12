"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/app/types/forms";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password");
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("[LOGIN]", error);
      setServerError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            YouSafe Admin
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Sign in to manage the platform
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs sm:text-sm">{serverError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="admin@yousafe.com"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-slate-900 
                text-sm outline-none transition-all
                ${
                  errors.email
                    ? "border-red-400 focus:border-red-400"
                    : "border-slate-200 focus:border-teal-500"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-slate-900 
                text-sm outline-none transition-all
                ${
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-slate-200 focus:border-teal-500"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400
              text-white font-medium py-2.5 sm:py-3 rounded-lg transition-colors 
              text-sm sm:text-base mt-1"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
