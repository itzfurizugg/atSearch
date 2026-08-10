import { useState, useEffect, useRef } from "react";
import Clock from "./components/clock";
// import Dock from "./components/dock";
import { findBookmark } from "./data/bookmark";

type Background = {
  id: string;
  name: string;
  type: "gradient" | "image";
  style?: string;
  src?: string;
};

const BACKGROUNDS: Background[] = [
  { id: "abyss", name: "Abyss", type: "gradient", style: "linear-gradient(135deg, #0a0a0a 0%, #14141f 50%, #0d1b2a 100%)" },
  { id: "sunrise", name: "Sunrise", type: "gradient", style: "linear-gradient(135deg, #1b0f00 0%, #59343a 50%, #0f172a 100%)" },
  { id: "forest", name: "Forest", type: "gradient", style: "linear-gradient(135deg, #06120a 0%, #143d2b 50%, #0a0f0a 100%)" },
  { id: "violet", name: "Violet", type: "gradient", style: "linear-gradient(135deg, #0a0510 0%, #33215c 50%, #0f1028 100%)" },
  { id: "ember", name: "Ember", type: "gradient", style: "linear-gradient(135deg, #0f0a02 0%, #7a2f17 50%, #180b05 100%)" },
  { id: "lavender", name: "Lavender", type: "gradient", style: "linear-gradient(135deg, #AF719D 0%, #8B639B 50%, #403D88 100%)" },
  { id: "aqua", name: "Aqua", type: "gradient", style: "linear-gradient(135deg, #2C5EAD 0%, #7AAACE 50%, #111844 100%)" },
  { id: "matcha", name: "Matcha", type: "gradient", style: "linear-gradient(135deg, #88BDA4 0%, #67C090 50%, #1F6F5F 100%)" },


];

const DB_NAME = "ac-bg-db";
const STORE = "backgrounds";
const CUSTOM_KEY = "custom-list";

