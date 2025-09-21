import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";

export function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6 text-center bg-background text-foreground">
      <div className="relative">
        {/* Multiple random background glow effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-2xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-500/25 via-blue-500/25 to-purple-500/25 blur-3xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Secretlify
          </span>
        </h1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/app/project/$projectId"
          className="rounded-md border border-border px-4 py-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition"
          params={{ projectId: "demo" }}
        >
          Dashboard
        </Link>
        <Link
          to="/architecture"
          className="rounded-md border border-border px-4 py-2 bg-background text-muted-foreground hover:bg-black/200 hover:text-accent-foreground transition"
        >
          How it works
        </Link>
        <a
          href="https://github.com/secretlify/secretlify"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-4 py-2 bg-background text-muted-foreground hover:bg-black/200 hover:text-accent-foreground transition inline-flex items-center gap-2"
        >
          <GitHubIcon className="w-4 h-4" />
          Source
        </a>
      </div>
      <div className="text-xs text-muted-foreground">
        Zero-knowledge sharing free forever
      </div>
    </div>
  );
}
