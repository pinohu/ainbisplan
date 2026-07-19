export const primitiveTokens = {
  color: {
    neutral: {
      0: "#ffffff",
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617"
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      300: "#93c5fd",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      900: "#1e3a8a"
    },
    green: {
      50: "#f0fdf4",
      500: "#22c55e",
      700: "#15803d",
      900: "#14532d"
    },
    amber: {
      50: "#fffbeb",
      500: "#f59e0b",
      700: "#b45309",
      900: "#78350f"
    },
    red: {
      50: "#fef2f2",
      500: "#ef4444",
      700: "#b91c1c",
      900: "#7f1d1d"
    }
  },
  space: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem"
  },
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    pill: "9999px"
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  },
  lineHeight: {
    tight: "1.2",
    snug: "1.35",
    normal: "1.5",
    relaxed: "1.65"
  },
  duration: {
    instant: "0ms",
    fast: "120ms",
    normal: "200ms",
    slow: "320ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.2, 0.8, 0.2, 1)"
  },
  measure: {
    narrow: "45rem",
    reading: "68ch",
    wide: "80rem",
    full: "96rem"
  }
} as const;

export const semanticTokens = {
  light: {
    surface: primitiveTokens.color.neutral[0],
    surfaceSubtle: primitiveTokens.color.neutral[50],
    surfaceRaised: primitiveTokens.color.neutral[0],
    text: primitiveTokens.color.neutral[900],
    textMuted: primitiveTokens.color.neutral[600],
    border: primitiveTokens.color.neutral[300],
    borderStrong: primitiveTokens.color.neutral[500],
    interactive: primitiveTokens.color.blue[700],
    interactiveHover: primitiveTokens.color.blue[900],
    focus: primitiveTokens.color.blue[500],
    successSurface: primitiveTokens.color.green[50],
    successText: primitiveTokens.color.green[900],
    warningSurface: primitiveTokens.color.amber[50],
    warningText: primitiveTokens.color.amber[900],
    dangerSurface: primitiveTokens.color.red[50],
    dangerText: primitiveTokens.color.red[900],
    infoSurface: primitiveTokens.color.blue[50],
    infoText: primitiveTokens.color.blue[900]
  },
  dark: {
    surface: primitiveTokens.color.neutral[950],
    surfaceSubtle: primitiveTokens.color.neutral[900],
    surfaceRaised: primitiveTokens.color.neutral[800],
    text: primitiveTokens.color.neutral[50],
    textMuted: primitiveTokens.color.neutral[300],
    border: primitiveTokens.color.neutral[700],
    borderStrong: primitiveTokens.color.neutral[500],
    interactive: primitiveTokens.color.blue[300],
    interactiveHover: primitiveTokens.color.blue[100],
    focus: primitiveTokens.color.blue[300],
    successSurface: primitiveTokens.color.green[900],
    successText: primitiveTokens.color.green[50],
    warningSurface: primitiveTokens.color.amber[900],
    warningText: primitiveTokens.color.amber[50],
    dangerSurface: primitiveTokens.color.red[900],
    dangerText: primitiveTokens.color.red[50],
    infoSurface: primitiveTokens.color.blue[900],
    infoText: primitiveTokens.color.blue[50]
  }
} as const;

export type PrimitiveTokens = typeof primitiveTokens;
export type SemanticTokens = typeof semanticTokens;
export type ColorMode = keyof SemanticTokens;
