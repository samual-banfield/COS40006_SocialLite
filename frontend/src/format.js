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

// "just now", "5m ago", "3h ago", "2d ago", then a date once it's over a week old
export function timeAgo(date) {
    const then = new Date(date);
    if (Number.isNaN(then.getTime())) return "";
    const seconds = Math.max(0, Math.floor((Date.now() - then.getTime()) / 1000));
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: then.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
    });
}
