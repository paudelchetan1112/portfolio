"use client";

import { Code2, Rocket, Users } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Writing maintainable, scalable, and well-documented code is my passion.",
  },
  {
    icon: Rocket,
    title: "Fast Delivery",
    description:
      "Efficient workflows and modern tools to deliver projects on time.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Strong communication skills for effective teamwork and client relations.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              I&apos;m a passionate Full Stack Developer with experience in
              building modern web applications. My journey in software
              development started with curiosity and has evolved into a
              professional career focused on creating impactful digital
              solutions.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              I specialize in JavaScript/TypeScript ecosystems, working with
              React, Next.js, Node.js, and various databases. I&apos;m always
              eager to learn new technologies and best practices to deliver
              high-quality products.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              When I&apos;m not coding, you can find me exploring new
              technologies, contributing to open-source projects, or sharing
              knowledge with the developer community.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid gap-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
