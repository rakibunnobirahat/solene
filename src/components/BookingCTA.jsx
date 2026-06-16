import { Link } from 'react-router-dom';

const BookingCTA = () => {
    return (
        <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-87.5 h-87.5 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-62.5 h-62.5 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>

            <div className="max-w-350 mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                    {/* Left content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-white mb-5 leading-snug">
                            Book an <span className="italic font-light">Appointment</span>
                        </h2>
                        <p className="text-white/75 text-sm md:text-base font-light leading-relaxed max-w-md mb-7">
                            Ready to begin your transformation? Schedule a complimentary consultation with one of our aesthetic experts and discover the best treatments for you.
                        </p>
                        <Link
                            to="/booking"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary hover:bg-bg-cream rounded-full text-sm font-semibold transition-all shadow-lg cursor-pointer hover:shadow-xl group"
                        >
                            Schedule Consultation
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Right side — images + brand name (matching reference) */}
                    <div className="flex-1 flex items-center justify-center lg:justify-end gap-5">
                        {/* Two staggered treatment images */}
                        <div className="flex gap-4 items-end">
                            <div className="w-40 md:w-48 rounded-2xl overflow-hidden shadow-xl aspect-3/4">
                                <img
                                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop"
                                    alt="Spa Treatment"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-40 md:w-48 rounded-2xl overflow-hidden shadow-xl aspect-3/4 translate-y-6">
                                <img
                                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop"
                                    alt="Facial Treatment"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Brand name — vertical on far right like reference */}
                        <div className="hidden lg:flex flex-col items-center justify-center">
                            <img src="./src/assets/logo/logoiconwhite.svg" alt="Solène" className="w-10 h-10 mb-3 opacity-80" />
                            <span className="font-serif text-white text-4xl font-bold tracking-wide" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                Solène
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BookingCTA;
