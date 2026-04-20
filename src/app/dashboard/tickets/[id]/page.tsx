"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Rocket,
  Image,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MentionText } from "@/components/MentionText";
import { MentionTextarea } from "@/components/MentionTextarea";

type TicketAction = {
  id: string;
  action: string;
  userName: string;
  comment: string | null;
  createdAt: string;
};

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
  actions: TicketAction[];
};

type User = { username: string; name: string };

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

const actionLabels: Record<string, string> = {
  approved: "Approve",
  rejected: "Reject",
  implemented: "Mark as Implemented",
  pending: "Reopen ticket",
  commented: "Add comment",
};

const actionVerb: Record<string, string> = {
  approved: "Approved",
  rejected: "Rejected",
  implemented: "Implemented",
  reopened: "Reopened",
  commented: "Commented",
};

const actionStyles: Record<
  string,
  { border: string; bg: string; iconColor: string }
> = {
  approved: {
    border: "border-[#E5DAD0]",
    bg: "bg-[#FCF9F6]",
    iconColor: "text-[#49615B]",
  },
  rejected: {
    border: "border-red-200",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
  implemented: {
    border: "border-[#E5DAD0]",
    bg: "bg-[#FCF9F6]",
    iconColor: "text-[#27241E]",
  },
  reopened: {
    border: "border-[#E5DAD0]",
    bg: "bg-[#FCF9F6]",
    iconColor: "text-[#6F634F]",
  },
  commented: {
    border: "border-[#E5DAD0]",
    bg: "bg-white",
    iconColor: "text-[#6F634F]",
  },
};

function ActionIcon({ action }: { action: string }) {
  const cls = actionStyles[action]?.iconColor || "text-[#6F634F]";
  if (action === "approved") return <CheckCircle className={`h-4 w-4 ${cls}`} />;
  if (action === "rejected") return <XCircle className={`h-4 w-4 ${cls}`} />;
  if (action === "implemented") return <Rocket className={`h-4 w-4 ${cls}`} />;
  if (action === "reopened") return <RotateCcw className={`h-4 w-4 ${cls}`} />;
  if (action === "commented")
    return <MessageSquare className={`h-4 w-4 ${cls}`} />;
  return null;
}

export default function TicketDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/dashboard/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated" && params.id) {
      Promise.all([
        fetch(`/api/tickets/${params.id}`).then((res) => res.json()),
        fetch(`/api/users`).then((res) => res.json()),
      ]).then(([t, u]) => {
        setTicket(t);
        setUsers(u);
        setLoading(false);
      });
    }
  }, [authStatus, params.id]);

  function openActionModal(action: string) {
    setComment("");
    setActionModal(action);
  }

  async function confirmAction() {
    if (!ticket || !actionModal) return;
    setUpdating(true);

    let res: Response;
    if (actionModal === "commented") {
      res = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      });
    } else {
      res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionModal,
          comment: comment.trim() || null,
        }),
      });
    }

    if (res.ok) {
      const updated = await res.json();
      setTicket(updated);
    }
    setUpdating(false);
    setActionModal(null);
    setComment("");
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
  const commentRequired = actionModal === "commented";

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
                <Badge
                  variant="outline"
                  className="border-[#E5DAD0] text-[#6F634F]"
                >
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
                <strong className="text-[#27241E]">{ticket.name}</strong> (
                {ticket.email})
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => openActionModal("commented")}
                disabled={updating}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5DAD0] bg-white px-4 py-2 text-sm font-medium text-[#27241E] hover:bg-[#FCF9F6] disabled:opacity-50"
              >
                <MessageSquare className="h-4 w-4" />
                Comment
              </button>
              {isAdmin && (
                <>
                  {ticket.status === "pending" && (
                    <>
                      <button
                        onClick={() => openActionModal("approved")}
                        disabled={updating}
                        className="flex items-center gap-1.5 rounded-lg bg-[#49615B] px-4 py-2 text-sm font-medium text-white hover:bg-[#49615B]/90 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => openActionModal("rejected")}
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
                      onClick={() => openActionModal("implemented")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg bg-[#27241E] px-4 py-2 text-sm font-medium text-[#FCF9F6] hover:bg-[#3E3723] disabled:opacity-50"
                    >
                      <Rocket className="h-4 w-4" />
                      Mark Implemented
                    </button>
                  )}
                  {ticket.status !== "pending" && (
                    <button
                      onClick={() => openActionModal("pending")}
                      disabled={updating}
                      className="flex items-center gap-1.5 rounded-lg border border-[#E5DAD0] bg-white px-4 py-2 text-sm font-medium text-[#6F634F] hover:bg-[#FCF9F6] disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reopen
                    </button>
                  )}
                </>
              )}
            </div>
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

            {ticket.actions && ticket.actions.length > 0 && (
              <div className="border-t border-[#E5DAD0] pt-6">
                <h3 className="mb-3 text-sm font-medium text-[#BBAC9D]">
                  Activity log
                </h3>
                <div className="space-y-3">
                  {ticket.actions.map((a) => {
                    const style = actionStyles[a.action] || actionStyles.commented;
                    return (
                      <div
                        key={a.id}
                        className={`rounded-lg border ${style.border} ${style.bg} p-3`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <ActionIcon action={a.action} />
                          <span className="font-medium text-[#27241E]">
                            {actionVerb[a.action] || a.action} by {a.userName}
                          </span>
                          <span className="text-[#BBAC9D]">
                            · {new Date(a.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {a.comment && (
                          <p className="mt-2 whitespace-pre-wrap text-sm text-[#6F634F]">
                            <MentionText text={a.comment} />
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-[#27241E]">
              {actionLabels[actionModal]}
            </h3>
            <p className="mb-4 text-sm text-[#6F634F]">
              {commentRequired
                ? "Use @username to tag people."
                : "Add an optional comment for the team. Use @username to tag people."}
            </p>
            <div className="mb-4">
              <MentionTextarea
                value={comment}
                onChange={setComment}
                rows={4}
                users={users}
                placeholder={
                  actionModal === "pending"
                    ? "e.g. Reopening to add more context @gorka"
                    : actionModal === "commented"
                    ? "Write your comment, mention with @username..."
                    : "e.g. Approved but with these changes @jorge"
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActionModal(null)}
                disabled={updating}
                className="rounded-lg border border-[#E5DAD0] bg-white px-4 py-2 text-sm font-medium text-[#6F634F] hover:bg-[#FCF9F6] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={updating || (commentRequired && !comment.trim())}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  actionModal === "rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionModal === "implemented"
                    ? "bg-[#27241E] hover:bg-[#3E3723]"
                    : actionModal === "pending"
                    ? "bg-[#6F634F] hover:bg-[#27241E]"
                    : actionModal === "commented"
                    ? "bg-[#49615B] hover:bg-[#49615B]/90"
                    : "bg-[#49615B] hover:bg-[#49615B]/90"
                }`}
              >
                {updating ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
