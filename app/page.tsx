import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Transformation from "@/components/Transformation";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Booking from "@/components/Booking";
import Signature from "@/components/Signature";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Header />
      <Hero />
      <Services />
      <Transformation />
      <Gallery />
      <About />
      <Booking />
      <Signature />
    </main>
  );
}
