"use client";

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-8 py-2 backdrop-blur-lg bg-white/70 shadow shadow-zinc-200 rounded-b-2xl w-full mx-auto fixed z-50 -translate-x-1/2 left-1/2">
      <div className="flex items-center space-x-2 text-2xl font-bold text-zinc-900">
        <div className="w-8 h-8 bg-linear-to-r from-pink-400 to-purple-500 rounded-full hover:animate-spin"></div>
        <span>Snsta</span>
      </div>
      <div className="hidden md:flex items-center space-x-8 text-zinc-700">
        <a
          href="#how-it-works"
          className="hover:text-pink-600 transition-colors"
        >
          How it works
        </a>
      </div>
      <button className="bg-rose-600 text-white px-6 py-2 rounded-full hover:bg-rose-700 transition-all flex items-center space-x-2">
        <span>Follow</span>
        <svg
          className="w-4 h-4 hidden sm:block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          ></path>
        </svg>
      </button>
    </nav>
  );
}
