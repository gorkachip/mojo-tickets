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
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  implemented: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session || !ticket) return null;

  const isAdmin = session.user.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Ticket Detail</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Badge variant="outline">
                  {categoryLabels[ticket.category] || ticket.category}
                </Badge>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Submitted on {new Date(ticket.createdAt).toLocaleString()} by{" "}
                <strong>{ticket.name}</strong> ({ticket.email})
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                {ticket.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus("approved")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
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
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-gray-800">
                {ticket.description}
              </p>
            </div>

            {ticket.expectedResponse && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">
                  What the assistant should have said instead
                </h3>
                <p className="whitespace-pre-wrap text-gray-800">
                  {ticket.expectedResponse}
                </p>
              </div>
            )}

            {ticket.leadContact && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">
                  Lead&apos;s contact details
                </h3>
                <p className="text-gray-800">{ticket.leadContact}</p>
              </div>
            )}

            {ticket.screenshotUrl && (
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-500">
                  <Image className="h-4 w-4" />
                  Screenshot
                </h3>
                <img
                  src={ticket.screenshotUrl}
                  alt="Screenshot"
                  className="max-w-full rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
