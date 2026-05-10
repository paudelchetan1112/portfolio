"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projectService } from "@/lib/services";
import type { Project } from "@/types";
import { ProjectForm } from "@/components/admin/project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getById(id);
        setProject(data.project);
      } catch (err) {
        setError("Failed to load project");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/admin/projects")}>
            View All Projects
          </Button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-1">
          Update {project.title}
        </p>
      </div>

      {/* Form */}
      <ProjectForm project={project} mode="edit" />
    </div>
  );
}
