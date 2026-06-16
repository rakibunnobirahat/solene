import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Treatments from '../components/Treatments';
import BlogSection from '../components/BlogSection';
import Testimonials from '../components/Testimonials';
import BookingCTA from '../components/BookingCTA';
import Footer from '../components/Footer';

const Homepage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <About />
                <Treatments />
                <BlogSection />
                <Testimonials />
                <BookingCTA />
            </main>
            <Footer />
        </div>
    )
}

export default Homepage;
