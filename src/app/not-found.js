import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-[#15892e]">The Grow Food</h1>
      <p className="text-2xl mt-4">Oops Page not found.</p>
      <p className="text-gray-600 mt-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <p className="mt-6 px-6 py-2 bg-[#15892e] text-white text-lg rounded-lg hover:bg-blue-600 transition">
          Go Back Home
        </p>
      </Link>
    </div>
  );
}
