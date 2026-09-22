import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

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
            onClick={() => navigate("/register")}
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Don't have an account?{" "}
            <span className="text-violet-400">
              Create one
            </span>
          </button>

        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Sparkles size={22} />
            </div>

            <h1 className="mt-6 text-3xl font-semibold">
              Welcome back
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Sign in to continue managing your production projects.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
          >

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
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

            <div className="mt-5">
              <label className="text-sm text-zinc-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-3 text-sm font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Your production projects and screenplay data will be
            securely associated with your account.
          </p>

        </div>

      </main>

    </div>
  );
}

export default LoginPage;