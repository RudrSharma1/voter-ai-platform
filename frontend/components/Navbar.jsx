import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="relative z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow">
      <h2 className="font-bold text-lg">
        Voter AI Platform
      </h2>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
