import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Headphones, PenTool, Layout } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "20,000+ Vocabulary Words",
        subtitle: "Start Your Vocabulary Journey With Our Vocab Book",
        description: "Unlock the power of words with our Vocab Book — designed to make learning easy, fun, and effective for your PTE success!",
        ctaText: "Start Learning !",
        icon: <BookOpen size={48} className="text-white" />,
        stats: [
            { label: "Vocabulary Words", value: "20,000+" },
            { label: "Listening Sets", value: "12,000+" }
        ],
        tags: ["Reading Vocab", "Listening Vocab", "Learn Curiously"]
    },
    {
        id: 2,
        title: "Master Your Speaking Skills",
        subtitle: "Practice with Real Exam Questions",
        description: "Get instant AI scoring and detailed feedback on your pronunciation and fluency. Boost your confidence today!",
        ctaText: "Practice Now",
        icon: <Headphones size={48} className="text-white" />,
        stats: [
            { label: "Practice Questions", value: "5,000+" },
            { label: "AI Evaluations", value: "Unlimited" }
        ],
        tags: ["Oral Fluency", "Pronunciation", "Instant Feedback"]
    },
    {
        id: 3,
        title: "Ace the Writing Section",
        subtitle: "Essay & Summary Writing Tips",
        description: "Learn structure, grammar, and vocabulary strategies to maximize your writing score. Templates included!",
        ctaText: "View Templates",
        icon: <PenTool size={48} className="text-white" />,
        stats: [
            { label: "Essay Templates", value: "15+" },
            { label: "Sample Answers", value: "100+" }
        ],
        tags: ["Essay Structure", "Grammar Tips", "High Scoring"]
    }
];

const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[currentSlide];

    return (
        <div className="w-full mt-6 mb-6">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl min-h-[220px] flex flex-col justify-center">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
                <div className="absolute top-10 right-40 text-yellow-300 opacity-80 animate-bounce">🔥</div>
                <div className="absolute bottom-10 right-[20%] text-yellow-300 opacity-80 animate-pulse">🤩</div>


                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full px-4">

                    {/* Left Content - Visual/Image Area (50%) */}
                    <div className="flex-1 w-full flex justify-center md:justify-start items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-32 bg-white/20 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                                <div className="p-3 bg-white/20 rounded-full mb-2">
                                    {slide.icon}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 bg-white text-purple-600 rounded-full">Play & Learn</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-3xl font-bold mb-0 leading-tight">{slide.stats[0].value}</h2>
                                    <p className="text-purple-200 text-xs">{slide.stats[0].label}</p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-0 leading-tight">{slide.stats[1].value}</h2>
                                    <p className="text-purple-200 text-xs">{slide.stats[1].label}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Text Area (50%) */}
                    <div className="flex-1 w-full text-center md:text-left space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{slide.subtitle}</h2>
                        <p className="text-purple-100 text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
                            {slide.description}
                        </p>
                        <div className="pt-2">
                            <button className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto md:mx-0 text-sm">
                                {slide.ctaText}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerSlider;
