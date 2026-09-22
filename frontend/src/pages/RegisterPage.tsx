import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({
        full_name: fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* Navbar */}

      <nav className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles size={18} />
            </div>

            <div className="text-left">
              <div className="font-semibold tracking-tight">
                Script Analyzer
              </div>

              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Production Intelligence
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Already have an account?{" "}
            <span className="text-violet-400">
              Sign in
            </span>
          </button>

        </div>
      </nav>


      {/* Register */}

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Sparkles size={22} />
            </div>

            <h1 className="mt-6 text-3xl font-semibold">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Start turning your screenplays into production plans.
            </p>

          </div>


          <form
            onSubmit={handleRegister}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
          >

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            {/* Full Name */}

            <div>
              <label className="text-sm text-zinc-300">
                Full name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>


            {/* Email */}

            <div className="mt-5">
              <label className="text-sm text-zinc-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>


            {/* Password */}

            <div className="mt-5">
              <label className="text-sm text-zinc-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-3 text-sm font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>


          <p className="mt-6 text-center text-xs text-zinc-600">
            By creating an account, you can securely manage your
            production projects and screenplays.
          </p>

        </div>

      </main>

    </div>
  );
}

export default RegisterPage;