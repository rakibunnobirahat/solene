import React from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
    {
        id: 1,
        title: 'Exquisite Skincare Rituals You Need to Know',
        excerpt: 'Discover the daily rituals that top dermatologists recommend for radiant, glowing skin all year round.',
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop',
        date: 'Jun 5, 2026',
        category: 'Skincare',
    },
    {
        id: 2,
        title: 'How to Maintain Healthy, Glowing Skin',
        excerpt: 'Learn the science-backed strategies for maintaining a youthful complexion through proper nutrition and care.',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop',
        date: 'May 28, 2026',
        category: 'Wellness',
    },
    {
        id: 3,
        title: 'The Secrets to Long-lasting Vitality',
        excerpt: 'Explore holistic approaches to wellness that combine beauty treatments with lifestyle changes for lasting results.',
        image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=600&auto=format&fit=crop',
        date: 'May 20, 2026',
        category: 'Lifestyle',
    },
];

const BlogSection = () => {
    return (
        <section className="py-12 md:py-20 bg-white" id="blog">
            <div className="max-w-350 mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-14">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-text-dark mb-3 leading-snug">
                        Beauty Insights &
                        <br />
                        <span className="italic font-light text-primary">Wellness Tips</span>
                    </h2>
                    <p className="text-text-muted text-sm md:text-base font-light leading-relaxed">
                        Stay updated with the latest in aesthetic science, skincare routines, beauty insights, and wellness advice from our expert team.
                    </p>
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-2xl aspect-4/3 mb-4">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[11px] font-medium text-primary rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{post.date}</span>
                                <h3 className="font-serif text-lg font-semibold text-text-dark group-hover:text-primary transition-colors leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-text-muted text-sm font-light leading-relaxed line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <Link to="#" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-hover transition-colors group/link pt-1">
                                    Read More
                                    <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
