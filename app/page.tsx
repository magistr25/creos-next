// app/page.tsx
import { Metadata } from 'next';
import Home from "@/app/home/page.tsx";

export const metadata: Metadata = {
    title: 'Creos Next',
   };

export default function HomePage() {
    return (
   <Home />
    );
}
