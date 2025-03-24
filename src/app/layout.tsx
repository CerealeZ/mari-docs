import { DynamicProvider } from "@/components/ui/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mari Docs",
  description: "Watch your Bruno collection in a nice way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DynamicProvider>{children}</DynamicProvider>
      </body>
    </html>
  );
}