type CSSProps = React.CSSProperties;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadCustoms(): Promise<Background[]> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(CUSTOM_KEY);
      req.onsuccess = () => resolve((req.result as Background[]) ?? []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function saveCustoms(list: Background[]) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(list, CUSTOM_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

function resizeToDataUrl(file: File, maxDim = 1920, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function BackgroundLayer({
  bg,
  blur,
  animate,
  onAnimationEnd,
}: {
  bg: Background;
  blur: number;
  animate?: boolean;
  onAnimationEnd?: () => void;
}) {
  const style: CSSProps =
    bg.type === "image"
      ? {
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
      : { background: bg.style };

  return (
    <div
      className={`fixed inset-0 scale-110 transition-all duration-500 ${animate ? "animate-bg-fade" : ""}`}
      style={{ ...style, filter: `blur(${blur}px)` }}
      onAnimationEnd={onAnimationEnd}
      aria-hidden
    />
  );
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [blur, setBlur] = useState<number>(() => {
    const saved = Number(localStorage.getItem("ac-blur"));
    return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), 60) : 30;
  });
  const [bgId, setBgId] = useState<string>(
    () => localStorage.getItem("ac-bg") ?? "abyss",
  );
  const [committedId, setCommittedId] = useState<string>(bgId);
  const [customBgs, setCustomBgs] = useState<Background[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCustoms().then(setCustomBgs);
  }, []);

  useEffect(() => {
    localStorage.setItem("ac-bg", bgId);
  }, [bgId]);

  useEffect(() => {
    localStorage.setItem("ac-blur", String(blur));
  }, [blur]);

  useEffect(() => {
    const closeSearch = () => {
      if (!searchOpen || closing) return;
      setClosing(true);
      setTimeout(() => {
        setSearchOpen(false);
        setClosing(false);
        setQuery("");
      }, 300);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
        return;
      }

      if (searchOpen || closing) return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
        setQuery(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, closing]);

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
    } else if (!closing) {
      setClosing(true);
      setTimeout(() => {
        setSearchOpen(false);
        setClosing(false);
        setQuery("");
      }, 300);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" && searchOpen && !closing) {
      setClosing(true);
      setTimeout(() => {
        setSearchOpen(false);
        setClosing(false);
        setQuery("");
      }, 300);
      return;
    }
    setQuery(value);
  };

  const allBgs = [...customBgs, ...BACKGROUNDS];
  const bg = allBgs.find((b) => b.id === bgId) ?? allBgs[0];
  const committed = allBgs.find((b) => b.id === committedId) ?? allBgs[0];
  const transitioning = bg.id !== committed.id;

  const selectBg = (id: string) => {
    setBgId(id);
    localStorage.setItem("ac-bg", id);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const src = await resizeToDataUrl(file);
      const id = `custom:${Date.now()}`;
      const record: Background = { id, name: file.name, type: "image", src };
      const next = [...customBgs, record];
      setCustomBgs(next);
      await saveCustoms(next);
      selectBg(id);
    } catch {
      // ignore
    }
  };

  const handleClearCustoms = async () => {
    setCustomBgs([]);
    await saveCustoms([]);
    if (bgId.startsWith("custom:")) selectBg("abyss");
  };

  const q = query.trim();
  const preview = q ? findBookmark(q) : null;

  const swatchStyle = (b: Background): CSSProps =>
    b.type === "image"
      ? { backgroundImage: `url(${b.src})` }
      : { background: b.style };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background blurred */}
      <BackgroundLayer bg={committed} blur={blur} />
      {transitioning && (
        <BackgroundLayer
          key={bg.id}
          bg={bg}
          blur={blur}
          animate
          onAnimationEnd={() => setCommittedId(bg.id)}
        />
      )}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
        <Clock />
        {searchOpen && (
          <form className={`fixed inset-0 flex items-center justify-center bg-black/70 z-[100] ${closing ? "animate-fade-out" : "animate-fade-in"}`} onSubmit={handleSearch}>
            <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#333] rounded-2xl px-8 py-6 w-[700px] max-w-[90vw] animate-launchpad transition-colors duration-200 focus-within:border-[#555]">
              <svg
                className="text-[#888] shrink-0"
                viewBox="0 0 24 24"
                width="24"
                height="24"
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
                  className="bg-transparent border-none outline-none text-[#e0e0e0] font-mono text-2xl w-full tracking-wide placeholder:text-[#555]"
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

      {/* background controller */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-3">
        <button
          className={`btn btn-circle btn-ghost border border-[#333] text-[#e0e0e0] transition-transform duration-300 ${paletteOpen ? "rotate-90" : ""}`}
          onClick={() => setPaletteOpen((o) => !o)}
          title="Ubah latar belakang"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22a10 10 0 1 1 10-10c0 1.66-1.34 3-3 3h-2.5A2.5 2.5 0 0 0 14 17.5V18a4 4 0 0 1-4 4Z" />
            <line x1="7" y1="10" x2="7.01" y2="10" />
            <line x1="11" y1="7" x2="11.01" y2="7" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        {paletteOpen && (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#333] bg-[#141414]/80 p-4 backdrop-blur animate-pop origin-bottom-right">
            <div className="flex flex-wrap gap-2">
              {allBgs.map((b) => (
                <button
                  key={b.id}
                  className={`h-9 w-9 rounded-full border-2 bg-cover bg-center transition-transform hover:scale-110 ${b.id === bg.id ? "border-white" : "border-[#444]"}`}
                  style={swatchStyle(b)}
                  onClick={() => selectBg(b.id)}
                  title={b.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs btn-outline border-[#333] text-[#e0e0e0]"
                onClick={() => fileRef.current?.click()}
              >
                Upload foto
              </button>
              {customBgs.length > 0 && (
                <button
                  className="btn btn-xs btn-ghost text-[#888]"
                  onClick={handleClearCustoms}
                >
                  Hapus {customBgs.length} foto
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#888]">
              Blur: {blur}px
              <input
                type="range"
                min={0}
                max={60}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="range range-xs"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;