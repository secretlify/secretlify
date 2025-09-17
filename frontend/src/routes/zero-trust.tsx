import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import {
  KeyRound,
  Lock,
  Shield,
  Server,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  Fingerprint,
  ShieldCheck,
  FileKey,
  FolderLock,
  Terminal,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sections: Section[] = [
    {
      id: 0,
      title: "Local Key Generation",
      description: "Your journey to zero-trust security begins here",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Local Key Generation
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            After you log in, your browser becomes a secure vault. It locally
            generates a pair of asymmetric cryptographic keys using
            industry-standard algorithms. Your{" "}
            <strong className="text-white">private key</strong> never leaves
            your browser in plaintext, while the{" "}
            <strong className="text-white">public key</strong> can be shared
            safely with anyone. All cryptographic operations happen locally in
            your browser.
          </p>
        </div>
      ),
      illustration: <KeyPairIllustration />,
    },
    {
      id: 1,
      title: "Passphrase Encryption",
      description: "Your master key to unlock everything",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Passphrase Encryption
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            You create a strong passphrase that acts as your master key. This
            passphrase encrypts your private key using{" "}
            <strong className="text-white">AES-256-GCM</strong> encryption,
            adding an extra layer of security. Your passphrase{" "}
            <strong className="text-white">never leaves your device</strong>.
            Even if someone accesses your encrypted key, it's{" "}
            <strong className="text-white">
              useless without your passphrase
            </strong>
            .
          </p>
        </div>
      ),
      illustration: <PassphraseIllustration />,
    },
    {
      id: 2,
      title: "Encrypted Storage",
      description: "Your keys travel safely to our servers",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Encrypted Storage
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Your encrypted private key and public key are securely transmitted
            to our servers. This enables seamless access from any device while
            maintaining zero-trust security. We store your{" "}
            <strong className="text-white">encrypted private key</strong> - we
            can't decrypt it. Log in from any browser and{" "}
            <strong className="text-white">download your keys</strong>. Your
            passphrase unlocks everything{" "}
            <strong className="text-white">locally in your browser</strong>.
          </p>
        </div>
      ),
      illustration: <TransferIllustration />,
    },
    {
      id: 3,
      title: "Project-Level Security",
      description: "Every project gets its own secure vault",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Project-Level Security
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            When you create a new project, your browser generates a strong,
            random password. This project key is then encrypted using your
            private key before being sent to our servers. Each project has a{" "}
            <strong className="text-white">unique encryption key</strong>.
            Project keys are encrypted with{" "}
            <strong className="text-white">your private key</strong>. Only
            encrypted project keys are{" "}
            <strong className="text-white">stored on our servers</strong>.
          </p>
        </div>
      ),
      illustration: <ProjectKeyIllustration />,
    },
    {
      id: 4,
      title: "End-to-End Encryption",
      description: "Your secrets remain truly secret",
      content: (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            End-to-End Encryption
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Every change you make is encrypted using the project key before
            leaving your browser. Our servers only ever see encrypted data - we
            have zero knowledge of your actual secrets. We{" "}
            <strong className="text-white">cannot access your secrets</strong> -
            it's mathematically impossible. All encryption happens{" "}
            <strong className="text-white">in your browser</strong> before
            transmission. Even in a breach, your data remains{" "}
            <strong className="text-white">completely secure</strong>.
          </p>
        </div>
      ),
      illustration: <DataEncryptionIllustration />,
    },
  ];

  return (
    <div className="bg-black">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-black to-blue-900/10 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Zero Trust
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover how we achieve true end-to-end encryption where even we can't
          access your secrets
        </motion.p>
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
      </div>

      {/* Main scrollable content */}
      <div
        ref={containerRef}
        className="relative"
        style={{ minHeight: `${sections.length * 150}vh` }}
      >
        {sections.map((section, index) => (
          <SectionAnimated
            key={section.id}
            section={section}
            index={index}
            scrollProgress={scrollYProgress}
            totalSections={sections.length}
          />
        ))}
      </div>

      {/* Extra space at the bottom */}
      <div className="h-screen" />
    </div>
  );
}

