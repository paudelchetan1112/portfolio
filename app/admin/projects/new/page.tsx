"use client";

import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Add a new project to your portfolio
        </p>
      </div>

      {/* Form */}
      <ProjectForm mode="create" />
    </div>
  );
}
