"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutGrid,
  Lock,
  FileBarChart2,
  Bot,
  LogIn,
  Mail,
  KeyRound,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    if (!email) {
      setError("Please enter your email address");
      return false;
    }
    if (!password) {
      setError("Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Left panel with feature cards - more compact */}
      <div
        className={`hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex-col justify-center p-6 space-y-4 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-indigo-600 rounded-lg transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Bot className="w-6 h-6 text-white transition-all duration-300" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              CRAP
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Cyber Risk{" "}
            <span className="text-indigo-200">Assessment Portal</span>
          </h1>
          <p className="text-sm text-indigo-100 max-w-md">
            Smart platform for universities to evaluate and improve their
            cybersecurity posture.
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

      {/* Right login form - more compact */}
      <div
        className={`w-full md:w-1/2 flex items-center justify-center p-4 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="mb-3 p-2 bg-indigo-100 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-indigo-200 cursor-pointer">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-xs text-gray-500">
                Sign in to access your secure dashboard
              </p>
            </div>

            <Separator className="my-4 bg-gray-100" />

            {error && (
              <Alert
                variant="destructive"
                className="mb-4 py-2 bg-red-50 text-red-800 border border-red-200 animate-shake text-xs"
              >
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
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
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
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

              <Button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-all duration-300 rounded-md shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-1 h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
              >
                Request access
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// More concise feature data
const features = [
  {
    icon: <ShieldCheck className="text-indigo-200 w-4 h-4" />,
    title: "Threat Detection",
    desc: "Monitor and classify potential cybersecurity risks.",
  },
  {
    icon: <FileBarChart2 className="text-indigo-200 w-4 h-4" />,
    title: "Compliance Tracking",
    desc: "Assess adherence to global security standards.",
  },
  {
    icon: <LayoutGrid className="text-indigo-200 w-4 h-4" />,
    title: "Risk Matrix",
    desc: "Visualize your cybersecurity risk level.",
  },
  {
    icon: <Lock className="text-indigo-200 w-4 h-4" />,
    title: "Privacy & Control",
    desc: "Your data is encrypted and never shared.",
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
