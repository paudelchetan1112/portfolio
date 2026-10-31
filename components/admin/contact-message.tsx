"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MailOpen,
  MessageSquare,
  RefreshCw,
  Reply,
  Trash2,
  X,
} from "lucide-react";

import { contactService } from "@/lib/services";
import type {
  ContactMessage,
  ContactMessageStatus,
} from "@/types";

const statusConfig: Record<
  ContactMessageStatus,
  {
    label: string;
    icon: typeof Mail;
    className: string;
  }
> = {
  unread: {
    label: "Unread",
    icon: Mail,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  read: {
    label: "Read",
    icon: MailOpen,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  replied: {
    label: "Replied",
    icon: Reply,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "bg-muted text-muted-foreground",
  },
};

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Target item for custom modal deletion dialog
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await contactService.getAllMessages();
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Unable to load contact messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: ContactMessageStatus
  ) => {
    try {
      setUpdatingId(id);

      const response = await contactService.updateStatus(id, status);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === id ? response.data : message
        )
      );
    } catch (err) {
      console.error("Failed to update message:", err);
      alert("Unable to update the message status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    const id = messageToDelete._id;

    try {
      setDeletingId(id);
      await contactService.deleteMessage(id);

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message._id !== id)
      );
      setMessageToDelete(null);
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Unable to delete this message.");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={fetchMessages}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Contact Messages
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage messages received from your website.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Messages
              </p>
              <p className="mt-1 text-3xl font-bold">{messages.length}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unread Messages
              </p>
              <p className="mt-1 text-3xl font-bold">{unreadCount}</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">All Messages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, organize, and manage contact requests.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <MailOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No messages yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Messages submitted through your contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => {
              const status = statusConfig[message.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={message._id}
                  className="p-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                    {/* Message Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">{message.subject}</h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {message.name}
                        </span>
                        <span>•</span>
                        <a
                          href={`mailto:${message.email}`}
                          className="hover:text-primary hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>

                      <div className="mt-4 rounded-lg bg-muted/50 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.message}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Received{" "}
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                      <div className="relative">
                        <select
                          value={message.status}
                          disabled={updatingId === message._id}
                          onChange={(event) =>
                            handleStatusChange(
                              message._id,
                              event.target.value as ContactMessageStatus
                            )
                          }
                          className="appearance-none rounded-lg border bg-background px-3 py-2 pr-9 text-sm font-medium outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>

                      <button
                        type="button"
                        disabled={deletingId === message._id}
                        onClick={() => setMessageToDelete(message)}
                        className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === message._id ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Deleting
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pro Confirmation Modal Dialog */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMessageToDelete(null)}
          />

          {/* Modal Container */}
          <div className="relative z-50 w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-lg transition-all animate-in fade-in-0 zoom-in-95">
            <button
              type="button"
              onClick={() => setMessageToDelete(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  Delete Message
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete the message from{" "}
                  <span className="font-medium text-foreground">
                    "{messageToDelete.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === messageToDelete._id}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deletingId === messageToDelete._id ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Message"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}