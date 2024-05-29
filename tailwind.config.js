/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add font merriweather to the font-family
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#59c26d",
        primaryDarkmode: "#72e888",
        primaryText: "#3d3b3b",
        primaryText2: "#505050",
        primaryTextDark: "#b5b2b2",
        primaryTextDark2: "#f5f5f5",
        primaryBold: "#618264",
        primaryLight: "#B0D9B1",
        primaryLighter: "#D0E7D2",
        primaryHoverOn: "#74ff8f",
        // Normal Text 
        textNormal: "#3D3B3B",
        textNormalDark: "#e9e5e5",
        // Heading Text
        headingText: "#2E3271",
        headingTextDark: "#e9e5e5",
        // NavBar Text 
        textNavbar: "#2E327180",
        textNavbarNormal: "#fffafa",
        textNavbarHover: "#6aca72",
        textNavbarDark: "#e9e5e5",
        // Icon Text
        iconText: "#505050",
        iconTextDark: "#e9e5e5",
        iconTextHover: "#6aca72",
        iconTextHoverDark: "#72e888",
        iconTextActive: "#59c26d",
        iconTextActiveDark: "#72e888",
        iconBackground: "#f5f5f5",
        iconBackgroundDark: "#2d3748",
        // Background Playlist
        backgroundPlaylist: "#fcfcfc",
        backgroundPlaylistHover: "#f1f1f1",
        backgroundPlaylistDark: "#2e3747",
        backgroundPlaylistHoverDark: "#4a5568",
        // Background color
        backgroundPrimary: "#ecf2fd",
        backgroundDarkPrimary: "#1a202c",
        backgroundModalPrimary: "#ffffff",
        backgroundComponentPrimary: "#FFFFFFCC",
        backgroundComponentDarkPrimary: "#2d3748",
        backgroundMusicControl: "#f5f5f5",
        backgroundDarkMusicControl: "#2d3748",
        backgroundChat: "#e8e8e8",
        // Background Song Item
        backgroundSongItem: "#f5f5f5",
        backgroundSongItemHover: "#e8e8e8",
        backgroundSongItemDark: "#2b313f",
        backgroundSongItemHoverDark: "#4a5568",

        // Background Chatting page
        backgroundChatting: "#f5f5f5",
        backgroundChattingDark: "#3a3b3c",
        backgroundChattingHover: "#e8e8e8",
        backgroundChattingHoverDark: "#4a5568",
        backgroundConverChosen: "#3a3b3c",
        backgroundConverChosenHover: "#2e2f30",
        backgroundConverChosenDark: "#2d3748",
        backgroundConverChosenHoverDark: "#4a5568",
        backgroundChattingInputNav: "#eeeeee",
        backgroundChattingInputNavDark: "#252a34",
        backgroundChattingInput: "#f5f5f5",
        backgroundChattingInputDark: "#46546d",
        backgroundChattingHeader: "#eeeeee",
        backgroundChattingHeaderDark: "#252a34",
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
