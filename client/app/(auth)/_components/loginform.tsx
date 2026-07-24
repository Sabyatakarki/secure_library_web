"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { loginUser } from "../../../lib/actions/auth-actions";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  // Security Verification State Variables
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaResult, setCaptchaResult] = useState(0);

  // Dynamic Multi-Operator CAPTCHA Generator
  const generateCaptcha = useCallback(() => {
    const operators = ["+", "-"];
    const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;

    // Ensure subtraction doesn't result in confusing negative numbers for users
    if (selectedOperator === "-" && num1 < num2) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    setCaptchaQuestion(`${num1} ${selectedOperator} ${num2}`);
    setCaptchaResult(selectedOperator === "+" ? num1 + num2 : num1 - num2);
    setCaptchaAnswer("");
  }, []);

  // Sync Timer for Successful Redirect Loops
  useEffect(() => {
    if (!successMessage) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify CAPTCHA validation before contacting backend vectors (Triggered after 3 failed database hits)
    if (failedAttempts >= 3) {
      if (Number(captchaAnswer) !== captchaResult) {
        setErrorMessage("Incorrect CAPTCHA answer. Please try again.");
        generateCaptcha();
        return;
      }
    }

    // Client-side regex password validation (Does not count toward attack/failure metrics)
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
    if (!passRegex.test(formData.password)) {
      setErrorMessage("Password must contain uppercase, lowercase, number and special character.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await loginUser(formData);

      // Check for 90-day password expiration
// Password expired
if (!response.success && response.isPasswordExpired) {
  setErrorMessage(response.message);

  setTimeout(() => {
    router.push(
      `/forget-password?email=${encodeURIComponent(
        response.email || formData.email
      )}`
    );
  }, 2000);

  setLoading(false);
  return;
}

      // MFA required
      if (response.requiresMfa) {
        localStorage.setItem("mfaEmail", response.email);
        router.push("/mfa_login");
        return;
      }

      if (!response.success) {
        // Handle server-enforced account lockouts cleanly without incrementing local failure count
        if (response.message?.includes("Account is locked")) {
          setErrorMessage(response.message);
          setLoading(false);
          return;
        }

        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);

        // Turn on mathematical verification wall if threshold met
        if (attempts >= 3 && captchaQuestion === "") {
          generateCaptcha();
        }

        setErrorMessage(response.message);
        setLoading(false);
        return;
      }

      const user = response.data;
      
      // Reset CAPTCHA and local memory metrics upon clean passport entry
      setFailedAttempts(0);
      setCaptchaQuestion("");
      setCaptchaAnswer("");

      setSuccessMessage("Welcome back! Login successful.");
      setLoading(false); // Instantly clears loading state while redirect countdown runs

      setTimeout(() => {
        if (user.role === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 3000);

    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong with the server connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7f5] via-[#edf3f0] to-[#e6ede9] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-5xl min-h-[650px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden grid md:grid-cols-12 border border-slate-100/80 backdrop-blur-sm">
        
        {/* LEFT SIDE: Interactive Login Credentials UI */}
        <div className="col-span-12 md:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white order-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Access your Secure Smart Library account dashboard</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50/60 backdrop-blur-sm border border-emerald-100 text-emerald-900 rounded-2xl text-sm flex items-center gap-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">✓</span>
              <div className="flex flex-col">
                <span className="font-semibold text-emerald-800">{successMessage}</span>
                <span className="text-xs text-emerald-600/90 font-medium">Redirecting to dashboard in {countdown}s...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50/60 backdrop-blur-sm border border-rose-100 text-rose-900 rounded-2xl text-sm font-medium flex items-center gap-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-xs shrink-0">!</span>
              <span className="text-rose-800 font-semibold">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 tracking-wider uppercase pl-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                required
                disabled={loading || !!successMessage}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 tracking-wider uppercase pl-1">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                  disabled={loading || !!successMessage}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition outline-none" 
                  disabled={loading || !!successMessage}
                >
                  {showPassword ? (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Implemented Professional Yellow Security Warning & Randomized Operator CAPTCHA */}
            {failedAttempts >= 3 && (
              <div className="space-y-3 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <p className="font-bold text-amber-800 text-sm">
                    Too many failed login attempts.
                  </p>
                  <p className="text-xs text-amber-600/90 font-medium mt-0.5">
                    Please complete the security verification below to continue.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 font-black text-slate-800 text-base select-none tracking-tight shadow-2xs">
                    {captchaQuestion} = ?
                  </div>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Answer"
                    className="w-full sm:w-28 bg-white border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:ring-4 focus:ring-amber-500/10"
                    required
                    disabled={loading || !!successMessage}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm select-none pt-1">
              <label className="flex items-center gap-2.5 text-slate-600 font-medium cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading || !!successMessage}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500/20 cursor-pointer transition accent-blue-600"
                />
                <span className="text-slate-500 group-hover:text-slate-800 transition duration-150">Remember Me</span>
              </label>

              <Link 
                href="/forget-password" 
                className="text-blue-600 font-bold hover:text-blue-700 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !!successMessage}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-bold tracking-wide shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all duration-200 active:scale-[0.99] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? "Verifying Credentials..." : "Sign In to System"}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Don't have an account yet? <Link href="/register" className="text-blue-600 font-extrabold hover:underline transition ml-1">Register here</Link>
          </p>
        </div>

        {/* RIGHT SIDE: Marketing / Context Hero Panel */}
        <div 
          className="hidden md:flex md:col-span-5 bg-slate-950 p-12 flex-col justify-between relative bg-cover bg-center text-white order-2"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(9, 15, 30, 0.95)), url('/library.jpg')` }}
        >
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black tracking-tighter text-lg shadow-md shadow-blue-500/20">L</div>
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-200">Smart Library</span>
          </div>

          <div className="my-auto relative z-10">
            <h2 className="text-3xl font-black tracking-tight leading-tight text-white mb-4">Access Your Digital Resources</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Log in to manage active rentals, reserve modern material arrivals, and view current real-time room configurations.</p>
            
            <div className="mt-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"Instant digital receipting configurations and real-time inventory checks make handling resource rentals seamless."</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">AK</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Alex K.</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Research Scholar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-start relative z-10">
            <span className="w-2 h-2 rounded-full bg-slate-800 transition-colors"></span>
            <span className="w-5 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"></span>
            <span className="w-2 h-2 rounded-full bg-slate-800 transition-colors"></span>
          </div>
        </div>

      </div>
    </div>
  );
}