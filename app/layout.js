import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/analytics";

const inter = Inter({ subsets: ["latin"] });
const APP_NAME = "WWTMEME";
const APP_DEFAULT_TITLE = "What was that MEME?";
const APP_TITLE_TEMPLATE = "What was that MEME?";
const APP_DESCRIPTION = "Discover, and share your favorite memes with WWTMEME – your go-to meme finder app";

export const viewport = {
  themeColor: "#69A2B0",
};

export const metadata = {
  applicationName: APP_NAME,
  appleMobileWebAppCapable: "yes",
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startUpImage: [
      /* array of splash screen images */
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  description: APP_DESCRIPTION,
  url: "https://whatwasthatmeme.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> : null}
        {children}
      </body>
    </html>
  );
}
