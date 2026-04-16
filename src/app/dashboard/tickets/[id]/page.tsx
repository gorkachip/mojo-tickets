"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Rocket, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Ticket = {
  id: string;
  category: string;
  status: string;
  name: string;
  email: string;
  description: string;
  expectedResponse: string | null;
  leadContact: string | null;
  screenshotUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

const categoryLabels: Record<string, string> = {
  ai_response: "AI Response",
  app_bug: "App Bug",
  idea: "Idea",
};

const statusColors: Record<string, string> = {
  pending: "bg-[#BBAC9D]/30 text-[#6F634F]",
  approved: "bg-[#49615B]/20 text-[#49615B]",
  implemented: "bg-[#49615B]/40 text-[#27241E]",
  rejected: "bg-red-100 text-red-700",
};

export default function TicketDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/dashboard/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated" && params.id) {
      fetch(`/api/tickets/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTicket(data);
          setLoading(false);
        });
    }
  }, [authStatus, params.id]);

  async function updateStatus(newStatus: string) {
    if (!ticket) return;
    setUpdating(true);
    const res = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTicket(updated);
    }
    setUpdating(false);
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCF9F6]">
        <p className="text-[#BBAC9D]">Loading...</p>
      </div>
    );
  }

  if (!session || !ticket) return null;

  const isAdmin = session.user.role === "admin";

  return (
    <div className="min-h-screen bg-[#FCF9F6]">
      <header className="border-b border-[#E5DAD0] bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg p-2 text-[#BBAC9D] hover:bg-[#E5DAD0]/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-[family-name:var(--font-lacquer)] text-lg text-[#27241E]">
            MOJO
          </h1>
          <span className="text-sm text-[#BBAC9D]">Ticket Detail</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-[#E5DAD0] bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Badge variant="outline" className="border-[#E5DAD0] text-[#6F634F]">
                  {categoryLabels[ticket.category] || ticket.category}
                </Badge>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-[#BBAC9D]">
                Submitted on {new Date(ticket.createdAt).toLocaleString()} by{" "}
                <strong className="text-[#27241E]">{ticket.name}</strong> ({ticket.email})
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                {ticket.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus("approved")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg bg-[#49615B] px-4 py-2 text-sm font-medium text-white hover:bg-[#49615B]/90 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}
                {ticket.status === "approved" && (
                  <button
                    onClick={() => updateStatus("implemented")}
                    disabled={updating}
                    className="flex items-center gap-1.5 rounded-lg bg-[#27241E] px-4 py-2 text-sm font-medium text-[#FCF9F6] hover:bg-[#3E3723] disabled:opacity-50"
                  >
                    <Rocket className="h-4 w-4" />
                    Mark Implemented
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#BBAC9D]">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-[#27241E]">
                {ticket.description}
              </p>
            </div>

            {ticket.expectedResponse && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-[#BBAC9D]">
                  What the assistant should have said instead
                </h3>
                <p className="whitespace-pre-wrap text-[#27241E]">
                  {ticket.expectedResponse}
                </p>
              </div>
            )}

            {ticket.leadContact && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-[#BBAC9D]">
                  Lead&apos;s contact details
                </h3>
                <p className="text-[#27241E]">{ticket.leadContact}</p>
              </div>
            )}

            {ticket.screenshotUrl && (
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-[#BBAC9D]">
                  <Image className="h-4 w-4" />
                  Screenshot
                </h3>
                <img
                  src={ticket.screenshotUrl}
                  alt="Screenshot"
                  className="max-w-full rounded-lg border border-[#E5DAD0]"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
