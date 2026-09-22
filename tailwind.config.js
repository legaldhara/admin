// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       screens: {
//         xs: "475px", // Custom extra small breakpoint
//       },
//       appearance: ["none"],
//       boxShadow: {
//         'custom': '0px 10px 20px rgba(0, 0, 0, 0.2)', // Adjust values as needed
//       },
//       fontFamily: {
//         plex: ['IBM Plex Sans', 'sans-serif'],
//       },
//       fontSize: {
//         'display-lg': ['40px', { fontWeight: '700' }], // Bold
//         'heading-lg': ['28px', { fontWeight: '700' }], // Bold
//         'heading-md': ['25px', { fontWeight: '700' }], // Bold
//         'heading-sm': ['22px', { fontWeight: '700' }], // Bold
//         'title-lg': ['20px', { fontWeight: '500' }], // Medium
//         'title-md': ['18px', { fontWeight: '500' }], // Medium
//         'title-sm': ['16px', { fontWeight: '500' }], // Medium
//         'title-sm-bold': ['16px', { fontWeight: '600' }], // Medium
//         'body-lg': ['14px', { fontWeight: '400' }], // Regular
//         'body-sm': ['12px', { fontWeight: '400' }], // Regular
//         'body-sm-bold': ['12px', { fontWeight: '500' }], // Regular
//       },
//       colors: {
//         light: {
//           brand: {
//             primary: '#FF8E29',
//             secondary: '#27D095',
//             territory: '#67CADF',
//             gradient: '#FF8E29',
//           },
//           shade: {
//             1: '#FF8E29',
//             2: '#FF993E',
//             3: '#FFA554',
//             4: '#FFB069',
//             5: '#FFBB7F',
//             6: '#FFC794',
//           },
//           text: {
//             dark: '#050F24',
//             light: '#6F757E',
//             disable: '#CCCDCD',
//           },
//           surface: {
//             white: '#FFFFFF',
//             background: '#FFF4EA',
//             background2: '#F5F5F5',
//             border: '#E1E1E1',
//           },
//         },
//         dark: {
//           text: {
//             white: '#F3F4F7',
//             light: '#C7CAD0',
//             disable: '#6F7687',
//           },
//           surface: {
//             bg1: '#151D32',
//             bg2: '#292F45',
//             border: '#353C56',
//           },
//           loader: {
//             border: '#FF8E29'
//           }
//         },
//       },
//     },
//   },
//   plugins: [],
// }



// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class", // because you use `.dark` class
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--color-background)",
//         foreground: "var(--color-foreground)",
//         card: "var(--color-card)",
//         border: "var(--color-border)",
//         muted: "var(--color-muted)",
//         primary: "var(--color-primary)",
//         "on-primary": "var(--color-primary-foreground)",
//         accent: "var(--color-accent)",
//         "on-accent": "var(--color-accent-foreground)",
//         sidebar: "var(--color-sidebar)",
//         "sidebar-foreground": "var(--color-sidebar-foreground)",
//         "sidebar-primary": "var(--color-sidebar-primary)",
//       },
//       borderRadius: {
//         sm: "calc(var(--radius) - 4px)",
//         md: "calc(var(--radius) - 2px)",
//         lg: "var(--radius)",
//         xl: "calc(var(--radius) + 4px)",
//       },
//       fontFamily: {
//         sans: ["var(--font-urbanist)", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables .dark for dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue':"#071B34",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        primary: "var(--color-primary)",
        "on-primary": "var(--color-primary-foreground)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-accent-foreground)",
        warn: "var(--color-warn)",
        sidebar: "var(--color-sidebar)",
        "sidebar-foreground": "var(--color-sidebar-foreground)",
        "sidebar-primary": "var(--color-sidebar-primary)",
        "sidebar-primary-foreground": "var(--color-sidebar-primary-foreground)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
