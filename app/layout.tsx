import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["cyrillic", "latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["cyrillic", "latin"], variable: "--font-inter" });
const cormorant = Cormorant({ subsets: ["cyrillic", "latin"], style: ["italic"], weight: ["400", "500"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "Юлия Горбель — парикмахер-модельер",
  description: "Парикмахер-модельер, стаж более 20 лет. Стрижки любой сложности, сложные окрашивания, кератин, завивка, праздничные прически. Запись: пр. Ленина, 127а, офис 221.",
};
export const viewport: Viewport = { themeColor: "#0B0B0D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
