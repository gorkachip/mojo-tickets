"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

type Category = "ai_response" | "app_bug" | "idea";

const categoryTitles: Record<Category, string> = {
  ai_response: "AI response needs improvement",
  app_bug: "App or automation didn't work as expected",
  idea: "Got an idea to improve the chatbot",
};

const categoryDescriptions: Record<Category, string> = {
  ai_response:
    "The assistant gave an incorrect, confusing, or poorly phrased reply, maybe the tone didn't feel right for your client.",
  app_bug:
    "Something broke or didn't work as expected in the app or an automation.",
  idea:
    "Share your idea to make the chatbot even better for our clients.",
};

export function TicketForm({
  category,
  onBack,
  onSuccess,
}: {
  category: Category;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [expectedResponse, setExpectedResponse] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let screenshotUrl: string | null = null;

      if (screenshotFile) {
        const formData = new FormData();
        formData.append("file", screenshotFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Failed to upload screenshot");
        const uploadData = await uploadRes.json();
        screenshotUrl = uploadData.url;
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          name,
          email,
          description,
          expectedResponse: expectedResponse || null,
          leadContact: leadContact || null,
          screenshotUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit ticket");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[360px] overflow-hidden rounded-2xl border border-[#E5DAD0] bg-[#FCF9F6] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[#E5DAD0] px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-md p-1 text-[#BBAC9D] hover:bg-[#E5DAD0]/40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#27241E]">
          <svg
            className="h-3.5 w-3.5 text-[#FCF9F6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
        <h3 className="mb-4 text-lg font-bold text-[#27241E]">
          {categoryTitles[category]}
        </h3>

        <label className="mb-1 block text-sm font-medium text-[#27241E]">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
        />

        <label className="mb-1 block text-sm font-medium text-[#27241E]">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
        />

        <label className="mb-1 block text-sm font-medium text-[#27241E]">
          Description<span className="text-red-500">*</span>
        </label>
        <p className="mb-1 text-xs text-[#6F634F]">{categoryDescriptions[category]}</p>
        <p className="mb-2 text-xs text-[#6F634F]">
          <strong>Upload Screenshot.</strong> Always be sure to capture the full screen to include all the relevant details.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Enter your request here ..."
          className="mb-2 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
        />

        <div className="mb-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-dashed border-[#BBAC9D] px-3 py-2 text-sm text-[#6F634F] hover:border-[#49615B] hover:text-[#27241E]"
          >
            <Upload className="h-4 w-4" />
            {screenshotFile ? screenshotFile.name : "Attach screenshot"}
          </button>
        </div>

        {category === "ai_response" && (
          <>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">
              What should the assistant have said instead?
            </label>
            <p className="mb-2 text-xs text-[#6F634F]">
              Write the version that sounds right for you - the way you&apos;d want Ari to speak on your behalf.
            </p>
            <input
              type="text"
              value={expectedResponse}
              onChange={(e) => setExpectedResponse(e.target.value)}
              className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
            />
          </>
        )}

        {(category === "ai_response" || category === "app_bug") && (
          <>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">
              Lead&apos;s contact details<span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-xs text-[#6F634F]">
              Name and phone number or e-mail.
            </p>
            <input
              type="text"
              value={leadContact}
              onChange={(e) => setLeadContact(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
            />
          </>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#27241E] py-2.5 text-sm font-medium text-[#FCF9F6] transition-colors hover:bg-[#3E3723] disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
