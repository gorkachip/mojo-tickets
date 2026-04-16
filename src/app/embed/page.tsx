"use client";

import { useState, useRef } from "react";
import { CheckCircle, ArrowLeft, Upload, Loader2 } from "lucide-react";

type Category = "ai_response" | "app_bug" | "idea";
type View = "menu" | "form" | "success";

const categoryTitles: Record<Category, string> = {
  ai_response: "AI response needs improvement",
  app_bug: "App or automation didn't work as expected",
  idea: "Got an idea to improve the chatbot",
};

const categoryDescriptions: Record<Category, string> = {
  ai_response: "The assistant gave an incorrect, confusing, or poorly phrased reply, maybe the tone didn't feel right for your client.",
  app_bug: "Something broke or didn't work as expected in the app or an automation.",
  idea: "Share your idea to make the chatbot even better for our clients.",
};

export default function EmbedPage() {
  const [view, setView] = useState<View>("menu");
  const [category, setCategory] = useState<Category | null>(null);

  function selectCategory(cat: Category) {
    setCategory(cat);
    setView("form");
  }

  function handleSuccess() {
    setView("success");
    setTimeout(() => {
      setView("menu");
      setCategory(null);
    }, 3000);
  }

  return (
    <div className="h-full w-full bg-[#FCF9F6]">
      {view === "menu" && (
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#27241E]">
              <svg className="h-5 w-5 text-[#FCF9F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-lacquer)] text-xl text-[#27241E]">Welcome</h2>
            <p className="text-lg font-bold text-[#27241E]">How can we help?</p>
          </div>
          <div className="border-t border-[#E5DAD0] px-6 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#BBAC9D]">Submit a ticket</p>
            {(["ai_response", "app_bug", "idea"] as Category[]).map((id) => (
              <button
                key={id}
                onClick={() => selectCategory(id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-sm text-[#27241E] transition-colors hover:bg-[#E5DAD0]/40"
              >
                <span className="flex-1">{categoryTitles[id]}</span>
                <svg className="h-4 w-4 text-[#BBAC9D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
          <div className="border-t border-[#E5DAD0] py-3 text-center">
            <span className="font-[family-name:var(--font-lacquer)] text-xs text-[#BBAC9D]">MOJO</span>
          </div>
        </div>
      )}

      {view === "form" && category && (
        <EmbedForm category={category} onBack={() => setView("menu")} onSuccess={handleSuccess} />
      )}

      {view === "success" && (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-[#49615B]" />
            <h3 className="font-[family-name:var(--font-lacquer)] text-lg text-[#27241E]">Ticket submitted!</h3>
            <p className="mt-1 text-sm text-[#6F634F]">We&apos;ll review it shortly. Thank you!</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EmbedForm({ category, onBack, onSuccess }: { category: Category; onBack: () => void; onSuccess: () => void }) {
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
        body: JSON.stringify({ category, name, email, description, expectedResponse: expectedResponse || null, leadContact: leadContact || null, screenshotUrl }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to submit"); }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-[#E5DAD0] px-4 py-3">
        <button onClick={onBack} className="rounded-md p-1 text-[#BBAC9D] hover:bg-[#E5DAD0]/40">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#27241E]">
          <svg className="h-3.5 w-3.5 text-[#FCF9F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-5">
        <h3 className="mb-4 text-lg font-bold text-[#27241E]">{categoryTitles[category]}</h3>

        <label className="mb-1 block text-sm font-medium text-[#27241E]">Name<span className="text-red-500">*</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]" />

        <label className="mb-1 block text-sm font-medium text-[#27241E]">Email<span className="text-red-500">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]" />

        <label className="mb-1 block text-sm font-medium text-[#27241E]">Description<span className="text-red-500">*</span></label>
        <p className="mb-1 text-xs text-[#6F634F]">{categoryDescriptions[category]}</p>
        <p className="mb-2 text-xs text-[#6F634F]"><strong>Upload Screenshot.</strong> Capture the full screen to include all relevant details.</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="Enter your request here ..." className="mb-2 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]" />

        <div className="mb-4">
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-dashed border-[#BBAC9D] px-3 py-2 text-sm text-[#6F634F] hover:border-[#49615B] hover:text-[#27241E]">
            <Upload className="h-4 w-4" />
            {screenshotFile ? screenshotFile.name : "Attach screenshot"}
          </button>
        </div>

        {category === "ai_response" && (
          <>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">What should the assistant have said instead?</label>
            <p className="mb-2 text-xs text-[#6F634F]">Write the version that sounds right for you.</p>
            <input type="text" value={expectedResponse} onChange={(e) => setExpectedResponse(e.target.value)} className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]" />
          </>
        )}

        {(category === "ai_response" || category === "app_bug") && (
          <>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">Lead&apos;s contact details<span className="text-red-500">*</span></label>
            <p className="mb-2 text-xs text-[#6F634F]">Name and phone number or e-mail.</p>
            <input type="text" value={leadContact} onChange={(e) => setLeadContact(e.target.value)} required className="mb-4 w-full rounded-lg border border-[#E5DAD0] bg-white px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]" />
          </>
        )}

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#27241E] py-2.5 text-sm font-medium text-[#FCF9F6] transition-colors hover:bg-[#3E3723] disabled:opacity-50">
          {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Submit"}
        </button>
      </form>
    </div>
  );
}
