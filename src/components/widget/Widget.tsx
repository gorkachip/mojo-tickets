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
    setView((v) => (v === "closed" ? "menu" : "closed"));
    setCategory(null);
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
        <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
          <h3 className="text-lg font-bold text-gray-900">Ticket submitted!</h3>
          <p className="mt-1 text-sm text-gray-500">
            We&apos;ll review it shortly. Thank you!
          </p>
        </div>
      )}

      <WidgetButton open={view !== "closed"} onClick={toggle} />
    </>
  );
}
