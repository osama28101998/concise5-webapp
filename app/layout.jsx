// "use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/redux/providers";
import ProtectedRoute from "@/components/ProtectedRoute";
// import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import AppLayout from "./appLayout";
import VoiceAssistant from "@/components/voice-assistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Concise-5 webapp",
//   description: "Concise-5 description",
// };

export async function generateMetadata({ params, searchParams }) {
 
   const title = searchParams?.topic ? `Topic: ${searchParams.topic}` : "Concise-5 ";
  const description = "Concise-5 is your ultimate productivity tool.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://yourdomain.com",
      siteName: "Concise-5",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          <ProtectedRoute>
            
            <AppLayout>
              {children}
              {/* <VoiceAssistant /> */}
            </AppLayout>
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
