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
        id: "google",
        title: "Google",
        url: "https://www.google.com",
        keywords: ["google"],
    },
    {
        id: "reddit",
        title: "Reddit",
        url: "https://www.reddit.com",
        keywords: ["reddit"],
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
        keywords: ["supabase", "sbase"],
    },
        {
        id: "figma",
        title: "Figma",
        url: "https://figma.com",
        keywords: ["figma", "design"],
    },
];

export function findBookmark(query: string): Bookmark | undefined {
    const q = query.trim().toLowerCase();
    return bookmarks.find((bookmark) =>
        bookmark.keywords.some((keyword) => keyword.toLowerCase() === q),
    );
}
