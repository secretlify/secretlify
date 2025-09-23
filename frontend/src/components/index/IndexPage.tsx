import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Beams from "@/components/Beams";
import {
  Shield,
  Lock,
  KeyRound,
  Fingerprint,
  Server,
  Terminal,
  Users,
  Zap,
  ArrowRight,
  Check,
  GitBranch,
  Rocket,
} from "lucide-react";

export function IndexPage() {
  return (
    <div className="min-h-screen bg-black tracking-wide">
      {/* Hero Section with Beams */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={2}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>

        <motion.div
          className="relative z-10 mt-20 w-full max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <h1 className="text-center text-5xl font-bold text-neutral-100 md:text-7xl lg:text-8xl">
            <span className="">Cryptly</span>
          </h1>

          <motion.p
            className="mx-auto mt-6  text-center text-xl text-neutral-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1], delay: 0.2 }}
          >
            Zero-knowledge secrets management
            <br />
            where even we can't access your data
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1], delay: 0.4 }}
          >
            <Link
              to="/app/project/$projectId"
              params={{ projectId: "demo" }}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://github.com/secretlify/secretlify"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/70 px-8 py-3 font-semibold text-white transition-all hover:border-neutral-600 hover:bg-neutral-800/70"
            >
              <GitHubIcon className="h-5 w-5" />
              <span>Source</span>
            </a>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center justify-center gap-8 text-sm text-neutral-300 bg-black/20 rounded-full px-4 py-2 w-fit mx-auto backdrop-blur-md border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 ">
              <Check className="h-4 w-4 text-green-600" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>E2E Encrypted</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <p className="text-sm">Scroll to explore</p>
        </motion.div>
      </section>

      {/* Features Section with GlowingEffect */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0, 1, 0, 1] }}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              <span className="">Why Cryptly?</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              True zero-knowledge architecture means your secrets are yours
              alone
            </p>
          </motion.div>

          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Lock className="h-5 w-5 text-neutral-400" />}
              title="End-to-End Encryption"
              description="All encryption happens in your browser. We never see your actual secrets - it's mathematically impossible for us to decrypt them."
            />

            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<KeyRound className="h-5 w-5 text-neutral-400" />}
              title="Local Key Generation"
              description="Your cryptographic keys are generated locally in your browser. Your private key never leaves your device in plaintext."
            />

            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Shield className="h-5 w-5 text-neutral-400" />}
              title="Passphrase Protected"
              description="Your private key is encrypted with your passphrase using AES-256-GCM. Even if someone accesses your encrypted key, it's useless without your passphrase."
            />

            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Users className="h-5 w-5 text-neutral-400" />}
              title="Secure Team Collaboration"
              description="Share secrets with your team without compromising security. Each member has their own keys and encryption."
            />

            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Zap className="h-5 w-5 text-neutral-400" />}
              title="Lightning Fast & Reliable"
              description="All cryptographic operations happen locally for instant response. No waiting for server-side encryption or decryption."
            />
          </ul>
        </div>
      </section>

      {/* How It Works Summary */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black to-neutral-950">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0, 1, 0, 1] }}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              <span className="">How It Works</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Military-grade encryption meets developer-friendly experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: [0, 0.55, 0.45, 1],
                delay: 0.1,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/20 p-3">
                <Fingerprint className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                1. Authenticate
              </h3>
              <p className="text-sm text-neutral-400">
                Log in and your browser generates a unique cryptographic key
                pair. Your private key is immediately encrypted with your
                passphrase.
              </p>
            </motion.div>

            <motion.div
              className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: [0, 0.55, 0.45, 1],
                delay: 0.2,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg bg-purple-500/20 p-3">
                <Terminal className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                2. Create & Edit
              </h3>
              <p className="text-sm text-neutral-400">
                Every secret you add is encrypted in your browser before
                transmission. Each project has its own encryption key for
                additional security.
              </p>
            </motion.div>

            <motion.div
              className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: [0, 0.55, 0.45, 1],
                delay: 0.3,
              }}
            >
              <div className="mb-4 inline-flex rounded-lg bg-pink-500/20 p-3">
                <Server className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                3. Store Securely
              </h3>
              <p className="text-sm text-neutral-400">
                We only store encrypted data. Even if our servers were
                compromised, your secrets remain safe - we literally cannot
                decrypt them.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              <span className="">Ready to secure your secrets?</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Join developers who trust Cryptly for zero-knowledge secrets
              management.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/app/project/$projectId"
                params={{ projectId: "demo" }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
              >
                <span>Start using Cryptly</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-500">
              <div className="flex items-center gap-2 ">
                <Check className="h-4 w-4 text-green-600" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>E2E Encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            © 2025 Cryptly. Zero-knowledge secrets management.
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <a
              href="https://github.com/secretlify/secretlify"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/secretlify/secretlify/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-neutral-800 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-neutral-900/50 backdrop-blur p-6 md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-neutral-700 bg-neutral-800/50 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-semibold text-white md:text-2xl">
                {title}
              </h3>
              <p className="font-sans text-sm text-neutral-400 md:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
