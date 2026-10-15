// small display helpers shared by the post components

export const EXCERPT_LIMIT = 200;

// "samual" -> "SA", "sam.banfield" -> "SB"
export function initialsFor(username = "") {
    const parts = username.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

// stable hue (0-359) per username so each user keeps the same avatar colour
export function hueFor(username = "") {
    let hash = 0;
    for (const ch of username) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    return Math.abs(hash) % 360;
}

// ISO timestamp -> "Just now", "12 min ago", "2 h ago", "3 d ago" or a date
export function timeAgo(createdAt) {
    if (!createdAt) return "";
    const then = new Date(createdAt);
    if (Number.isNaN(then.getTime())) return "";

    const minutes = Math.floor((Date.now() - then.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d ago`;
    return then.toLocaleDateString();
}

// paragraphs are separated by blank lines
export function paragraphsOf(content = "") {
    return content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}

// cut long content at a word boundary for the feed card
export function excerptOf(content = "") {
    const flat = paragraphsOf(content).join(" ");
    const isLong = flat.length > EXCERPT_LIMIT || paragraphsOf(content).length > 1;
    if (flat.length <= EXCERPT_LIMIT) return { excerpt: flat, isLong };
    const cut = flat.slice(0, EXCERPT_LIMIT).replace(/\s+\S*$/, "");
    return { excerpt: `${cut}…`, isLong };
}
