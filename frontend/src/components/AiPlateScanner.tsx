import AiSparkleIcon from "./AiSparkleIcon";

interface AiPlateScannerProps {
  busy: boolean;
}

export default function AiPlateScanner({ busy }: AiPlateScannerProps) {
  if (!busy) {
    return (
      <div className="plate plate-idle-wrapper" aria-hidden="true">
        <svg
          className="plate-idle-svg"
          width="82"
          height="82"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="32" cy="32" r="27" strokeWidth="1.8" />
          <circle cx="32" cy="32" r="19" strokeWidth="1.2" opacity="0.4" />
          <path
            d="M32 23v18M23 32h18"
            strokeWidth="1.2"
            opacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="m46 16 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="plate plate-busy-wrapper ai-plate-scanner-wrapper"
      aria-hidden="true"
    >
      <div className="ai-plate-scanner">
        {/* Outer rotating conic-gradient ring */}
        <div className="scanner-outer-ring" />
        {/* Expanding concentric radar wave */}
        <div className="scanner-radar-pulse" />
        <div className="scanner-radar-pulse pulse-delay" />
        {/* Orbiting AI Sparkle nodes */}
        <div className="scanner-orbit-dot dot-1" />
        <div className="scanner-orbit-dot dot-2" />
        <div className="scanner-orbit-dot dot-3" />
        {/* Central Scanner Plate & Reticle */}
        <div className="scanner-center-plate">
          <svg
            className="scanner-plate-svg"
            width="76"
            height="76"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            <circle
              cx="32"
              cy="32"
              r="20"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Center AI Lens Sparkle */}
            <path
              d="M32 18 L34.5 28 L44.5 30.5 L34.5 33 L32 43 L29.5 33 L19.5 30.5 L29.5 28 Z"
              fill="currentColor"
              opacity="0.9"
            />
            {/* Corner reticle marks */}
            <path
              d="M16 22h-4v-4M48 22h4v-4M16 42h-4v4M48 42h4v4"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.6"
              strokeLinecap="round"
            />
          </svg>
          {/* Vertical Laser Scanner Beam */}
          <div className="scanner-beam-line" />
        </div>
      </div>
      <div className="ai-scan-stage-badge">
        <span className="scanner-live-dot" />
        <span className="scanner-badge-text">
          <AiSparkleIcon />
          <span>AI Vision Pipeline Active</span>
        </span>
      </div>
    </div>
  );
}
