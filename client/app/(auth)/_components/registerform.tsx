"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phoneNumber: "",
    department: "",
    semester: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    colorClass: "bg-slate-200 w-0",
    textColor: "text-slate-400"
  });

  useEffect(() => {
    if (!successMessage) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [successMessage]);

  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength({ score: 0, label: "Not Entered", colorClass: "bg-slate-200 w-0", textColor: "text-slate-400" });
      return;
    }

    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const hasValidLength = pass.length >= 8 && pass.length <= 12;

    let passedRules = 0;
    if (hasUpper) passedRules++;
    if (hasLower) passedRules++;
    if (hasNumber) passedRules++;
    if (hasSpecial) passedRules++;
    if (hasValidLength) passedRules++;

    if (passedRules <= 2) {
      setPasswordStrength({ score: 1, label: "Weak", colorClass: "bg-rose-500 w-1/3", textColor: "text-rose-600" });
    } else if (passedRules <= 4) {
      setPasswordStrength({ score: 2, label: "Medium", colorClass: "bg-amber-500 w-2/3", textColor: "text-amber-600" });
    } else {
      setPasswordStrength({ score: 3, label: "Strong", colorClass: "bg-emerald-500 w-full", textColor: "text-emerald-600" });
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!/^\d+$/.test(formData.studentId)) {
      setErrorMessage("Personal ID must contain only numeric characters.");
      return;
    }

    if (!/^\d+$/.test(formData.phoneNumber)) {
      setErrorMessage("Phone number must contain only digits.");
      return;
    }

    if (!formData.department) {
      setErrorMessage("Please select your primary academic department.");
      return;
    }
    
    if (!formData.semester) {
      setErrorMessage("Please select your current active semester.");
      return;
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
    if (!passRegex.test(formData.password)) {
      setErrorMessage("Password must be 8-12 characters and include uppercase, lowercase, numbers, and special symbols.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Confirmation password configuration mismatch.");
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("You must agree to the system terms.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5050/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentId: formData.studentId,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
          semester: Number(formData.semester),
          address: formData.address || undefined,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Registration operation failure.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Account created successfully!");
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (error) {
      setErrorMessage("Something went wrong with the server connection.");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7f5] via-[#edf3f0] to-[#e6ede9] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-6xl min-h-[720px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden grid md:grid-cols-12 border border-slate-100 backdrop-blur-sm">
        
        {/* LEFT SIDE Panel */}
        <div 
          className="hidden md:flex md:col-span-5 bg-slate-950 p-12 flex-col justify-between relative bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(9, 15, 30, 0.95)), url('/library.jpg')` }}
        >
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black tracking-tighter text-lg shadow-md border border-white/10">L</div>
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-200">Smart Library</span>
          </div>

          <div className="my-auto relative z-10">
            <h2 className="text-3xl font-black tracking-tight leading-tight text-white mb-4">Your Academic Portal Companion</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Instantly discover textbooks, request technical articles, and map library floor seats.</p>
            
            <div className="mt-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
              <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"This integrated platform completely streamlines my project research sprints. Extremely functional design."</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">MG</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Maria G.</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Final Year CS Student</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-start relative z-10">
            <span className="w-5 h-2 rounded-full bg-blue-600 transition-all"></span>
            <span className="w-2 h-2 rounded-full bg-slate-800 transition-colors"></span>
            <span className="w-2 h-2 rounded-full bg-slate-800 transition-colors"></span>
          </div>
        </div>

        {/* RIGHT SIDE Panel */}
        <div className="col-span-12 md:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Create an account</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Register to activate your institutional access license</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-2xl text-sm flex items-center gap-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">✓</span>
              <div className="flex flex-col">
                <span className="font-semibold text-emerald-800">{successMessage}</span>
                <span className="text-xs text-emerald-600/90 font-medium">Redirecting to login portal in {countdown}s...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-900 rounded-2xl text-sm font-medium flex items-center gap-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-xs shrink-0">!</span>
              <span className="text-rose-800 font-semibold">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Full Name</label>
                <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Peronal ID</label>
                <input type="text" name="studentId" placeholder="20261102" value={formData.studentId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Email</label>
                <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Phone Number</label>
                <input type="text" name="phoneNumber" placeholder="9841234567" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 cursor-pointer appearance-none" style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }} required disabled={loading || !!successMessage}>
                  <option value="" disabled hidden>Select Department</option>
                  <option value="Computer Science">Bsc Computing</option>
                  <option value="Information Technology">Bsc Ethical Hacking</option>
                  <option value="Software Engineering">Bsc Artificial Intelligance(AI)</option>
                  
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 cursor-pointer appearance-none" style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }} required disabled={loading || !!successMessage}>
                  <option value="" disabled hidden>Select Semester</option>
                  {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Residential Address (Optional)</label>
                <input type="text" name="address" placeholder="Campus Drive, Block B" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" disabled={loading || !!successMessage} />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Account Password</label>
                <div className="relative flex items-center">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 transition outline-none" disabled={loading || !!successMessage}>
                    {showPassword ? (
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                  </button>
                </div>
                
                {/* Strength Indicator */}
                <div className="px-1 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                    <span className="text-slate-400 uppercase tracking-wider">Complexity:</span>
                    <span className={`${passwordStrength.textColor} font-extrabold`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${passwordStrength.colorClass}`} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full self-start">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase pl-1">Confirm Password</label>
                <div className="relative flex items-center">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5" required disabled={loading || !!successMessage} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 transition outline-none" disabled={loading || !!successMessage}>
                    {showConfirmPassword ? (
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Terms Checkbox */}
            <div className="pt-2 select-none">
              <label className="flex items-start gap-3 text-sm text-slate-500 font-medium cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={loading || !!successMessage}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20 cursor-pointer accent-blue-600"
                />
                <span className="group-hover:text-slate-800 transition duration-150 text-xs sm:text-sm">I read and accept the user registration terms & system security policy.</span>
              </label>
            </div>

            <div className="pt-3">
              <button 
                type="submit" 
                disabled={loading || !acceptTerms || !!successMessage} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl text-sm font-bold tracking-wide shadow-md transition-all duration-150 active:scale-[0.99] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Create Student Account"}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 font-medium">
            Already registered? <Link href="/login" className="text-blue-600 font-extrabold hover:underline transition ml-1">Log In here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}