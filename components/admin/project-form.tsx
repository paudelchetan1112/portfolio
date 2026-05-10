"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { projectService } from "@/lib/services";
import type { Project, ProjectFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.enum(["web", "mobile", "desktop", "ai", "other"]),
  featured: z.boolean(),
});

type FormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  mode: "create" | "edit";
}

const categories = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "ai", label: "AI" },
  { value: "other", label: "Other" },
];

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || []
  );
  const [languages, setLanguages] = useState<string[]>(project?.languages || []);
  const [techInput, setTechInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      liveLink: project?.liveLink || "",
      githubLink: project?.githubLink || "",
      category: project?.category || "web",
      featured: project?.featured || false,
    },
  });

  const featured = watch("featured");
  const categoryValue = watch("category");

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const addLanguage = () => {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const payload: ProjectFormData = {
        ...data,
        image: data.image || undefined,
        liveLink: data.liveLink || undefined,
        githubLink: data.githubLink || undefined,
        technologies,
        languages,
      };

      if (mode === "create") {
        await projectService.create(payload);
        toast.success("Project created successfully!");
      } else if (project) {
        await projectService.update(project._id, payload);
        toast.success("Project updated successfully!");
      }

      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error(
        mode === "create"
          ? "Failed to create project"
          : "Failed to update project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Project"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  rows={5}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  {...register("image")}
                  className={errors.image ? "border-destructive" : ""}
                />
                {errors.image && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liveLink">Live URL</Label>
                <Input
                  id="liveLink"
                  placeholder="https://myproject.com"
                  {...register("liveLink")}
                  className={errors.liveLink ? "border-destructive" : ""}
                />
                {errors.liveLink && (
                  <p className="text-sm text-destructive">
                    {errors.liveLink.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub URL</Label>
                <Input
                  id="githubLink"
                  placeholder="https://github.com/username/repo"
                  {...register("githubLink")}
                  className={errors.githubLink ? "border-destructive" : ""}
                />
                {errors.githubLink && (
                  <p className="text-sm text-destructive">
                    {errors.githubLink.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies & Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="React, Node.js, etc."
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTechnology}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Programming Languages</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="JavaScript, Python, etc."
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addLanguage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={categoryValue}
                  onValueChange={(value) =>
                    setValue("category", value as FormData["category"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Project</Label>
                  <p className="text-sm text-muted-foreground">
                    Display on homepage
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {mode === "create" ? "Creating..." : "Saving..."}
                    </>
                  ) : mode === "create" ? (
                    "Create Project"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/projects")}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
