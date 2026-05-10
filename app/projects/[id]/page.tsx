"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projectService } from "@/lib/services";
import type { Project } from "@/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Code2,
  Globe,
} from "lucide-react";

export default function ProjectDetailsPage({
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <ProjectDetailsSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The project you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.push("/#projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/#projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="capitalize">
                {project.category}
              </Badge>
              {project.featured && (
                <Badge className="bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {project.title}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </header>

          {/* Image */}
          {project.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-8">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  <Globe className="h-4 w-4 mr-2" />
                  View Live Site
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </Button>
              </a>
            )}
          </div>

          {/* Description */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">About this project</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </section>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {project.languages.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Programming Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="text-sm px-3 py-1"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="pt-8 border-t border-border">
            <Link href="/#projects">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Projects
              </Button>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="aspect-video rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
