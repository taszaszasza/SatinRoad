interface SatinLogoProps {
    height?: number;
    className?: string;
}

export function SatinLogo({ height = 34, className = "" }: SatinLogoProps) {
    return (
        <svg
            height={height}
            viewBox="0 0 260 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ verticalAlign: "middle", display: "inline-block", overflow: "visible" }}
        >
            <defs>
                {/* Holographic chrome gradient */}
                <linearGradient id="cyberChrome" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="28%" stopColor="#ffd4e8" />
                    <stop offset="48%" stopColor="#ff2a85" />
                    <stop offset="52%" stopColor="#800040" />
                    <stop offset="70%" stopColor="#ff5ca8" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                {/* Soft neon aura */}
                <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff69b4" />
                    <stop offset="100%" stopColor="#ff1493" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="y2kGlow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#ff1493" floodOpacity="0.45" />
                </filter>
            </defs>

            {/* --- ICON: Chrome Heart Ribbon + Cyber Star --- */}
            <g filter="url(#y2kGlow)" transform="translate(4, 2)">
                {/* Metallic Heart Frame */}
                <path
                    d="M 22 13 C 22 7, 14 3, 9 8 C 4 13, 7 21, 22 34 C 37 21, 40 13, 35 8 C 30 3, 22 7, 22 13 Z"
                    fill="url(#cyberChrome)"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                />

                {/* Inner Heart Cutout accent */}
                <path
                    d="M 22 17 C 22 13, 17 10, 13 13 C 9 17, 12 22, 22 30 C 32 22, 35 17, 31 13 C 27 10, 22 13, 22 17 Z"
                    fill="url(#neonPink)"
                    opacity="0.85"
                />

                {/* Cyber Sparkle Top-Right */}
                <path
                    d="M 37 4 Q 37 9, 42 9 Q 37 9, 37 14 Q 37 9, 32 9 Q 37 9, 37 4 Z"
                    fill="#ffffff"
                />

                {/* Tiny Sparkle Bottom-Left */}
                <path
                    d="M 6 26 Q 6 29, 9 29 Q 6 29, 6 32 Q 6 29, 3 29 Q 6 29, 6 26 Z"
                    fill="#ffb3d9"
                />
            </g>

            {/* --- TYPOGRAPHY: Satin Road --- */}
            <g filter="url(#y2kGlow)">
                {/* Subtle drop outline for high-contrast legibility */}
                <text
                    x="52"
                    y="29"
                    fontFamily="'Space Grotesk', -apple-system, sans-serif"
                    fontWeight="900"
                    fontSize="22"
                    letterSpacing="0.04em"
                    fill="none"
                    stroke="#ffeaf2"
                    strokeWidth="3"
                    strokeLinejoin="round"
                >
                    SATIN ROAD
                </text>

                {/* Main liquid-chrome face */}
                <text
                    x="52"
                    y="29"
                    fontFamily="'Space Grotesk', -apple-system, sans-serif"
                    fontWeight="900"
                    fontSize="22"
                    letterSpacing="0.04em"
                    fill="url(#cyberChrome)"
                >
                    SATIN ROAD
                </text>

                {/* Mini 4-point sparkle at the end */}
                <path
                    d="M 194 14 Q 194 18, 198 18 Q 194 18, 194 22 Q 194 18, 190 18 Q 194 18, 194 14 Z"
                    fill="#ff1493"
                />
            </g>
        </svg>
    );
}