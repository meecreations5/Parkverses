import FirebaseAnalyticsProvider from "@/components/FirebaseAnalyticsProvider";
import "./globals.css";

export const metadata = {
  title: "ParkVerses Vendor Onboarding",
  description: "Vendor onboarding application for ParkVerses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseAnalyticsProvider />
        {children}
      </body>
    </html>
  );
}