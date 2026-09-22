import { ArrowRight, BarChart3, CalendarDays, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* ==================== NAVBAR ==================== */}

      <nav className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles size={18} />
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                Script Analyzer
              </div>

              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Production Intelligence
              </div>
            </div>

          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">

            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>

          </div>

          {/* Authentication */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/login")}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-500"
            >
              Get Started
            </button>

          </div>

        </div>
      </nav>


      {/* ==================== HERO ==================== */}

      <main>

        <section className="relative overflow-hidden">

          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-32 text-center">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">

              <Sparkles size={14} />

              AI-powered production planning

            </div>


            {/* Main heading */}
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">

              Turn your screenplay into

              <br />

              <span className="text-violet-500">
                a production plan.
              </span>

            </h1>


            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">

              Analyze your screenplay with AI, break down scenes,
              estimate production costs, build shooting schedules,
              and make smarter production decisions.

            </p>


            {/* CTA buttons */}
            <div className="mt-10 flex justify-center gap-4">

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium transition hover:bg-violet-500"
              >
                Start a Project
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm transition hover:bg-white/10"
              >
                Sign In
              </button>

            </div>

          </div>

        </section>


        {/* ==================== FEATURES ==================== */}

        <section
          id="features"
          className="border-t border-white/10 bg-[#0b0b0e]"
        >

          <div className="mx-auto max-w-6xl px-6 py-24">

            <div className="text-center">

              <p className="text-xs uppercase tracking-widest text-violet-400">
                Production Intelligence
              </p>

              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Everything you need to plan smarter
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-zinc-500">
                From screenplay analysis to production planning,
                everything is organized in one place.
              </p>

            </div>


            {/* Feature cards */}
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* Scene Breakdown */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-violet-500/20">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <FileText size={20} />
                </div>

                <h3 className="mt-5 font-medium">
                  Scene Breakdown
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Identify scenes, characters, locations, props,
                  costumes and production requirements.
                </p>

              </div>


              {/* Budget */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-violet-500/20">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <BarChart3 size={20} />
                </div>

                <h3 className="mt-5 font-medium">
                  Budget Estimation
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Estimate production costs using scene requirements
                  and production resources.
                </p>

              </div>


              {/* Scheduling */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-violet-500/20">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <CalendarDays size={20} />
                </div>

                <h3 className="mt-5 font-medium">
                  Smart Scheduling
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Organize scenes into efficient shooting schedules
                  while considering production constraints.
                </p>

              </div>


              {/* AI Copilot */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-violet-500/20">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Sparkles size={20} />
                </div>

                <h3 className="mt-5 font-medium">
                  AI Copilot
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Ask questions about your production and receive
                  context-aware recommendations.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================== HOW IT WORKS ==================== */}

        <section
          id="how-it-works"
          className="border-t border-white/10"
        >

          <div className="mx-auto max-w-5xl px-6 py-24">

            <div className="text-center">

              <p className="text-xs uppercase tracking-widest text-violet-400">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                From screenplay to production plan
              </h2>

            </div>


            <div className="mt-16 grid gap-10 md:grid-cols-3">

              {/* Step 1 */}
              <div className="text-center">

                <div className="font-mono text-sm text-violet-500">
                  01
                </div>

                <h3 className="mt-3 font-medium">
                  Create a project
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Create an account and start a new production project.
                </p>

              </div>


              {/* Step 2 */}
              <div className="text-center">

                <div className="font-mono text-sm text-violet-500">
                  02
                </div>

                <h3 className="mt-3 font-medium">
                  Upload your screenplay
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Upload your screenplay securely for AI analysis.
                </p>

              </div>


              {/* Step 3 */}
              <div className="text-center">

                <div className="font-mono text-sm text-violet-500">
                  03
                </div>

                <h3 className="mt-3 font-medium">
                  Build your production plan
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Review your scenes, budget and schedule and make
                  informed production decisions.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================== FINAL CTA ==================== */}

        <section
          id="about"
          className="border-t border-white/10 bg-[#0b0b0e]"
        >

          <div className="mx-auto max-w-3xl px-6 py-24 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <Sparkles size={22} />
            </div>

            <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
              Ready to plan your next production?
            </h2>

            <p className="mt-4 text-zinc-500">
              Create an account and turn your screenplay into
              a production-ready plan.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-medium transition hover:bg-violet-500"
            >
              Get Started
            </button>

          </div>

        </section>

      </main>


      {/* ==================== FOOTER ==================== */}

      <footer className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-zinc-600 lg:px-10">
          © 2026 Script Analyzer. Production Intelligence Platform.
        </div>

      </footer>

    </div>
  );
}

export default LandingPage;