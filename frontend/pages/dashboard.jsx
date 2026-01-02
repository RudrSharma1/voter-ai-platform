import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import ThreeBackground from "../components/ThreeBackground";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white transition-colors">
        
        {/* 3D Background */}
        <ThreeBackground />

        {/* Content */}
        <Navbar />

        <main className="relative z-10 p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            AI-Powered Voter Awareness Dashboard
          </h1>

          <div className="grid md:grid-cols-3 gap-6">
            <DashboardCard
              title="AI Voter Assistant"
              desc="Ask questions about voting rules and procedures."
              link="/chatbot"
            />
            <DashboardCard
              title="Verify News / Image"
              desc="Check misinformation using AI & image recognition."
              link="/image-check"
            />
            <DashboardCard
              title="Official Voter Info"
              desc="Verified data from trusted sources."
              link="/voter-info"
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, desc, link }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:scale-105 transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4 opacity-80">{desc}</p>
      <a
        href={link}
        className="text-indigo-500 font-medium hover:underline"
      >
        Open →
      </a>
    </div>
  );
}
