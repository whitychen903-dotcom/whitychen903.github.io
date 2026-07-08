// J-Pop Hub 品牌色系统
// 参考 Apple 官网设计风格，使用下方五色为主色调

export const colors = {
  // 主色调
  primary: "#6F8436",        // Khaki Green
  primaryDark: "#38460C",    // Hinterlands Green
  secondary: "#ABAB64",      // Organic Garden
  accent: "#EDBC13",         // Gold Ore
  accentLight: "#E5D89E",    // Crystal Yellow

  // 中性色（Apple 风格灰阶）
  neutral: {
    50: "#F5F5F7",
    100: "#E8E8ED",
    200: "#D2D2D7",
    300: "#AEAEB2",
    400: "#86868B",
    500: "#6E6E73",
    600: "#515154",
    700: "#3A3A3C",
    800: "#1D1D1F",
    900: "#000000",
  },
} as const;
