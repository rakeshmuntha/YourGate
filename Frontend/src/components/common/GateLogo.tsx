const GateLogo = ({ size = 40, dark = false }: { size?: number; dark?: boolean }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
    >
        <rect
            width="24"
            height="24"
            rx="6"
            fill={dark ? "#FFFFFF" : "#141414"}
        />
        <path
            d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"
            stroke={dark ? "#141414" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2 20h20"
            stroke={dark ? "#141414" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <circle
            cx="10"
            cy="12"
            r="1"
            fill={dark ? "#141414" : "white"}
        />
    </svg>
);

export default GateLogo;
