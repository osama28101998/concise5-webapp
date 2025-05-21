export async function generateMetadata({ params, searchParams }) {
  const title = "Concise-5 | Settings ";
  const description = "Configure your Concise-5 settings and preferences";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://yourdomain.com/settings",
      siteName: "Concise-5",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function SettingsLayout({ children }) {
  return (
    <div className="settings-container">
      {children}
    </div>
  );
}