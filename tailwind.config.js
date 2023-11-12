/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      "my-white": "#F7F7F2",
      "my-beige": "#E4E6C3",
      "my-green": "#899878",
      "my-eerie": "#222725",
      "my-black": "#121113",
      "my-apricot": "#FFCAB1",
      "my-moonstone": "#69A2B0",
      "my-asparagus": "#659157",
      "my-olivine": "#A1C084",
      "my-indianred": "#E05263",
      "my-selectiveyellow": "#FFB400",
      "my-tangelo": "#F6511D",
      "my-berkeleyblue": "#0D2C54",
      "my-vanilla": "#F0DFAD",
      "my-moonstoneshade": "#5F9BAB",
      "my-darkslategray": "#38616B",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
