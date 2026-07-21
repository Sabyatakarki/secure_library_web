"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../_components/header";
import Footer from "../_components/footer";

export default function HomePage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Step 3: Check login status when page loads
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch(
          "http://localhost:5050/api/users/profile",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setCurrentUser(null);
        } else {
          const result = await response.json();
          setCurrentUser(result.data);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    checkUser();
  }, []);

  // Step 4: Role-aware navigation handler
  const handleGetStarted = () => {
    if (!currentUser) {
      router.push("/register");
      return;
    }

    if (currentUser.role === "Admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Header />

      <main className="bg-slate-50 text-slate-800 antialiased scroll-smooth">

        {/* Hero Section */}
        <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-blue-50/50 to-transparent -z-10" />
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-6 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Version 2.0 
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto">
            Secure Smart <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Library Hub</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A secure campus management system allowing students to search, reserve, and manage academic literature effortlessly while enabling zero-friction logistics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            {/* Step 5 & 6: Dynamic CTA Button */}
            <button
              onClick={handleGetStarted}
              disabled={loadingUser}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingUser ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : currentUser ? (
                "Go to Dashboard"
              ) : (
                "Get Started Now"
              )}
            </button>

            <a
              href="#books"
              className="w-full sm:w-auto border border-slate-200 bg-white text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-50 shadow-sm transition-all text-center"
            >
              Browse Digital Catalog
            </a>
          </div>
        </section>

        {/* BOOKS SECTION */}
        <section id="books" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-200/60 scroll-mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Resource Catalog</span>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight mt-1">Top Academic Picks</h2>
              <p className="text-sm text-slate-500 mt-1">Most frequently reserved materials this semester across departments.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Introduction to Algorithms", author: "Cormen, Leiserson", tag: "Computer Science", status: "Available" },
              { title: "Clean Architecture", author: "Robert C. Martin", tag: "Software Eng.", status: "Reserved" },
              { title: "Principles of Data Science", author: "Sinan Ozdemir", tag: "Data Analytics", status: "Available" },
              { title: "Computer Networking", author: "James Kurose", tag: "Information Tech.", status: "Available" },
              { title: "JavaScript: The Good Parts", author: "Douglas Crockford", tag: "Web Development", status: "Available" },
              { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", tag: "AI / ML", status: "Reserved" }
            ].map((book, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      {book.tag}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      book.status === "Available" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-lg mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-slate-500 mb-6">By {book.author}</p>
                </div>
                <Link 
                  href={currentUser ? "/dashboard" : "/login"} 
                  className="w-full text-center text-xs font-semibold py-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-100 rounded-xl transition"
                >
                  Reserve This Volume
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Core System Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-200/60">
          <h2 className="text-3xl font-bold text-center text-slate-950 tracking-tight">
            Designed for Modern Academic Workflows
          </h2>
          <p className="text-sm text-center text-slate-500 mt-2 max-w-md mx-auto">Optimized infrastructure layers supporting campus logistics.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: "📖", title: "Book Rental", desc: "Borrow standard references instantly with an active user dashboard configuration." },
              { icon: "📚", title: "Online Reservation", desc: "Lock upcoming publications and resource materials before setting foot inside the faculty hub." },
              { icon: "🔒", title: "Secure Guarding", desc: "Advanced validation layers powered by encrypted records and structured JWT payloads." },
              { icon: "⚡", title: "Instant Cataloging", desc: "Query specific databases by deep title string, author profile, or metadata classification tags." }
            ].map((feat, index) => (
              <div key={index} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-xl text-2xl flex items-center justify-center mb-5">{feat.icon}</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-200/60 scroll-mt-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Our Identity</span>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight mt-1 mb-4">Empowering Campus Research</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                The Secure Smart Library system was conceptualized to bridge the gap between traditional resource archival and instant campus availability. We ensure that student materials are locked down, tracked safely via dynamic user profiles, and kept highly accessible.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By optimizing how departments browse reference material matrices, we decrease wait times and completely eliminate double-booking overlaps.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-white border border-slate-100 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission</h4>
                  <p className="text-xs text-slate-600 mt-1">Zero latency inside the student research acquisition loop.</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security</h4>
                  <p className="text-xs text-slate-600 mt-1">Full isolation layer using cryptographic session verification tokens.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-between border border-slate-800">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl" />
              <div>
                <span className="text-blue-500 text-3xl">“</span>
                <p className="text-base font-medium text-slate-300 italic leading-relaxed">
                  Our core priority is absolute accuracy. Students should know exactly what volumes are held on campus floors before initiating their commute layout.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-xs font-bold flex items-center justify-center">SL</div>
                <div>
                  <h5 className="text-xs font-bold text-white">Administration Terminal</h5>
                  <p className="text-[10px] text-slate-500">System Operations Unit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Flowchart */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-200/60">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Four Simple Steps</h2>
            <p className="text-sm text-slate-500 mt-2">Get your required study parameters configured in minutes.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { num: "01", step: "Secure Account Creation", detail: "Register with your verified student identity keys." },
              { num: "02", step: "Targeted Database Search", detail: "Locate required items using our high-speed lookup indexes." },
              { num: "03", step: "One-Click Hold Lock", detail: "Reserve dynamic volumes instantly to prevent manual loss." },
              { num: "04", step: "In-Person Desk Pickup", detail: "Present your authenticated portal token to confirm release." }
            ].map((flow, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black text-blue-600/20 tracking-tighter group-hover:text-blue-600/40 transition">{flow.num}</span>
                  <div className="h-px bg-slate-200 flex-1 hidden lg:block group-last:hidden" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{flow.step}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">{flow.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="bg-slate-950 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center relative z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-blue-500 tracking-tight">1,500+</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Archived Volumes</p>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-blue-500 tracking-tight">800+</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Authenticated Peers</p>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-blue-500 tracking-tight">250+</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Active Allocations</p>
            </div>
          </div>
        </section>

        {/* System Call To Action Section */}
        <section className="max-w-4xl mx-auto text-center py-24 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            Ready to Explore Our Catalog?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Construct your library catalog matrix configurations today. Gain secure access to instant material allocation logs, history matrices, and pending drop queues.
          </p>
          <button
            onClick={handleGetStarted}
            disabled={loadingUser}
            className="inline-flex items-center justify-center gap-2 mt-8 bg-blue-600 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loadingUser ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : currentUser ? (
              "Go to Dashboard"
            ) : (
              "Register Student Profile"
            )}
          </button>
        </section>

      </main>

      <Footer />
    </>
  );
}