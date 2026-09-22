import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import axios from "axios";

import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  FileText,
  FolderOpen,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getProjects } from "../services/projectService";
import type { Project } from "../services/projectService";

import {
  analyzeScreenplay,
  getSavedAnalysis,
} from "../services/analysisService";

import CopilotPanel from "../components/copilot/CopilotPanel";

import type {
  ScreenplayAnalysis,
} from "../services/analysisService";


const API_URL = "http://127.0.0.1:8000";


/* ============================================================
   TYPES
============================================================ */

interface CurrentScreenplay {
  screenplay_id: number;
  project_id: number;
  filename: string;
  file_type: string;
  uploaded_at: string;
  status: string;
}

interface BudgetData {
  crew_cost: number;
  equipment_cost: number;
  location_cost: number;
  props_cost: number;
  costumes_cost: number;
  transport_cost: number;
  contingency_cost: number;
  total_cost: number;
}

interface BudgetResponse {
  budget_id: number;
  project_id: number;
  status: string;
  budget: BudgetData;
}

interface ScheduleScene {
  scene_number: number;
  scene_heading: string;
  time_of_day: string;
  characters: string[];
  props: string[];
  costumes: string[];
  vehicles: string[];
  description: string;
}

interface ShootingDay {
  day: number;
  location: string;
  scene_count: number;
  scenes: ScheduleScene[];
}

interface ScheduleData {
  total_shooting_days: number;
  shooting_days: ShootingDay[];
}

interface ScheduleResponse {
  schedule_id: number;
  project_id: number;
  status: string;
  schedule: ScheduleData;
}


/* ============================================================
   COMPONENT
============================================================ */

