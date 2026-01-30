"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Key, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage("Invalid email or password");
        setLoading(false);
      } else if (result?.ok) {
        router.push("/atlas");
        router.refresh();
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper-mist flex items-center justify-center p-6 animate-hero-reveal">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-gray/20 shadow-sm p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-horizon-blue/10 rounded-full flex items-center justify-center text-horizon-blue mb-4">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-deep-shale">
            Access the Journey
          </h1>
          <p className="text-sm text-deep-shale/60">
            Enter your credentials to begin your ascent
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-deep-shale"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
              className="w-full px-4 py-2.5 border border-stone-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizon-blue/50 focus:border-horizon-blue transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-deep-shale"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 pr-10 border border-stone-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizon-blue/50 focus:border-horizon-blue transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-shale/40 hover:text-deep-shale transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 bg-horizon-blue text-white font-medium rounded-lg transition-all duration-300",
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-deep-shale hover:shadow-lg",
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Test Credentials Helper */}
        <div className="pt-6 border-t border-stone-gray/10 space-y-3">
          <p className="text-xs text-deep-shale/50 text-center font-medium">
            Test Credentials
          </p>
          <div className="space-y-2 text-xs text-deep-shale/60">
            <div className="flex items-center justify-between p-2 bg-stone-gray/5 rounded">
              <span>Student: student@example.com</span>
              <code className="text-[10px] bg-white px-2 py-0.5 rounded">
                student123
              </code>
            </div>
            <div className="flex items-center justify-between p-2 bg-stone-gray/5 rounded">
              <span>Admin: admin@example.com</span>
              <code className="text-[10px] bg-white px-2 py-0.5 rounded">
                admin123
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
