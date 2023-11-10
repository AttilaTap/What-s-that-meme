import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/analytics";

const inter = Inter({ subsets: ["latin"] });
const APP_NAME = "WWTMeme?";
const APP_DEFAULT_TITLE = "What was that MEME?";
const APP_TITLE_TEMPLATE = "Attila's - What was that MEME?";
const APP_DESCRIPTION = "A meme finder app";

export const viewport = {
  themeColor: "#FFFFFF",
};

export const metadata = {
  applicationName: APP_NAME,
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
    // startUpImage: [],
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
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
