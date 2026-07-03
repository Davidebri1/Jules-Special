export const theme = {
  colors: {
    background: '#0A0A0A',
    surface: '#131313',
    surfaceBright: '#393939',
    surfaceVariant: '#353534',
    surfaceContainerLow: '#1c1b1b',
    primary: '#6366f1', // Electric Violet / Indigo
    onPrimary: '#FFFFFF',
    text: '#E5E2E1',
    textMuted: '#C7C4D7',
    border: '#FFFFFF10', // 10% white for subtle borders
    cardGlow: 'rgba(99, 102, 241, 0.1)', // primary colored glow
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 64,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 24,
    full: 9999,
  },
  typography: {
    // We would ideally load fonts, but will use defaults for the prototype.
    // 'Geist' is a sans-serif, we'll map to system fonts for now.
    header: {
      fontSize: 32,
      fontWeight: '600' as const,
      color: '#E5E2E1',
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#E5E2E1',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#E5E2E1',
      lineHeight: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: '#C7C4D7',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#C7C4D7',
    }
  }
};
