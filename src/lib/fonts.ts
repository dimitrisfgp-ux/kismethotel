import { Montserrat, Inter } from "next/font/google";

export const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500"],
    display: "swap",
});
