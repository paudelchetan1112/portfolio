"use client";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "HTML/CSS",
    ],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "Python", "REST APIs", "GraphQL", "JWT"],
  },
  {
    title: "Database",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Prisma", "Mongoose"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Linux"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Skills & Technologies
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4 text-lg">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
