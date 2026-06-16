import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const treatmentCategories = [
    {
        id: 'facials',
        title: 'Facial Treatments',
        description: 'Rejuvenate and restore your natural glow with our customized facial therapies.',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
        services: [
            { name: 'Signature Hydrafacial', duration: '60 min', price: '$199' },
            { name: 'Customized Chemical Peels', duration: '45 min', price: '$150' },
            { name: 'Microneedling Therapy', duration: '90 min', price: '$350' },
            { name: 'Dermaplaning', duration: '45 min', price: '$125' },
        ]
    },
    {
        id: 'injectables',
        title: 'Injectables',
        description: 'Smooth fine lines and restore youthful volume with our expertly administered injectables.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        services: [
            { name: 'Neuromodulators (Botox/Dysport)', duration: '30 min', price: 'from $12/unit' },
            { name: 'Dermal Fillers', duration: '60 min', price: 'from $650' },
            { name: 'Lip Enhancement', duration: '45 min', price: 'from $600' },
            { name: 'Kybella', duration: '45 min', price: 'from $1200' },
        ]
    },
    {
        id: 'body',
        title: 'Body Contouring',
        description: 'Achieve your aesthetic goals with non-invasive body sculpting and skin tightening.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
        services: [
            { name: 'CoolSculpting', duration: '60+ min', price: 'Consultation Required' },
            { name: 'Emsculpt NEO', duration: '30 min', price: 'Consultation Required' },
            { name: 'Laser Hair Removal', duration: 'Varies', price: 'from $150/session' },
            { name: 'Skin Tightening', duration: '60 min', price: 'from $400' },
        ]
    },
    {
        id: 'wellness',
        title: 'Wellness & IV Therapy',
        description: 'Boost your energy and immunity with our signature wellness infusions from within.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
        services: [
            { name: 'Myers Cocktail IV', duration: '45 min', price: '$180' },
            { name: 'Glow & Hydrate IV', duration: '45 min', price: '$195' },
            { name: 'Immunity Boost IV', duration: '45 min', price: '$185' },
            { name: 'Vitamin B12 Injection', duration: '15 min', price: '$40' },
        ]
    }
];

const TreatmentsPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-bg-cream">
            <Navbar />

            <main className="flex-1 pt-24">
                {/* Hero Section */}
                <section className="relative py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2000&auto=format&fit=crop"
                            alt="Spa Treatments"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover object-center opacity-20"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-bg-cream/80 to-bg-cream z-10"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
                        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">Our Services</span>
                        <h1 className="font-serif text-5xl md:text-7xl font-semibold text-text-dark mb-6">
                            Exceptional Care,<br /> <span className="italic font-light text-primary">Beautiful Results</span>
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-light mb-10">
                            Explore our comprehensive menu of premium aesthetic treatments designed to enhance your natural beauty and boost your confidence.
                        </p>
                    </div>
                </section>

                {/* Treatment Categories */}
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        {treatmentCategories.map((category, index) => (
                            <div key={category.id} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-20 items-center mb-24 last:mb-0`}>
                                <div className="w-full md:w-1/2">
                                    <div className="relative aspect-4/5 md:aspect-square overflow-hidden rounded-2xl">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h2 className="font-serif text-4xl text-text-dark mb-4">{category.title}</h2>
                                    <p className="text-text-muted text-lg mb-8 font-light">{category.description}</p>

                                    <div className="space-y-6">
                                        {category.services.map((service, idx) => (
                                            <div key={idx} className="flex justify-between items-baseline border-b border-gray-200 pb-4">
                                                <div>
                                                    <h4 className="text-text-dark font-medium text-lg">{service.name}</h4>
                                                    <span className="text-text-muted text-sm">{service.duration}</span>
                                                </div>
                                                <span className="text-primary font-medium">{service.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10">
                                        <Link to="/contact" className="inline-block px-8 py-3.5 bg-primary text-white hover:bg-primary-hover rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
                                            Book Consultation
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-white text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">Not sure where to start?</h2>
                        <p className="text-white/80 text-lg mb-10 font-light max-w-2xl mx-auto">
                            Schedule a complimentary consultation with one of our aesthetic experts to create a customized treatment plan tailored to your unique goals.
                        </p>
                        <Link to="/contact" className="inline-block px-10 py-4 bg-white text-primary hover:bg-bg-cream rounded-full font-medium transition-colors shadow-lg">
                            Request an Appointment
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TreatmentsPage;