function ProjectWorkspace() {
  const navigate = useNavigate();

  const { projectId } = useParams();

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  /* ============================================================
     STATE
  ============================================================ */

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [currentScreenplay, setCurrentScreenplay] =
    useState<CurrentScreenplay | null>(null);

  const [analysis, setAnalysis] =
    useState<ScreenplayAnalysis | null>(null);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysisMessage, setAnalysisMessage] =
    useState("");

  const [budget, setBudget] =
    useState<BudgetData | null>(null);

  const [generatingBudget, setGeneratingBudget] =
    useState(false);

  const [budgetMessage, setBudgetMessage] =
    useState("");

  const [schedule, setSchedule] =
    useState<ScheduleData | null>(null);

  const [generatingSchedule, setGeneratingSchedule] =
    useState(false);

  const [scheduleMessage, setScheduleMessage] =
    useState("");


  /* ============================================================
     LOAD PROJECT
  ============================================================ */

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projects = await getProjects();

        const selectedProject =
          projects.find(
            (item) =>
              item.id === Number(projectId)
          );

        setProject(
          selectedProject || null
        );
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);


  /* ============================================================
     LOAD CURRENT SCREENPLAY
  ============================================================ */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const loadScreenplay = async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          return;
        }

        const response =
          await axios.get<CurrentScreenplay>(
            `${API_URL}/projects/${projectId}/screenplay`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCurrentScreenplay(
          response.data
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setCurrentScreenplay(null);
        } else {
          console.error(
            "Failed to load screenplay:",
            error
          );
        }
      }
    };

    loadScreenplay();
  }, [projectId]);


  /* ============================================================
     LOAD SAVED ANALYSIS
  ============================================================ */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const loadAnalysis = async () => {
      try {
        const savedAnalysis =
          await getSavedAnalysis(
            Number(projectId)
          );

        /*
          getSavedAnalysis already returns
          ScreenplayAnalysis directly.
        */

        setAnalysis(
          savedAnalysis
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setAnalysis(null);
        } else {
          console.error(
            "Failed to load analysis:",
            error
          );
        }
      }
    };

    loadAnalysis();
  }, [projectId]);


  /* ============================================================
     LOAD SAVED BUDGET
  ============================================================ */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const loadBudget = async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          return;
        }

        const response =
          await axios.get<BudgetResponse>(
            `${API_URL}/projects/${projectId}/budget`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setBudget(
          response.data.budget
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setBudget(null);
        } else {
          console.error(
            "Failed to load budget:",
            error
          );
        }
      }
    };

    loadBudget();
  }, [projectId]);


  /* ============================================================
     LOAD SAVED SCHEDULE
  ============================================================ */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const loadSchedule = async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          return;
        }

        const response =
          await axios.get<ScheduleResponse>(
            `${API_URL}/projects/${projectId}/schedule`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setSchedule(
          response.data.schedule
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setSchedule(null);
        } else {
          console.error(
            "Failed to load schedule:",
            error
          );
        }
      }
    };

    loadSchedule();
  }, [projectId]);


  /* ============================================================
     UPLOAD SCREENPLAY
  ============================================================ */

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !projectId) {
      return;
    }

    const extension =
      file.name
        .substring(
          file.name.lastIndexOf(".")
        )
        .toLowerCase();

    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".txt",
    ];

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setUploadMessage(
        "Only PDF, DOCX and TXT files are supported."
      );

      return;
    }

    setUploading(true);
    setUploadMessage("");

    try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {
        setUploadMessage(
          "Please log in again."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await axios.post(
          `${API_URL}/projects/${projectId}/screenplay`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        response.data;

      setUploadMessage(
        `✓ ${data.filename} uploaded successfully`
      );

      setCurrentScreenplay({
        screenplay_id:
          data.screenplay_id,

        project_id:
          data.project_id,

        filename:
          data.filename,

        file_type:
          extension,

        uploaded_at:
          new Date().toISOString(),

        status:
          data.status,
      });

      setAnalysis(null);
      setBudget(null);
      setSchedule(null);

      setProject(
        (currentProject) =>
          currentProject
            ? {
                ...currentProject,
                status:
                  data.status,
              }
            : currentProject
      );
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      if (
        axios.isAxiosError(error)
      ) {
        setUploadMessage(
          error.response?.data?.detail ||
            "Failed to upload screenplay"
        );
      } else {
        setUploadMessage(
          "Failed to upload screenplay"
        );
      }
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    }
  };


  /* ============================================================
     DELETE SCREENPLAY
  ============================================================ */

  const handleDeleteScreenplay =
    async () => {
      if (!projectId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to remove this screenplay?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          return;
        }

        await axios.delete(
          `${API_URL}/projects/${projectId}/screenplay`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCurrentScreenplay(null);
        setAnalysis(null);
        setBudget(null);
        setSchedule(null);

        setProject(
          (currentProject) =>
            currentProject
              ? {
                  ...currentProject,
                  status: "draft",
                }
              : currentProject
        );

        setUploadMessage(
          "Screenplay removed successfully."
        );
      } catch (error) {
        console.error(
          "Delete screenplay failed:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          setUploadMessage(
            error.response?.data?.detail ||
              "Failed to remove screenplay"
          );
        }
      }
    };


  /* ============================================================
     REPLACE SCREENPLAY
  ============================================================ */

  const handleReplaceScreenplay =
    () => {
      fileInputRef.current?.click();
    };


  /* ============================================================
     ANALYZE SCREENPLAY
  ============================================================ */

  const handleAnalyze =
    async () => {
      if (!projectId) {
        return;
      }

      setAnalyzing(true);
      setAnalysisMessage("");

      try {
        const result =
          await analyzeScreenplay(
            Number(projectId)
          );

        /*
          analyzeScreenplay returns
          ScreenplayAnalysis directly.
        */

        setAnalysis(
          result
        );

        setProject(
          (currentProject) =>
            currentProject
              ? {
                  ...currentProject,
                  status: "analyzed",
                }
              : currentProject
        );

        setAnalysisMessage(
          "✓ Screenplay analyzed successfully"
        );

        /*
          A new analysis means the
          old budget/schedule should
          no longer be treated as current.
        */

        setBudget(null);
        setSchedule(null);
      } catch (error) {
        console.error(
          "Analysis failed:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          setAnalysisMessage(
            error.response?.data?.detail ||
              "AI analysis failed"
          );
        } else {
          setAnalysisMessage(
            "AI analysis failed"
          );
        }
      } finally {
        setAnalyzing(false);
      }
    };


  /* ============================================================
     GENERATE BUDGET
  ============================================================ */

  const handleGenerateBudget =
    async () => {
      if (!projectId) {
        return;
      }

      setGeneratingBudget(true);
      setBudgetMessage("");

      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          throw new Error(
            "Please log in again."
          );
        }

        const response =
          await axios.post<BudgetResponse>(
            `${API_URL}/projects/${projectId}/budget`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          response.data;

        /*
          BudgetResponse contains:
          result.budget
        */

        setBudget(
          result.budget
        );

        setProject(
          (currentProject) =>
            currentProject
              ? {
                  ...currentProject,
                  status:
                    "budget_generated",
                }
              : currentProject
        );

        setBudgetMessage(
          "✓ Budget generated successfully"
        );
      } catch (error) {
        console.error(
          "Budget generation failed:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          setBudgetMessage(
            error.response?.data?.detail ||
              "Failed to generate budget"
          );
        } else {
          setBudgetMessage(
            "Failed to generate budget"
          );
        }
      } finally {
        setGeneratingBudget(false);
      }
    };


  /* ============================================================
     GENERATE SHOOTING SCHEDULE
  ============================================================ */

  const handleGenerateSchedule =
    async () => {
      if (!projectId) {
        return;
      }

      setGeneratingSchedule(true);
      setScheduleMessage("");

      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          throw new Error(
            "Please log in again."
          );
        }

        const response =
          await axios.post<ScheduleResponse>(
            `${API_URL}/projects/${projectId}/schedule`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          response.data;

        setSchedule(
          result.schedule
        );

        setProject(
          (currentProject) =>
            currentProject
              ? {
                  ...currentProject,
                  status:
                    "schedule_generated",
                }
              : currentProject
        );

        setScheduleMessage(
          "✓ Shooting schedule generated successfully"
        );
      } catch (error) {
        console.error(
          "Schedule generation failed:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          setScheduleMessage(
            error.response?.data?.detail ||
              "Failed to generate shooting schedule"
          );
        } else {
          setScheduleMessage(
            "Failed to generate shooting schedule"
          );
        }
      } finally {
        setGeneratingSchedule(false);
      }
    };


  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading project...
          </p>
        </div>
      </div>
    );
  }


  /* ============================================================
     PROJECT NOT FOUND
  ============================================================ */

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <FolderOpen size={22} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Project not found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            This project could not be loaded.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }


  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <p className="text-xs text-zinc-600">
                Project Workspace
              </p>

              <h1 className="text-lg font-semibold">
                {project.name}
              </h1>
            </div>

          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-zinc-400">
            {project.status.replace(
              /_/g,
              " "
            )}
          </span>

        </div>
      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ====================================================
            PROJECT OVERVIEW
        ==================================================== */}

        <section>
          <p className="text-xs uppercase tracking-widest text-violet-400">
            Production Workspace
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            {project.name}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            {project.description ||
              "No project description has been added yet."}
          </p>
        </section>


        {/* ====================================================
            SCREENPLAY UPLOAD
        ==================================================== */}

        <section className="mt-10">

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-8">

            <div className="flex items-start gap-5">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Upload size={22} />
              </div>

              <div className="flex-1">

                <h3 className="text-lg font-medium">
                  {currentScreenplay
                    ? "Screenplay"
                    : "Upload your screenplay"}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Upload your screenplay and let the AI analyze
                  scenes, characters, locations, props,
                  costumes and other production requirements.
                </p>


                {/* Hidden file input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />


                {/* Current screenplay */}

                {currentScreenplay && (
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <FileText
                            size={19}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {
                              currentScreenplay.filename
                            }
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {
                              currentScreenplay.file_type
                            }
                            {" · "}
                            Uploaded screenplay
                          </p>
                        </div>

                      </div>


                      <div className="flex shrink-0 gap-2">

                        <button
                          onClick={
                            handleReplaceScreenplay
                          }
                          disabled={uploading}
                          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                        >
                          <RefreshCw
                            size={14}
                          />

                          Replace
                        </button>

                        <button
                          onClick={
                            handleDeleteScreenplay
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-500/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2
                            size={14}
                          />

                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                )}


                {/* Upload button */}

                {!currentScreenplay && (
                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="mt-6 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload size={17} />

                    {uploading
                      ? "Uploading..."
                      : "Upload Screenplay"}
                  </button>
                )}


                {/* Upload message */}

                {uploadMessage && (
                  <p
                    className={`mt-3 text-sm ${
                      uploadMessage.startsWith(
                        "✓"
                      )
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {uploadMessage}
                  </p>
                )}

                <p className="mt-3 text-xs text-zinc-600">
                  Supported formats: PDF, DOCX, TXT
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            PRODUCTION INTELLIGENCE
        ==================================================== */}

        <section className="mt-10">

          <div>
            <h2 className="text-lg font-medium">
              Production Intelligence
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Transform your screenplay into a
              production-ready plan.
            </p>
          </div>


          {/* ==================================================
              STAT CARDS
          ================================================== */}

          {analysis && (
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* Scenes */}

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <FileText size={19} />
                  </div>

                  <span className="text-xs text-zinc-600">
                    Scenes
                  </span>

                </div>

                <p className="mt-5 text-2xl font-semibold">
                  {
                    analysis.total_number_of_scenes ??
                    analysis.scene_by_scene_breakdown
                      .length
                  }
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Scene breakdown
                </p>

              </div>


              {/* Characters */}

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Sparkles size={19} />
                  </div>

                  <span className="text-xs text-zinc-600">
                    Characters
                  </span>

                </div>

                <p className="mt-5 text-2xl font-semibold">
                  {analysis.characters.length}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Identified characters
                </p>

              </div>


              {/* Locations */}

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <FolderOpen size={19} />
                  </div>

                  <span className="text-xs text-zinc-600">
                    Locations
                  </span>

                </div>

                <p className="mt-5 text-2xl font-semibold">
                  {analysis.locations.length}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Production locations
                </p>

              </div>


              {/* Props */}

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <BarChart3 size={19} />
                  </div>

                  <span className="text-xs text-zinc-600">
                    Props
                  </span>

                </div>

                <p className="mt-5 text-2xl font-semibold">
                  {analysis.props.length}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Production props
                </p>

              </div>

            </div>
          )}


          {/* ==================================================
              ANALYSIS
          ================================================== */}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">

            <div className="flex items-start justify-between gap-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">
                      AI Scene Analysis
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Analyze your screenplay with AI.
                    </p>
                  </div>

                </div>

              </div>


              {currentScreenplay && (
                <button
                  onClick={
                    handleAnalyze
                  }
                  disabled={analyzing}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles size={15} />

                  {analyzing
                    ? "Analyzing..."
                    : analysis
                    ? "Re-analyze"
                    : "Analyze Screenplay"}
                </button>
              )}

            </div>


            {analysisMessage && (
              <p
                className={`mt-4 text-sm ${
                  analysisMessage.startsWith(
                    "✓"
                  )
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {analysisMessage}
              </p>
            )}


            {!analysis &&
              !analyzing && (
                <div className="mt-6 rounded-lg border border-dashed border-white/10 px-5 py-8 text-center">

                  <p className="text-sm text-zinc-500">
                    {currentScreenplay
                      ? "Click Analyze Screenplay to extract production intelligence."
                      : "Upload a screenplay first."}
                  </p>

                </div>
              )}


            {analyzing && (
              <div className="mt-6 rounded-lg border border-white/10 px-5 py-8 text-center">

                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

                <p className="mt-4 text-sm text-zinc-500">
                  AI is analyzing your screenplay...
                </p>

              </div>
            )}


            {analysis && (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* Title / logline */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Title
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {analysis.title}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Logline
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {analysis.logline}
                  </p>

                </div>

              </div>
            )}

          </div>


          {/* ==================================================
              SCENE BREAKDOWN
          ================================================== */}

          {analysis && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02]">

              <div className="border-b border-white/10 px-6 py-5">

                <h3 className="text-sm font-medium">
                  Scene Breakdown
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Detailed production requirements for
                  every scene.
                </p>

              </div>


              <div className="divide-y divide-white/5">

                {analysis.scene_by_scene_breakdown.map(
                  (scene) => (
                    <div
                      key={
                        scene.scene_number
                      }
                      className="px-6 py-6"
                    >

                      <div className="flex items-start justify-between gap-5">

                        <div className="flex min-w-0 items-center gap-3">

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-medium text-violet-400">
                            {
                              scene.scene_number
                            }
                          </span>

                          <div className="min-w-0">

                            <h4 className="text-sm font-medium">
                              {
                                scene.scene_heading
                              }
                            </h4>

                            <p className="mt-1 text-xs text-zinc-600">
                              {
                                scene.location
                              }
                              {" · "}
                              {
                                scene.time_of_day
                              }
                            </p>

                          </div>

                        </div>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-zinc-500">
                        {
                          scene.short_scene_description
                        }
                      </p>


                      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <div>
                          <p className="text-xs text-zinc-600">
                            Characters
                          </p>

                          <p className="mt-2 text-xs leading-5 text-zinc-400">
                            {scene.characters_present.length
                              ? scene.characters_present.join(
                                  ", "
                                )
                              : "None"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-zinc-600">
                            Props
                          </p>

                          <p className="mt-2 text-xs leading-5 text-zinc-400">
                            {scene.props.length
                              ? scene.props.join(
                                  ", "
                                )
                              : "None"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-zinc-600">
                            Costumes
                          </p>

                          <p className="mt-2 text-xs leading-5 text-zinc-400">
                            {scene.costumes.length
                              ? scene.costumes.join(
                                  ", "
                                )
                              : "None"}
                          </p>
                        </div>


                        <div>
                          <p className="text-xs text-zinc-600">
                            Vehicles
                          </p>

                          <p className="mt-2 text-xs leading-5 text-zinc-400">
                            {scene.vehicles.length
                              ? scene.vehicles.join(
                                  ", "
                                )
                              : "None"}
                          </p>
                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}


          {/* ==================================================
              BUDGET
          ================================================== */}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">

            <div className="flex items-start justify-between gap-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <BarChart3 size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-medium">
                    Production Budget
                  </h3>

                  <p className="mt-1 text-xs text-zinc-600">
                    Deterministic estimate based on screenplay
                    requirements.
                  </p>
                </div>

              </div>


              {analysis && (
                <button
                  onClick={
                    handleGenerateBudget
                  }
                  disabled={
                    generatingBudget
                  }
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BarChart3 size={15} />

                  {generatingBudget
                    ? "Generating..."
                    : budget
                    ? "Regenerate Budget"
                    : "Generate Budget"}
                </button>
              )}

            </div>


            {budgetMessage && (
              <p
                className={`mt-4 text-sm ${
                  budgetMessage.startsWith(
                    "✓"
                  )
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {budgetMessage}
              </p>
            )}


            {!budget && (
              <div className="mt-6 rounded-lg border border-dashed border-white/10 px-5 py-8 text-center">

                <p className="text-sm text-zinc-500">
                  {analysis
                    ? "Generate a production budget from the screenplay analysis."
                    : "Analyze the screenplay before generating a budget."}
                </p>

              </div>
            )}


            {budget && (
              <div className="mt-6">

                <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-6">

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Estimated Production Cost
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    ₹
                    {Number(
                      budget.total_cost
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>


                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">

                  <BudgetItem
                    label="Crew"
                    value={
                      budget.crew_cost
                    }
                  />

                  <BudgetItem
                    label="Equipment"
                    value={
                      budget.equipment_cost
                    }
                  />

                  <BudgetItem
                    label="Locations"
                    value={
                      budget.location_cost
                    }
                  />

                  <BudgetItem
                    label="Props"
                    value={
                      budget.props_cost
                    }
                  />

                  <BudgetItem
                    label="Costumes"
                    value={
                      budget.costumes_cost
                    }
                  />

                  <BudgetItem
                    label="Transport"
                    value={
                      budget.transport_cost
                    }
                  />

                  <BudgetItem
                    label="Contingency"
                    value={
                      budget.contingency_cost
                    }
                  />

                </div>

              </div>
            )}

          </div>


          {/* ==================================================
              SHOOTING SCHEDULE
          ================================================== */}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">

            <div className="flex items-start justify-between gap-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <CalendarDays size={19} />
                </div>

                <div>

                  <h3 className="text-sm font-medium">
                    Shooting Schedule
                  </h3>

                  <p className="mt-1 text-xs text-zinc-600">
                    Scenes grouped by location to reduce
                    unnecessary location changes.
                  </p>

                </div>

              </div>


              {analysis && (
                <button
                  onClick={
                    handleGenerateSchedule
                  }
                  disabled={
                    generatingSchedule
                  }
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarDays size={15} />

                  {generatingSchedule
                    ? "Generating..."
                    : schedule
                    ? "Regenerate Schedule"
                    : "Generate Schedule"}
                </button>
              )}

            </div>


            {scheduleMessage && (
              <p
                className={`mt-4 text-sm ${
                  scheduleMessage.startsWith(
                    "✓"
                  )
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {scheduleMessage}
              </p>
            )}


            {!schedule && (
              <div className="mt-6 rounded-lg border border-dashed border-white/10 px-5 py-8 text-center">

                <p className="text-sm text-zinc-500">
                  {analysis
                    ? "Generate a shooting schedule from the scene analysis."
                    : "Analyze the screenplay before generating a schedule."}
                </p>

              </div>
            )}


            {schedule && (
              <div className="mt-6">

                {/* Schedule summary */}

                <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-6">

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Total Shooting Days
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {
                      schedule.total_shooting_days
                    }
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Location-based MVP schedule
                  </p>

                </div>


                {/* Shooting days */}

                <div className="mt-5 space-y-4">

                  {schedule.shooting_days.map(
                    (day) => (
                      <div
                        key={day.day}
                        className="rounded-xl border border-white/10 bg-black/10"
                      >

                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                          <div className="flex items-center gap-3">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-medium text-violet-400">
                              {day.day}
                            </span>

                            <div>

                              <p className="text-sm font-medium">
                                Day {day.day}
                              </p>

                              <p className="mt-1 text-xs text-zinc-600">
                                {day.location}
                              </p>

                            </div>

                          </div>

                          <span className="text-xs text-zinc-600">
                            {day.scene_count}{" "}
                            {day.scene_count ===
                            1
                              ? "scene"
                              : "scenes"}
                          </span>

                        </div>


                        <div className="divide-y divide-white/5">

                          {day.scenes.map(
                            (scene) => (
                              <div
                                key={
                                  scene.scene_number
                                }
                                className="px-5 py-5"
                              >

                                <div className="flex items-start gap-3">

                                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs text-zinc-400">
                                    {
                                      scene.scene_number
                                    }
                                  </span>

                                  <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-center gap-2">

                                      <h4 className="text-sm font-medium">
                                        {
                                          scene.scene_heading
                                        }
                                      </h4>

                                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] capitalize text-zinc-500">
                                        {
                                          scene.time_of_day
                                        }
                                      </span>

                                    </div>

                                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                                      {
                                        scene.description
                                      }
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-600">

                                      <span>
                                        Characters:{" "}
                                        {
                                          scene.characters
                                            .length
                                        }
                                      </span>

                                      <span>
                                        Props:{" "}
                                        {
                                          scene.props
                                            .length
                                        }
                                      </span>

                                      <span>
                                        Costumes:{" "}
                                        {
                                          scene.costumes
                                            .length
                                        }
                                      </span>

                                      <span>
                                        Vehicles:{" "}
                                        {
                                          scene.vehicles
                                            .length
                                        }
                                      </span>

                                    </div>

                                  </div>

                                </div>

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>


          {/* ==================================================
              AI COPILOT
          ================================================== */}
          {projectId && (
            <div className="mt-5">
                <CopilotPanel
                projectId={Number(projectId)}
                />
                </div>
          )}

        </section>

      </main>

    </div>
  );
}


/* ============================================================
   BUDGET ITEM
============================================================ */

function BudgetItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">

      <p className="text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium">
        ₹
        {Number(value).toLocaleString(
          "en-IN"
        )}
      </p>

    </div>
  );
}


export default ProjectWorkspace;