// Animated Section Component
function SectionAnimated({
  section,
  index,
  scrollProgress,
  totalSections,
}: {
  section: Section;
  index: number;
  scrollProgress: any;
  totalSections: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Calculate animation values based on scroll position
  const sectionHeight = 1 / totalSections;
  const start = index * sectionHeight;
  const end = (index + 1) * sectionHeight;
  const mid = start + sectionHeight * 0.5;

  // Define transition points - minimal overlap between sections
  const transitionZone = sectionHeight * 0.03; // Very small transition zone
  const fadeInStart = Math.max(0, start - transitionZone);
  const fadeInEnd = start + transitionZone;
  const fadeOutStart = end - transitionZone * 2;
  const fadeOutEnd = Math.min(1, end - transitionZone);

  // Opacity: sharp fade in and out to minimize overlap
  const opacity = useTransform(
    scrollProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Y position: unified movement for cleaner transitions
  const yContent = useTransform(
    scrollProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [100, 0, 0, -100]
  );

  const yIllustration = useTransform(
    scrollProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [150, 0, 0, -150]
  );

  // Scale: unified breathing effect
  const scale = useTransform(
    scrollProgress,
    [fadeInStart, fadeInEnd, mid, fadeOutStart, fadeOutEnd],
    [0.9, 1, 1.02, 1, 0.9]
  );

  const scaleIllustration = useTransform(
    scrollProgress,
    [fadeInStart, fadeInEnd, mid, fadeOutStart, fadeOutEnd],
    [0.8, 1, 1.05, 1, 0.8]
  );

  // Blur for depth perception - quick transitions
  const blur = useTransform(
    scrollProgress,
    [fadeInStart, fadeInStart + 0.02, fadeOutStart - 0.02, fadeOutEnd],
    [10, 0, 0, 10]
  );

  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      ref={sectionRef}
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        filter,
        zIndex: 10 + index,
      }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side - Illustration */}
          <motion.div
            className="relative"
            style={{
              y: yIllustration,
              scale: scaleIllustration,
            }}
          >
            {/* Background glow effect that pulses */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
              style={{ scale: scaleIllustration }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative z-10">{section.illustration}</div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            style={{
              y: yContent,
              scale,
            }}
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
                Step {index + 1} of 5
              </span>
            </div>
            {section.content}
          </motion.div>
        </div>
      </div>
    </motion.div>
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

        {/* Browser Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-bold text-white">Your Browser</h3>
          </div>

          <div className="space-y-4">
            {/* Private Key Card */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 ">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Private Key</h4>
                  <p className="text-xs text-blue-300">Secret - never shared</p>
                </div>
              </div>
            </div>

            {/* Public Key Card */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 ">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Public Key</h4>
                  <p className="text-xs text-purple-300">Safe to share</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="relative bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Fingerprint className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Your Passphrase</h4>
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
        </div>

        {/* Encryption Process with Lock */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-2xl opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-black/50 backdrop-blur rounded-full p-6">
              <Lock className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        {/* Encrypted Private Key */}
        <div className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Encrypted Private Key
              </h4>
              <p className="text-sm text-blue-300">AES-256 encrypted</p>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-blue-300">
            U2FsdGVkX1+iX5Fy6v3LOhKxT4A2R8mZ9B...
          </div>

          {/* Green Shield - Only you can decrypt */}
          <div className="bg-black/50 rounded-lg p-3 mt-4 flex flex-row gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400 font-medium">
              Only you can decrypt this
            </p>
          </div>
        </div>
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
        <div className="relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-purple-400" />
            <h4 className="text-lg font-bold text-white">Your Browser</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 rounded-lg p-3">
              <Lock className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-gray-300">Private Key</p>
            </div>
            <div className="bg-black/50 rounded-lg p-3">
              <KeyRound className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-gray-300">Public Key</p>
            </div>
          </div>
        </div>

        {/* Transfer Animation */}
        <div className="relative h-20 mb-8">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 text-pink-400 rotate-90" />
          </motion.div>

          {/* Data Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, 60],
                x: ["-50%", `${(i - 1) * 20}px`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Server Side */}
        <div className="relative bg-gradient-to-br from-pink-900/50 to-pink-800/50 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-pink-400" />
            <h4 className="text-lg font-bold text-white">Our Servers</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 rounded-lg p-3">
              <Lock className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-gray-300">
                <span className="text-red-400 font-semibold">ENCRYPTED</span>{" "}
                Private Key
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-3">
              <KeyRound className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-gray-300">Public Key</p>
            </div>
          </div>

          {/* Green Shield - Only you can decrypt */}
          <div className="bg-black/50 rounded-lg p-3 mt-4 flex flex-row gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400 font-medium">
              Only you can decrypt this
            </p>
          </div>
        </div>
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

          {/* Project Key + Public Key */}
          <div className="flex items-center gap-3">
            <motion.div
              className="bg-black/50 border border-orange-500/30 rounded-lg p-3 flex-1"
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
                  Project Key
                </span>
              </div>
            </motion.div>

            <span className="text-white text-lg font-bold">+</span>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-3 flex-1">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white font-semibold">
                  Your Public Key
                </span>
              </div>
            </div>
          </div>
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

          <div className="flex flex-col gap-4">
            <div className="bg-black/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-5 h-5 text-red-400" />
                <p className="text-sm text-gray-300">
                  <span className="text-red-400 font-semibold">ENCRYPTED</span>{" "}
                  Project Key
                </p>
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-3">
              <div className="flex flex-row gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400 font-medium">
                  Only you can decrypt this
                </p>
              </div>
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
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Your Changes */}
        <div className="relative bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Your Secret Data</h4>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm text-cyan-300">
            API_KEY=sk-1234567890abcdef
          </div>
        </div>

        {/* Encryption Process with Shield */}
        <div className="relative h-20 flex items-center justify-center mb-6">
          <motion.div
            className="absolute"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-2xl" />
          </motion.div>

          <div className="relative bg-black/50 backdrop-blur rounded-full p-5">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Encrypted Result */}
        <div className="relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-bold text-white">What We Store</h4>
          </div>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm text-blue-300 break-all">
            {encryptedData || "Loading..."}
          </div>

          {/* Green Shield - Only you can decrypt */}
          {/* Green Shield - Only you can decrypt */}
          <div className="bg-black/50 rounded-lg p-3 mt-4 flex flex-row gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400 font-medium">
              Only you can decrypt this
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
