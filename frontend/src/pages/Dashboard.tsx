import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";
import type { Project } from "../services/projectService";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectError("");

        const data = await getProjects();

        setProjects(data);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        setProjectError(
          "Unable to load your projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">

      {/* Sidebar */}

      <aside className="flex w-64 flex-col border-r border-white/10 bg-[#0b0b0e]">

        {/* Logo */}

        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
            <Sparkles size={18} />
          </div>

          <div>
            <div className="font-semibold tracking-tight">
              Script Analyzer
            </div>

            <div className="text-[9px] uppercase tracking-wider text-zinc-500">
              Production Intelligence
            </div>
          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-3 py-6">

          <p className="px-3 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
            Workspace
          </p>

          <div className="mt-3 space-y-1">

            <button
              className="flex w-full items-center gap-3 rounded-lg bg-violet-500/10 px-3 py-2.5 text-sm text-violet-400"
            >
              <LayoutDashboard size={17} />
              Overview
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <FolderOpen size={17} />
              Projects
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <FileText size={17} />
              Scene Breakdown
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <BarChart3 size={17} />
              Budget
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <CalendarDays size={17} />
              Schedule
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Sparkles size={17} />
              AI Copilot
            </button>

          </div>

          <p className="mt-10 px-3 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
            System
          </p>

          <div className="mt-3">

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={17} />
              Settings
            </button>

          </div>

        </nav>

        {/* User */}

        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-medium text-violet-300">
              {user.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium">
                {user.full_name || "User"}
              </p>

              <p className="truncate text-xs text-zinc-600">
                {user.email || ""}
              </p>

            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="text-zinc-600 transition hover:text-white"
            >
              <LogOut size={17} />
            </button>

          </div>

        </div>

      </aside>

      {/* Main */}

      <main className="flex-1">

        {/* Top bar */}

        <header className="flex h-20 items-center justify-between border-b border-white/10 px-8">

          <div>

            <h1 className="text-lg font-medium">
              Overview
            </h1>

            <p className="text-xs text-zinc-600">
              Production workspace
            </p>

          </div>

          <button
            onClick={() => navigate("/create-project")}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-500"
          >
            <Plus size={17} />
            New Project
          </button>

        </header>

        {/* Dashboard content */}

        <div className="p-8">

          {/* Welcome */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-violet-400">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  {user.full_name || "Producer"}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
                  Turn your screenplay into a
                  production-ready plan. Analyze
                  scenes, estimate your budget and
                  organize your shooting schedule.
                </p>

              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 md:flex">
                <Sparkles size={28} />
              </div>

            </div>

            <button
              onClick={() => navigate("/create-project")}
              className="mt-7 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition hover:bg-white/10"
            >
              <Plus size={17} />
              Create your first project
            </button>

          </div>

          {/* Stats */}

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

              <p className="text-xs text-zinc-600">
                Total Projects
              </p>

              <p className="mt-3 text-2xl font-semibold">
                {projects.length}
              </p>

            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

              <p className="text-xs text-zinc-600">
                Scenes Analyzed
              </p>

              <p className="mt-3 text-2xl font-semibold">
                0
              </p>

            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

              <p className="text-xs text-zinc-600">
                Active Productions
              </p>

              <p className="mt-3 text-2xl font-semibold">
                {
                  projects.filter(
                    (project) =>
                      project.status !== "completed"
                  ).length
                }
              </p>

            </div>

          </div>

          {/* Recent Projects */}

          <div className="mt-10">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-medium">
                  Recent Projects
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  Your latest production projects
                </p>

              </div>

            </div>

            {/* Loading */}

            {loadingProjects && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] py-16 text-center">

                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

                <p className="mt-4 text-xs text-zinc-600">
                  Loading projects...
                </p>

              </div>
            )}

            {/* Error */}

            {!loadingProjects && projectError && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
                {projectError}
              </div>
            )}

            {/* No Projects */}

            {!loadingProjects &&
              !projectError &&
              projects.length === 0 && (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 py-16 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-zinc-600">
                    <FolderOpen size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-medium">
                    No projects yet
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600">
                    Create a project to start
                    analyzing your screenplay.
                  </p>

                </div>
              )}

            {/* Projects */}

            {!loadingProjects &&
              !projectError &&
              projects.length > 0 && (
                <div className="mt-5 space-y-3">

                  {projects.map((project) => (

                    <button
                      key={project.id}
                      onClick={() =>
                        navigate(
                          `/projects/${project.id}`
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-violet-500/20 hover:bg-white/[0.03]"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <FileText size={19} />
                        </div>

                        <div>

                          <h3 className="text-sm font-medium">
                            {project.name}
                          </h3>

                          <p className="mt-1 text-xs text-zinc-600">
                            {project.description ||
                              "No description"}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-4">

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] capitalize text-zinc-400">
                          {project.status}
                        </span>

                        <span className="hidden text-xs text-zinc-600 sm:block">
                          {new Date(
                            project.created_at
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </button>

                  ))}

                </div>
              )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;