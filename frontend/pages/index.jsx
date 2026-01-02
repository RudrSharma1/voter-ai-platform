import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Voter AI Platform</h1>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-indigo-600 text-white rounded"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-2 bg-gray-800 text-white rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
