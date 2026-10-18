import { hueFor, initialsFor } from "../format.js";
import "./Avatar.css";

// initials circle, purely decorative since the username is always shown next to it
function Avatar({ username, size = "md" }) {
    const style = username ? { "--avatar-hue": hueFor(username) } : undefined;
    return (
        <span className={`avatar avatar-${size}`} style={style} aria-hidden="true">
            {initialsFor(username)}
        </span>
    );
}

export default Avatar;
