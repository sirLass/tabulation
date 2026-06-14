import Navbar from "./viewer/landing-page/navbar";
import HeroSection from "./viewer/landing-page/hero-section";
import About from "./viewer/landing-page/about";
import Testimonials from "./viewer/landing-page/testimonials";
import Footer from "./viewer/landing-page/footer";
import SubscriptionPlan from "./viewer/landing-page/subscription-plan";
import Events from "./viewer/landing-page/events";


export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <About />
      <Events />
      <SubscriptionPlan />
      <Testimonials />
      <Footer />
    </div>
  );
}
