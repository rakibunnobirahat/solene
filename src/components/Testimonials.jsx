import { useState } from 'react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        treatment: 'Signature Facial',
        review: 'The most relaxing experience I\'ve had in years. My skin has never looked so glowing and healthy. The staff is incredibly knowledgeable and kind.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Emily Chen',
        treatment: 'Dermal Fillers',
        review: 'I was nervous about injectables, but the team at Solène made me feel completely at ease. The results are so natural and exactly what I wanted.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Jessica Torres',
        treatment: 'Laser Treatment',
        review: 'Professional, pristine environment and amazing results. I highly recommend their laser treatments. The whole process was virtually painless.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => setActiveIndex((p) => (p === 0 ? testimonials.length - 1 : p - 1));
    const handleNext = () => setActiveIndex((p) => (p === testimonials.length - 1 ? 0 : p + 1));

    return (
        <section className="py-20 md:py-28 bg-bg-cream relative overflow-hidden" id="testimonials">
            {/* Decorative accent blob */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-accent/8 rounded-l-[80px]"></div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-14">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-text-dark mb-3 leading-snug">
                        Proof in Every
                        <br />
                        <span className="italic font-light text-primary">Transformation</span>
                    </h2>
                    <p className="text-text-muted text-sm md:text-base font-light leading-relaxed">
                        Our clients are the true reflection of our dedication to excellence. Hear what they say about their experience at Solène.
                    </p>
                </div>

                {/* Content: images left, review right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Image carousel — stacked cards */}
                    <div className="relative h-[380px] md:h-[440px] flex items-center justify-center">
                        {testimonials.map((t, idx) => {
                            const offset = idx - activeIndex;
                            const isActive = offset === 0;

                            let style;
                            const className = 'absolute rounded-2xl overflow-hidden shadow-xl transition-all duration-600 ease-out';

                            if (isActive) {
                                style = { width: '260px', height: '340px', zIndex: 20, opacity: 1, transform: 'translateX(0) scale(1)' };
                            } else if (
                                offset === 1 || (offset === -(testimonials.length - 1))
                            ) {
                                style = { width: '220px', height: '300px', zIndex: 10, opacity: 0.5, transform: 'translateX(80px) scale(0.92)' };
                            } else if (
                                offset === -1 || (offset === testimonials.length - 1)
                            ) {
                                style = { width: '220px', height: '300px', zIndex: 10, opacity: 0.5, transform: 'translateX(-80px) scale(0.92)' };
                            } else {
                                style = { width: '200px', height: '280px', zIndex: 5, opacity: 0, transform: 'translateX(0) scale(0.85)' };
                            }

                            return (
                                <div key={t.id} className={className} style={style}>
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        loading={isActive ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Review content */}
                    <div>
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-5">
                            {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="font-serif italic text-text-dark text-xl md:text-2xl font-light leading-relaxed mb-6">
                            "{testimonials[activeIndex].review}"
                        </blockquote>

                        {/* Author */}
                        <div className="mb-8">
                            <h4 className="font-serif font-semibold text-text-dark text-base">
                                {testimonials[activeIndex].name}
                            </h4>
                            <p className="text-sm text-text-muted">{testimonials[activeIndex].treatment}</p>
                        </div>

                        {/* Nav arrows */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrev}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-text-dark hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-text-dark hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="text-xs text-text-muted ml-1">
                                {activeIndex + 1} / {testimonials.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
