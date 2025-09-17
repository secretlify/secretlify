import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  KeyRound,
  Lock,
  Shield,
  Server,
  Eye,
  EyeOff,
  ArrowRight,
  Cloud,
  Database,
  Fingerprint,
  ShieldCheck,
  FileKey,
  FolderLock,
  Terminal,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/zero-trust")({
  component: ZeroTrustPage,
});

interface Section {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  illustration: React.ReactNode;
}

function ZeroTrustPage() {
  const sections: Section[] = [
    {
      id: 0,
      title: "Asymmetric Key Generation",
      description: "Your journey to zero-trust security begins here",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Local Key Generation
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            After you log in, your browser becomes a secure vault. It locally
            generates a pair of asymmetric cryptographic keys using
            industry-standard algorithms.
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-blue-400 mb-3">
              How it works:
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  Your <strong className="text-white">private key</strong> never
                  leaves your browser in plaintext
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>
                  The <strong className="text-white">public key</strong> can be
                  shared safely with anyone
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  All cryptographic operations happen locally in your browser
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
      illustration: <KeyPairIllustration />,
    },
    {
      id: 1,
      title: "Passphrase Protection",
      description: "Your master key to unlock everything",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Passphrase Encryption
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            You create a strong passphrase that acts as your master key. This
            passphrase encrypts your private key using AES-256 encryption,
            adding an extra layer of security.
          </p>
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-green-400 mb-3">
              Security features:
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 mt-1" />
                <span>
                  Your passphrase{" "}
                  <strong className="text-white">
                    never leaves your device
                  </strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 mt-1" />
                <span>
                  Private key is encrypted with{" "}
                  <strong className="text-white">AES-256-GCM</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Fingerprint className="w-5 h-5 text-purple-400 mt-1" />
                <span>
                  Even if someone accesses your encrypted key, it's{" "}
                  <strong className="text-white">
                    useless without your passphrase
                  </strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
      illustration: <PassphraseIllustration />,
    },
    {
      id: 2,
      title: "Secure Key Transfer",
      description: "Your keys travel safely to our servers",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Encrypted Storage
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Your encrypted private key and public key are securely transmitted
            to our servers. This enables seamless access from any device while
            maintaining zero-trust security.
          </p>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-purple-400 mb-3">
              What this means:
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <Server className="w-5 h-5 text-purple-400 mt-1" />
                <span>
                  We store your{" "}
                  <strong className="text-white">encrypted private key</strong>{" "}
                  - we can't decrypt it
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Cloud className="w-5 h-5 text-pink-400 mt-1" />
                <span>
                  Log in from any browser and{" "}
                  <strong className="text-white">download your keys</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400 mt-1" />
                <span>
                  Your passphrase unlocks everything{" "}
                  <strong className="text-white">
                    locally in your browser
                  </strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
      illustration: <TransferIllustration />,
    },
    {
      id: 3,
      title: "Project Key Encryption",
      description: "Every project gets its own secure vault",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Project-Level Security
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            When you create a new project, your browser generates a strong,
            random password. This project key is then encrypted using your
            private key before being sent to our servers.
          </p>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-orange-400 mb-3">
              Multi-layer encryption:
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <FileKey className="w-5 h-5 text-orange-400 mt-1" />
                <span>
                  Each project has a{" "}
                  <strong className="text-white">unique encryption key</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FolderLock className="w-5 h-5 text-red-400 mt-1" />
                <span>
                  Project keys are encrypted with{" "}
                  <strong className="text-white">your private key</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Database className="w-5 h-5 text-yellow-400 mt-1" />
                <span>
                  Only encrypted project keys are{" "}
                  <strong className="text-white">stored on our servers</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
      illustration: <ProjectKeyIllustration />,
    },
    {
      id: 4,
      title: "Zero-Trust Data Storage",
      description: "Your secrets remain truly secret",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            End-to-End Encryption
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Every change you make is encrypted using the project key before
            leaving your browser. Our servers only ever see encrypted data - we
            have zero knowledge of your actual secrets.
          </p>
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-cyan-400 mb-3">
              True zero-trust architecture:
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-cyan-400 mt-1" />
                <span>
                  We{" "}
                  <strong className="text-white">
                    cannot access your secrets
                  </strong>{" "}
                  - it's mathematically impossible
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-blue-400 mt-1" />
                <span>
                  All encryption happens{" "}
                  <strong className="text-white">in your browser</strong> before
                  transmission
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                <span>
                  Even in a breach, your data remains{" "}
                  <strong className="text-white">completely secure</strong>
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <p className="text-center text-xl font-semibold text-green-400">
              🔒 Your secrets are safe with math, not trust
            </p>
          </div>
        </div>
      ),
      illustration: <DataEncryptionIllustration />,
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Trust
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Discover how we achieve true end-to-end encryption where even we
            can't access your secrets
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-sm text-gray-500">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-8 h-8 text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sections */}
      <div className="relative">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="min-h-screen flex items-center justify-center py-20"
          >
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                {/* Left Side - Illustration */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="relative z-10">{section.illustration}</div>
                </motion.div>

                {/* Right Side - Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400 mb-4">
                      Step {index + 1} of 5
                    </span>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {section.title}
                    </h2>
                    <p className="text-gray-400">{section.description}</p>
                  </div>
                  {section.content}
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Illustration Components
function KeyPairIllustration() {
  return (
    <div className="relative">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Private Key Card */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 mb-6 shadow-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Private Key</h4>
              <p className="text-sm text-blue-300">
                Kept secret in your browser
              </p>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-blue-300 overflow-hidden">
            <motion.div
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              -----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQE...
            </motion.div>
          </div>
        </motion.div>

        {/* Public Key Card */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <KeyRound className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Public Key</h4>
              <p className="text-sm text-purple-300">
                Safe to share with anyone
              </p>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-purple-300 overflow-hidden">
            <motion.div
              animate={{ x: [0, -100, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                delay: 5,
              }}
            >
              -----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFA...
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PassphraseIllustration() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Passphrase Input */}
        <motion.div
          className="relative bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 mb-6 shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Fingerprint className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Your Passphrase</h4>
              <p className="text-sm text-green-300">Master key to everything</p>
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value="MySecurePassphrase#2024!"
              readOnly
              className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-white font-mono pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Encryption Process */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-32 h-32 mx-auto mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-xl opacity-50" />
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        {/* Encrypted Private Key */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">
                Encrypted Private Key
              </h4>
              <p className="text-sm text-blue-300">AES-256 encrypted</p>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-blue-300 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              U2FsdGVkX1+iX5Fy6v3LOhKxT4A2R8mZ9B...
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TransferIllustration() {
  return (
    <div className="relative">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Browser Side */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-purple-400" />
            <h4 className="text-lg font-bold text-white">Your Browser</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/50 rounded-lg p-3">
              <Lock className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-gray-300">Encrypted Private Key</p>
            </div>
            <div className="bg-black/50 rounded-lg p-3">
              <KeyRound className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-gray-300">Public Key</p>
            </div>
          </div>
        </motion.div>

        {/* Transfer Animation */}
        <div className="relative h-24 mb-8">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={{ y: [0, 60, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <ArrowRight className="w-6 h-6 text-pink-400 rotate-90" />
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
                animate={{ scale: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Data Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, 80],
                x: ["-50%", `${(i - 2) * 20}px`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Server Side */}
        <motion.div
          className="relative bg-gradient-to-br from-pink-900/50 to-pink-800/50 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-pink-400" />
            <h4 className="text-lg font-bold text-white">Our Servers</h4>
          </div>
          <div className="bg-black/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Cloud className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-300">Securely Stored:</p>
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Encrypted private key (can't decrypt)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Public key for verification</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectKeyIllustration() {
  return (
    <div className="relative">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />

        {/* Project Creation */}
        <motion.div
          className="relative bg-gradient-to-br from-orange-900/50 to-orange-800/50 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 mb-6 shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FolderLock className="w-6 h-6 text-orange-400" />
            <h4 className="text-lg font-bold text-white">New Project</h4>
          </div>

          {/* Random Key Generation Animation */}
          <div className="bg-black/50 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">
              Generating random key...
            </p>
            <motion.div
              className="font-mono text-xs text-orange-300"
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {Math.random().toString(36).substring(2, 15)}
            </motion.div>
          </div>

          {/* Project Key */}
          <motion.div
            className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-3"
            animate={{
              borderColor: [
                "rgba(251, 146, 60, 0.3)",
                "rgba(251, 146, 60, 0.6)",
                "rgba(251, 146, 60, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-2">
              <FileKey className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white font-semibold">
                Project Encryption Key
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Encryption Process */}
        <div className="relative mb-6">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur-xl" />
          </motion.div>
          <div className="relative flex items-center justify-center h-20">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-10 h-10 text-red-400" />
            </motion.div>
          </div>
        </div>

        {/* Encrypted Result */}
        <motion.div
          className="relative bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-red-400" />
            <h4 className="text-lg font-bold text-white">Stored on Server</h4>
          </div>

          <div className="bg-black/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Encrypted project key:</p>
            <div className="font-mono text-xs text-red-300 break-all">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
              </motion.span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-green-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">Only you can decrypt this</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DataEncryptionIllustration() {
  const [encryptedData, setEncryptedData] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setEncryptedData(btoa(Math.random().toString()).substring(0, 20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Your Changes */}
        <motion.div
          className="relative bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-4 shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Your Secret Data</h4>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm text-cyan-300">
            API_KEY=sk-1234567890abcdef
          </div>
        </motion.div>

        {/* Encryption Animation */}
        <div className="relative h-32 flex items-center justify-center">
          <motion.div
            className="absolute"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-2xl" />
          </motion.div>

          {/* Encryption Process Visualization */}
          <div className="relative grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-sm"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>

        {/* Encrypted Result */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-bold text-white">What We Store</h4>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm text-blue-300 break-all">
            {encryptedData || "Loading..."}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-green-400">
            <EyeOff className="w-5 h-5" />
            <span className="text-sm font-semibold">
              Zero Knowledge Architecture
            </span>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          className="mt-6 mx-auto w-fit"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">
              Mathematically Secure
            </span>
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
