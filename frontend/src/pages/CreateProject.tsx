import { useState } from "react";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/projectService";

function CreateProject() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createProject({
        name,
        description,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to create project. Please try again."
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
            onClick={() => navigate("/dashboard")}
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
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

        </div>

      </nav>

      {/* Main */}

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">

        <div className="w-full max-w-2xl">

          {/* Heading */}

          <div className="mb-8">

            <p className="text-sm text-violet-400">
              New Production
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Create a project
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Start a new production project and prepare it
              for screenplay analysis, budgeting and scheduling.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
          >

            {error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Project name */}

            <div>

              <label className="text-sm text-zinc-300">
                Project name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Last Summer"
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />

            </div>

            {/* Description */}

            <div className="mt-6">

              <label className="text-sm text-zinc-300">
                Description
                <span className="ml-2 text-xs text-zinc-600">
                  Optional
                </span>
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your production..."
                rows={5}
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />

            </div>

            {/* Info */}

            <div className="mt-6 rounded-lg border border-violet-500/10 bg-violet-500/5 p-4">

              <div className="flex gap-3">

                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0 text-violet-400"
                />

                <div>

                  <p className="text-sm font-medium">
                    What happens next?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    After creating your project, you'll be able
                    to upload your screenplay and begin AI-powered
                    scene analysis.
                  </p>

                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="mt-7 flex items-center justify-end gap-3">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Plus size={17} />

                {loading
                  ? "Creating..."
                  : "Create Project"}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default CreateProject;