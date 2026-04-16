"use client";

import { useState } from "react";
import { WidgetButton } from "./WidgetButton";
import { WidgetPopup } from "./WidgetPopup";
import { TicketForm } from "./TicketForm";
import { CheckCircle } from "lucide-react";

type Category = "ai_response" | "app_bug" | "idea";
type View = "closed" | "menu" | "form" | "success";

export function Widget() {
  const [view, setView] = useState<View>("closed");
  const [category, setCategory] = useState<Category | null>(null);

  function toggle() {
    const next = view === "closed" ? "menu" : "closed";
    setView(next);
    setCategory(null);
    // Notify parent iframe (GHL) to enable/disable pointer events
    if (window.parent !== window) {
      window.parent.postMessage(next === "closed" ? "mojo-widget-close" : "mojo-widget-open", "*");
    }
  }

  function selectCategory(cat: Category) {
    setCategory(cat);
    setView("form");
  }

  function handleSuccess() {
    setView("success");
    setTimeout(() => {
      setView("closed");
      setCategory(null);
    }, 3000);
  }

  return (
    <>
      {view === "menu" && <WidgetPopup onSelect={selectCategory} />}

      {view === "form" && category && (
        <TicketForm
          category={category}
          onBack={() => setView("menu")}
          onSuccess={handleSuccess}
        />
      )}

      {view === "success" && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl border border-[#E5DAD0] bg-[#FCF9F6] p-8 text-center shadow-2xl">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-[#49615B]" />
          <h3 className="font-[family-name:var(--font-lacquer)] text-lg text-[#27241E]">
            Ticket submitted!
          </h3>
          <p className="mt-1 text-sm text-[#6F634F]">
            We&apos;ll review it shortly. Thank you!
          </p>
        </div>
      )}

      <WidgetButton open={view !== "closed"} onClick={toggle} />
    </>
  );
}
