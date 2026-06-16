import { Link } from 'react-router-dom';
import heroImg from '../assets/images/hero-home-image.jpg';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen overflow-hidden flex items-center">
            {/* Background: cream gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-bg-cream via-[#f2f5ea] to-[#e8ecd8]"></div>

            {/* Grid overlay — visible olive lines matching reference */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(74,99,82,0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(74,99,82,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}
            ></div>

            <div className="relative z-10 max-w-350 mx-auto px-6 lg:px-12 pt-28 pb-16 md:pt-32 md:pb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-6 w-full">

                {/* Left Content */}
                <div className="flex-1 flex flex-col items-start w-full max-w-xl lg:max-w-135">
                    <h1 className="font-serif text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] font-normal leading-[1.05] text-text-dark mb-5">
                        Where <span className="italic font-light text-primary">Beauty</span>
                        <br className="hidden md:block" />
                        Meets Wellness
                    </h1>

                    <p className="text-text-muted text-base md:text-lg max-w-md mb-8 leading-relaxed font-light">
                        A space designed to help you feel your best, inside and out. Experience our restorative treatments.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <Link
                            to="/booking"
                            className="group px-7 py-3 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2"
                        >
                            Book Appointment
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/treatments"
                            className="px-7 py-3 bg-white text-text-dark border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Our Services
                        </Link>
                    </div>

                    {/* Social proof row */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2.5">
                            <div className="w-9 h-9 rounded-full border-2 border-bg-cream overflow-hidden">
                                <img src="https://i.pravatar.cc/100?img=1" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-9 h-9 rounded-full border-2 border-bg-cream overflow-hidden">
                                <img src="https://i.pravatar.cc/100?img=5" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-9 h-9 rounded-full border-2 border-bg-cream overflow-hidden">
                                <img src="https://i.pravatar.cc/100?img=9" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-9 h-9 rounded-full border-2 border-bg-cream bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-text-dark">
                                +1k
                            </div>
                        </div>
                        <div className="text-xs leading-tight">
                            <p className="font-semibold text-text-dark">Join 1,000+ Happy</p>
                            <p className="text-text-muted">Customers today.</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 w-full flex justify-center lg:justify-end relative">
                    <div className="relative w-full max-w-115 h-130 md:h-150 rounded-t-full rounded-b-[36px] overflow-hidden shadow-2xl">
                        <img
                            src={heroImg}
                            alt="Wellness Treatment"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover object-center"
                        />

                        {/* Facial mapping SVG overlay */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" fill="none" style={{ opacity: 0.55 }}>
                            {/* Center vertical line */}
                            <path d="M200 100 Q175 220 200 340 Q225 460 200 530" stroke="#C7D8B5" strokeWidth="1.2" fill="none" strokeDasharray="5 4" />
                            {/* Left cheek line */}
                            <path d="M130 140 Q170 260 130 400" stroke="#C7D8B5" strokeWidth="1.2" fill="none" strokeDasharray="5 4" />
                            {/* Right cheek line */}
                            <path d="M270 140 Q230 260 270 400" stroke="#C7D8B5" strokeWidth="1.2" fill="none" strokeDasharray="5 4" />
                            {/* Forehead arc */}
                            <path d="M140 160 Q200 110 260 160" stroke="#C7D8B5" strokeWidth="1.2" fill="none" strokeDasharray="5 4" />
                            {/* Jaw arc */}
                            <path d="M140 380 Q200 440 260 380" stroke="#C7D8B5" strokeWidth="1.2" fill="none" strokeDasharray="5 4" />
                            {/* Marker dots */}
                            <circle cx="200" cy="160" r="3.5" fill="#C7D8B5" />
                            <circle cx="155" cy="215" r="3.5" fill="#C7D8B5" />
                            <circle cx="245" cy="215" r="3.5" fill="#C7D8B5" />
                            <circle cx="200" cy="280" r="3.5" fill="#C7D8B5" />
                            <circle cx="170" cy="330" r="3.5" fill="#C7D8B5" />
                            <circle cx="230" cy="330" r="3.5" fill="#C7D8B5" />
                            <circle cx="200" cy="380" r="3.5" fill="#C7D8B5" />
                        </svg>

                        {/* Floating pill labels */}
                        <div className="absolute top-[20%] right-4 bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-medium text-text-dark shadow-md">
                            Facial Mapping
                        </div>
                        <div className="absolute bottom-[32%] right-6 bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-medium text-text-dark shadow-md">
                            Skin Analysis
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
