import React from 'react';

const features = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Personalized Care',
        description: 'Every treatment is tailored to your unique skin type, goals, and lifestyle.',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        title: 'Science & Expertise',
        description: 'Certified by professionals using safe, proven techniques and cutting-edge technology.',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Holistic Wellness',
        description: 'We focus on enhancing natural beauty while promoting long-term skin health.',
    },
];

const About = () => {
    return (
        <section className="py-12 md:py-20 bg-white relative overflow-hidden" id="about">
            {/* Decorative bg blob */}
            <div className="absolute top-0 right-0 w-100 h-100 bg-accent/6 rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-350 mx-auto px-6 lg:px-12 relative z-10">

                {/* Top row: heading left + image right */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 mb-14">
                    {/* Left — heading + paragraph */}
                    <div className="flex-1 max-w-xl">
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] font-thin text-text-dark leading-snug mb-5">
                            Embrace Your Inner Peace
                            <br />
                            and <span className="italic font-light text-primary">Discover</span> True Beauty
                            <br />
                            at Solène
                        </h2>
                        <p className="text-text-muted text-sm md:text-[15px] font-light leading-relaxed max-w-md">
                            At Solène, we believe beauty grows from calm. Each treatment is thoughtfully designed to relax your mind and care for your body with gentle attention.
                        </p>
                    </div>

                    {/* Right — round interior image */}
                    <div className="shrink-0 w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-lg self-start lg:mt-2">
                        <img
                            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop"
                            alt="Spa facial treatment"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Bottom row: 3 feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded-2xl px-6 py-7 bg-bg-cream shadow-sm border border-primary/10"
                        >
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary-hover mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-text-dark mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-text-muted font-light leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
