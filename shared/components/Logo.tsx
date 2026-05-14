import { useMemo } from "react";

interface LogoProps {
  variant?: "full" | "compact" | "icon";
  theme?: "light" | "dark";
  language?: "en" | "ar";
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function Logo({
  variant = "compact",
  theme = "light",
  language = "en",
  className = "",
  title = "Price",
  subtitle = "Insights",
  badge = "DUBAI",
}: LogoProps) {
  const logoSrc = useMemo(() => {
    const iconColor = theme === "dark" ? "#22D3EE" : "#0891B2";
    const trendColor = theme === "dark" ? "#34D399" : "#10B981";
    const titleColor = theme === "dark" ? "#F1F5F9" : "#0F172A";
    const subtitleColor = theme === "dark" ? "#94A3B8" : "#475569";
    const badgeColor = theme === "dark" ? "#22D3EE" : "#0891B2";

    if (variant === "icon") {
      const svg = `<svg width="48" height="48" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="${theme === "dark" ? "#1e293b" : "#F8FAFC"}" stroke="${theme === "dark" ? "#334155" : "#E2E8F0"}" stroke-width="1"/>
        <g transform="translate(15, 12)">
          <path d="M22 52 L22 28 L24 16 L26 8 L28 16 L30 28 L30 52" fill="${iconColor}" opacity="0.9"/>
          <path d="M16 52 L16 38 L22 34 L30 38 L36 38 L36 52" fill="${iconColor}" opacity="0.7"/>
          <path d="M12 52 L12 45 L16 42 L36 42 L40 45 L40 52" fill="${iconColor}" opacity="0.5"/>
          <path d="M5 48 Q15 44 22 36 Q30 28 38 22 Q44 17 50 14" stroke="${trendColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="36" r="2.5" fill="${trendColor}"/>
          <circle cx="38" cy="22" r="2.5" fill="${trendColor}"/>
          <circle cx="50" cy="14" r="3" fill="${trendColor}"/>
          <path d="M50 14 L50 6 M46 10 L50 6 L54 10" stroke="${trendColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    if (variant === "compact") {
      const svg = `<svg width="200" height="50" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(5, 5)">
          <path d="M16 38 L16 18 L18 10 L20 5 L22 10 L24 18 L24 38" fill="${iconColor}" opacity="0.9"/>
          <path d="M12 38 L12 28 L16 25 L24 28 L28 28 L28 38" fill="${iconColor}" opacity="0.6"/>
          <path d="M4 34 Q12 30 18 24 Q24 18 32 14 Q36 12 40 10" stroke="${trendColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="40" cy="10" r="2.5" fill="${trendColor}"/>
          <path d="M40 10 L40 4 M37 7 L40 4 L43 7" stroke="${trendColor}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <text x="55" y="28" font-family="Inter, -apple-system, sans-serif" font-size="16" font-weight="600" fill="${titleColor}">${title}</text>
        <text x="${55 + title.length * 9.5}" y="28" font-family="Inter, -apple-system, sans-serif" font-size="16" font-weight="400" fill="${subtitleColor}">${subtitle}</text>
        <text x="55" y="42" font-family="Inter, -apple-system, sans-serif" font-size="9" font-weight="500" fill="${badgeColor}" letter-spacing="2">${badge}</text>
      </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    const svg = `<svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 10)">
        <path d="M30 75 L30 35 L32 20 L34 10 L36 20 L38 35 L38 75" fill="${iconColor}" opacity="0.9"/>
        <path d="M24 75 L24 50 L30 45 L38 50 L44 50 L44 75" fill="${iconColor}" opacity="0.7"/>
        <path d="M20 75 L20 60 L24 55 L44 55 L48 60 L48 75" fill="${iconColor}" opacity="0.5"/>
        <path d="M8 65 Q20 60 28 50 Q36 40 48 30 Q56 22 68 18" stroke="${trendColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="28" cy="50" r="3" fill="${trendColor}"/>
        <circle cx="48" cy="30" r="3" fill="${trendColor}"/>
        <circle cx="68" cy="18" r="4" fill="${trendColor}"/>
        <path d="M68 18 L68 8 M63 13 L68 8 L73 13" stroke="${trendColor}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="95" y="48" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="600" fill="${titleColor}">${title}</text>
      <text x="${95 + title.length * 16}" y="48" font-family="Inter, -apple-system, sans-serif" font-size="28" font-weight="400" fill="${subtitleColor}">${subtitle}</text>
      <text x="95" y="70" font-family="Inter, -apple-system, sans-serif" font-size="14" font-weight="500" fill="${badgeColor}" letter-spacing="3">${badge}</text>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [variant, theme, language, title, subtitle, badge]);

  const dimensions = useMemo(() => {
    if (variant === "icon") return { width: 48, height: 48 };
    if (variant === "compact") return { width: 200, height: 50 };
    return { width: 400, height: 100 };
  }, [variant]);

  return (
    <img
      src={logoSrc}
      alt={`${title} ${subtitle}`}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      style={{ display: "block" }}
    />
  );
}
