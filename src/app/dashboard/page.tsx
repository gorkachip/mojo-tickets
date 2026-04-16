"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, Filter } from "lucide-react";

type Ticket = {
  id: string;
  category: string;
  status: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/dashboard/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tickets")
        .then((res) => res.json())
        .then((data) => {
          setTickets(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCF9F6]">
        <p className="text-[#BBAC9D]">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const filtered = tickets.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FCF9F6]">
      <header className="border-b border-[#E5DAD0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-lacquer)] text-xl text-[#27241E]">
              MOJO
            </h1>
            <span className="text-sm text-[#BBAC9D]">Tickets</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6F634F]">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="rounded-lg p-2 text-[#BBAC9D] hover:bg-[#E5DAD0]/40 hover:text-[#27241E]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#27241E]">
            Tickets ({filtered.length})
          </h2>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-[#BBAC9D]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-[#E5DAD0] bg-white px-3 py-1.5 text-sm text-[#27241E] outline-none"
            >
              <option value="all">All categories</option>
              <option value="ai_response">AI Response</option>
              <option value="app_bug">App Bug</option>
              <option value="idea">Idea</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-[#E5DAD0] bg-white px-3 py-1.5 text-sm text-[#27241E] outline-none"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="implemented">Implemented</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5DAD0] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5DAD0]">
                <TableHead className="text-[#BBAC9D]">Category</TableHead>
                <TableHead className="text-[#BBAC9D]">Reporter</TableHead>
                <TableHead className="text-[#BBAC9D]">Description</TableHead>
                <TableHead className="text-[#BBAC9D]">Status</TableHead>
                <TableHead className="text-[#BBAC9D]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-[#BBAC9D]">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer border-[#E5DAD0] hover:bg-[#FCF9F6]"
                    onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="border-[#E5DAD0] text-[#6F634F]">
                        {categoryLabels[ticket.category] || ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-[#27241E]">{ticket.name}</div>
                      <div className="text-xs text-[#BBAC9D]">{ticket.email}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-[#6F634F]">
                      {ticket.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[ticket.status]}`}
                      >
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-[#BBAC9D]">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
