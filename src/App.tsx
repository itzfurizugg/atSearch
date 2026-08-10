import { useState, useEffect, useRef } from "react";
import Clock from "./components/clock";
// import Dock from "./components/dock";
import { findBookmark } from "./data/bookmark";

function resolveTarget(input: string): string {
  const bookmark = findBookmark(input);
  if (bookmark) return bookmark.url;

  const q = input.trim();
  const isUrl = /^https?:\/\//.test(q) || (/^[\w-]+(\.[\w-]+)+/.test(q) && !q.includes(" "));
  if (isUrl) return q.startsWith("http") ? q : `https://${q}`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        return;
      }

      if (searchOpen) return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
        setQuery(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      const bookmark = findBookmark(q);
      if (bookmark) {
        window.location.href = bookmark.url;
        return;
      }
      const isUrl = /^https?:\/\//.test(q) || (/^[\w-]+(\.[\w-]+)+/.test(q) && !q.includes(" "));
      window.location.href = isUrl ? (q.startsWith("http") ? q : `https://${q}`) : `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    } else {
      setQuery("");
      setSearchOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSearchOpen(false);
      return;
    }
    setQuery(value);
  };

  const q = query.trim();
  const preview = q ? findBookmark(q) : null;

  return (
    <div className="app min-h-screen flex flex-col items-center justify-center text-center">
      <Clock />
      {searchOpen && (
        <form className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100]" onSubmit={handleSearch}>
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-xl px-6 py-4 w-[500px] max-w-[90vw]">
            <svg
              className="text-[#888] shrink-0"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                className="bg-transparent border-none outline-none text-[#e0e0e0] font-mono text-xl w-6xl tracking-wide placeholder:text-[#555]"
                value={query}
                onChange={handleChange}
                placeholder="Search Google..."
              />
            </div>
            {preview && (
              <a
                className="inline-flex items-center gap-2 shrink-0 bg-[#141414] border border-[#2a2a2a] rounded-full px-3.5 py-1.5 text-sm no-underline whitespace-nowrap max-w-[40%] transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#1a1a1a]"
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                title={preview.url}
              >
                <span className="text-[#e0e0e0] font-bold truncate">{preview.title}</span>
                <span className="text-emerald-400 font-bold">→</span>
              </a>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default App;