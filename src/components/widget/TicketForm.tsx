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
    <div className="fixed bottom-24 right-6 z-50 w-[360px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1a1a2e]">
          <svg
            className="h-3.5 w-3.5 text-white"
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
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {categoryTitles[category]}
        </h3>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description<span className="text-red-500">*</span>
        </label>
        <p className="mb-1 text-xs text-orange-500">{categoryDescriptions[category]}</p>
        <p className="mb-2 text-xs text-orange-500">
          <strong>Upload Screenshot.</strong> Always be sure to capture the full screen to include all the relevant details.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Enter your request here ..."
          className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            <Upload className="h-4 w-4" />
            {screenshotFile ? screenshotFile.name : "Attach screenshot"}
          </button>
        </div>

        {category === "ai_response" && (
          <>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              What should the assistant have said instead?
            </label>
            <p className="mb-2 text-xs text-orange-500">
              Write the version that sounds right for you - the way you&apos;d want Ari to speak on your behalf.
            </p>
            <input
              type="text"
              value={expectedResponse}
              onChange={(e) => setExpectedResponse(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </>
        )}

        {(category === "ai_response" || category === "app_bug") && (
          <>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Lead&apos;s contact details<span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-xs text-orange-500">
              Name and phone number or e-mail.
            </p>
            <input
              type="text"
              value={leadContact}
              onChange={(e) => setLeadContact(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#1a1a2e] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a2a4e] disabled:opacity-50"
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
