"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between container-x py-5 mix-blend-difference">
      <div className="flex items-center gap-6 text-xs tracking-[0.15em] uppercase text-cream/70">
        <a href="#" className="hover:text-accent transition-colors duration-300">WA</a>
        <a href="#" className="hover:text-accent transition-colors duration-300">X</a>
        <a href="#" className="hover:text-accent transition-colors duration-300">IG</a>
        <a href="#" className="hover:text-accent transition-colors duration-300">LI</a>
        <a href="#" className="hover:text-accent transition-colors duration-300">EMAIL</a>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="font-[var(--font-playfair)] text-accent text-lg tracking-wide italic">
          Bloomingbird
        </span>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col gap-1.5 group cursor-pointer"
        aria-label="Toggle menu"
      >
        <span className={`block w-8 h-[2px] bg-cream transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
        <span className={`block w-8 h-[2px] bg-cream transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
      </button>

      {menuOpen && (
        <div className="fixed inset-0 bg-bg/95 backdrop-blur-md z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {["Home", "Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-h2 font-[var(--font-playfair)] text-cream hover:text-accent transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
