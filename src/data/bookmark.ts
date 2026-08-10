export interface Bookmark {
    id: string;
    title: string;
    url: string;
    keywords: string[];
}

export const bookmarks: Bookmark[] = [
    {
        id: "youtube",
        title: "YouTube",
        url: "https://www.youtube.com",
        keywords: ["yt", "youtube"],
    },
    {
        id: "github",
        title: "GitHub",
        url: "https://github.com",
        keywords: ["git", "github"],
    },
    {
        id: "tiktok",
        title: "TikTOk",
        url: "https://tiktok.com",
        keywords: ["tiktok"],
    },
    {
        id: "telegram",
        title: "Telegram",
        url: "https://web.telegram.org",
        keywords: ["tele", "telegram"],
    },
    {
        id: "facebook",
        title: "Facebook",
        url: "https://facebook.com",
        keywords: ["fb", "facebook"],
    },
    {
        id: "whatsapp",
        title: "WhatsApp",
        url: "https://web.whatsapp.com",
        keywords: ["wa", "waweb", "whatsapp"],
    },
    {
        id: "vercel",
        title: "Vercel",
        url: "https://web.whatsapp.com",
        keywords: ["vercel", "deploy"],
    },
    {
        id: "supabase",
        title: "Supabase",
        url: "https://web.whatsapp.com",
        keywords: ["supabase", "supa", "sbase"],
    },
    {
        id: "figma",
        title: "Figma",
        url: "https://figma.com",
        keywords: ["figma", "design", "fig"],
    },
    {
        id: "maps",
        title: "Google Maps",
        url: "https://maps.google.com",
        keywords: ["maps", "gmaps", "google maps"],
    },
    {
        id: "drive",
        title: "GOogle Drive",
        url: "https://figma.com",
        keywords: ["figma", "design", "fig"],
    },
    {
        id: "claude",
        title: "Claude AI",
        url: "https://claude.ai",
        keywords: ["claude", "best ai", "clau"],
    },
    {
        id: "chatgpt",
        title: "ChatGPT",
        url: "https://chatgpt.com",
        keywords: ["chatgpt", "gpt", "jews"],
    },
    {
        id: "gemini",
        title: "Gemini: Powered by Google",
        url: "https://gemini.google.com",
        keywords: ["gemini", "veo"],
    },
    {
        id: "daisyui",
        title: "daisyUI",
        url: "https://daisyui.com/docs/install/",
        keywords: ["daisy", "daisyUI"],
    },
    {
        id: "sumopod",
        title: "Sumopod: AI Slavery",
        url: "https://sumopod.com",
        keywords: ["sumo", "sumopod", "ai tokens", "ai token"],
    },
        {
        id: "gmail",
        title: "Google Mail",
        url: "https://mail.google.com",
        keywords: ["gmail", "mail", "email", "google gmail"],
    },
        {
        id: "photos",
        title: "Google Photos",
        url: "https://photos.google.com",
        keywords: ["photo", "photos", "foto", "google foto"],
    },
        {
        id: "message",
        title: "Google Message",
        url: "https://messages.google.com",
        keywords: ["gmess", "message", "rcs"],
    },
];

export function findBookmark(query: string): Bookmark | undefined {
    const q = query.trim().toLowerCase();
    return bookmarks.find((bookmark) =>
        bookmark.keywords.some((keyword) => keyword.toLowerCase() === q),
    );
}
