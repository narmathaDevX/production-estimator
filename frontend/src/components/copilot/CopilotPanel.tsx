import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { askCopilot } from "../../services/copilotService";

interface CopilotPanelProps {
  projectId: number;
}

export default function CopilotPanel({
  projectId,
}: CopilotPanelProps) {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = [
    "Which location is used the most?",
    "Which scenes might be the most expensive?",
    "Which character appears in the most scenes?",
    "How can I reduce the production cost?",
  ];


  const handleAsk = async () => {

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result = await askCopilot(
        projectId,
        trimmedQuestion
      );

      setAnswer(result.answer);
      setQuestion("");

    } catch (err: any) {

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleSuggestion = (
    suggestion: string
  ) => {

    setQuestion(suggestion);

  };


  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      {/* Header */}

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
          <Bot
            size={20}
            className="text-violet-400"
          />
        </div>

        <div>

          <h2 className="text-lg font-semibold text-white">
            AI Copilot
          </h2>

          <p className="text-sm text-zinc-400">
            Ask questions about your production
          </p>

        </div>

      </div>


      {/* Suggestions */}

      {!answer && (

        <div className="mb-5">

          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Sparkles size={14} />
            TRY ASKING
          </div>

          <div className="flex flex-wrap gap-2">

            {suggestions.map(
              (suggestion) => (

                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      suggestion
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                >
                  {suggestion}
                </button>

              )
            )}

          </div>

        </div>

      )}


      {/* Answer */}

      {answer && (

        <div className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">

          <div className="mb-3 flex items-center gap-2">

            <Bot
              size={16}
              className="text-violet-400"
            />

            <span className="text-sm font-medium text-violet-300">
              Copilot
            </span>

          </div>

          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {answer}
          </p>

        </div>

      )}


      {/* Error */}

      {error && (

        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>

      )}


      {/* Input */}

      <div className="flex gap-2">

        <div className="relative flex-1">

          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={(event) => {

              if (event.key === "Enter") {
                handleAsk();
              }

            }}
            placeholder="Ask about your screenplay..."
            className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            disabled={loading}
          />

        </div>

        <button
          type="button"
          onClick={handleAsk}
          disabled={
            loading ||
            !question.trim()
          }
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >

          <Send size={16} />

          {loading
            ? "Thinking..."
            : "Ask"}

        </button>

      </div>

    </div>
  );
}