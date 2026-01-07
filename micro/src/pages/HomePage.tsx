import './Home.css';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { Problem } from '../components/home/Problem';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { Audience } from '../components/home/Audience';
import { Pricing } from '../components/home/Pricing';
import { Testimonials } from '../components/home/Testimonials';
import { InteractiveDemo } from '../components/home/InteractiveDemo';
import { FAQ } from '../components/home/FAQ';
import { FinalCTA } from '../components/home/FinalCTA';
import { Footer } from '../components/home/Footer';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <Navbar />
      </div>
      <div className="pt-20"> {/* Offset for fixed navbar */}
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <InteractiveDemo />
        <Audience />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
