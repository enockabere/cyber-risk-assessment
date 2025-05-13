"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  KeyRound,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  FileBarChart2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    if (!name) {
      setError("Please enter your full name");
      return false;
    }
    if (!email) {
      setError("Please enter your email address");
      return false;
    }
    if (!password) {
      setError("Please enter your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setError("Password must include uppercase, lowercase, and a number");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        toast.success("Account created! Redirecting...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans overflow-hidden">
      <div
        className={`hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex-col justify-center p-6 space-y-4 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-indigo-600 rounded-lg transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Lock className="w-6 h-6 text-white transition-all duration-300" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              CRAP
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Create Your <span className="text-indigo-200">Account</span>
          </h1>
          <p className="text-sm text-indigo-100 max-w-md">
            Join our platform to evaluate and improve cybersecurity posture.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              delay={index * 100}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
      <div
        className={`w-full md:w-1/2 flex items-center justify-center p-4 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-5">
            <div className="flex flex-col items-center mb-3">
              <div className="mb-2 p-2 bg-indigo-100 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-indigo-200 cursor-pointer">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-xs text-gray-500">
                Get started in just a few seconds
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mb-3 py-2 bg-red-50 text-red-800 border border-red-200 animate-shake text-xs"
              >
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              className="space-y-3"
            >
              <div className="space-y-1 group">
                <Label
                  htmlFor="name"
                  className="text-xs font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-8 h-9 text-sm rounded-md bg-gray-50 focus:bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1 group">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-8 h-9 text-sm rounded-md bg-gray-50 focus:bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1 group">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-2 top-2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8 h-9 text-sm rounded-md bg-gray-50 focus:bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1 group">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-2 top-2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />

                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-8 pr-8 h-9 text-sm rounded-md bg-gray-50 focus:bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400"
                        : confirmPassword === password && confirmPassword
                        ? "border-green-500"
                        : ""
                    }`}
                  />
                  {confirmPassword && (
                    <div className="absolute right-2 top-2">
                      {confirmPassword === password ? (
                        <span className="text-green-600">✔</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-9 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all duration-300 rounded-md shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                  loading ? "opacity-80" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ArrowRight className="mr-1 h-4 w-4" />
                    Register
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-3 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature data matching login page
const features = [
  {
    icon: <ShieldCheck className="text-indigo-200 w-4 h-4" />,
    title: "Secure Registration",
    desc: "Your data is encrypted end-to-end.",
  },
  {
    icon: <FileBarChart2 className="text-indigo-200 w-4 h-4" />,
    title: "Quick Access",
    desc: "Get started immediately after signing up.",
  },
  {
    icon: <Lock className="text-indigo-200 w-4 h-4" />,
    title: "Full Control",
    desc: "Manage your account and preferences.",
  },
];

function FeatureCard({
  icon,
  title,
  desc,
  delay,
  mounted,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
  mounted: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-start space-x-3 bg-indigo-800 bg-opacity-30 rounded-lg p-3 hover:bg-opacity-50 transition-all duration-300 backdrop-blur-sm border border-indigo-700 border-opacity-30 cursor-pointer transform ${
        isHovered ? "scale-103" : ""
      } ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`p-1.5 bg-indigo-700 rounded-md transform transition-all duration-300 ${
          isHovered ? "rotate-6 scale-110" : ""
        }`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-indigo-100 text-xs leading-snug">{desc}</p>
      </div>
    </div>
  );
}
