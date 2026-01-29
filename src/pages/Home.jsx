import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { ChevronDown, CheckCircle, ArrowRight, ChevronRight, Cpu, FileCheck, FileText } from "lucide-react";

// Import Assets
import heroImage from "../assets/hero_dashboard.png";
import scoreBanner from "../assets/scroing_banner.png";
import featureMock from "../assets/feature_mock.png";
import featureSection from "../assets/feature_section.png";
import featureAnalytics from "../assets/feature_analytics.png";
import featureMobile from "../assets/feature_mobile.png";
import logo from "../assets/logo.png";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("Speaking");

  const tabContent = {
    Speaking: {
      title: "Master Oral Fluency",
      desc: "Demonstrate your command of spoken English. Tasks include Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture, and Answer Short Question. Focus on pronunciation and oral fluency to score high."
    },
    Writing: {
      title: "Refine Written Communication",
      desc: "Showcase your ability to organize ideas and write clearly. This section assesses you on Summarize Written Text and Write Essay, testing your grammar, vocabulary, and spelling."
    },
    Reading: {
      title: "Enhance Reading Comprehension",
      desc: "Evaluate your ability to read and understand academic texts. You will encounter Multiple Choice, Re-order Paragraphs, and Fill in the Blanks questions designed to test your reading skills."
    },
    Listening: {
      title: "Sharpen Listening Skills",
      desc: "Test your ability to understand spoken English in an academic context. Tasks range from Summarize Spoken Text to Write From Dictation, requiring strong listening and note-taking abilities."
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-white">

      {/* NAVBAR */}
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Pawan PTE Logo" className="h-10 w-10 rounded-full object-cover" />
            <div className="text-3xl font-bold text-blue-600 tracking-tighter flex items-center">
              <span className="text-blue-500 mr-1">{"<"}</span>
              Pawan PTE
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/signin?redirect=/mock-test" className="hover:text-blue-600 transition">Mock Test</Link>
            <Link to="/signin?redirect=/buy-vouchers" className="hover:text-blue-600 transition">Vouchers</Link>
            <Link to="/aboutus" className="hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/signin" className="px-5 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:border-slate-800 transition">
              Sign In
            </Link>
            <Link to="/select-product" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-200 transition">
              Free Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-20 pb-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight" data-aos="fade-up">
            Master the PTE with Free Mock Tests <br />
            <span className="text-blue-600">Instant AI Scoring</span> & <br />
            <span className="text-blue-600">Detailed Feedback</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10" data-aos="fade-up" data-aos-delay="100">
            Unlock your potential with our comprehensive mock exams. Get immediate, precise AI analysis for both PTE Academic and PTE Core to ensure you reach your target score.
          </p>

          <div className="mb-16" data-aos="fade-up" data-aos-delay="200">
            <Link to="/practice" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-200 transition transform hover:-translate-y-1">
              START FREE PRACTICE
            </Link>
          </div>

          {/* Dashboard Image */}
          <div className="relative max-w-5xl mx-auto" data-aos="zoom-in" data-aos-delay="300">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
            <img
              src={heroImage}
              alt="PTE Dashboard"
              className="rounded-xl shadow-2xl border border-slate-100 w-full"
            />

            {/* Floating Elements (Decorative) */}
            <div className="absolute -left-12 bottom-20 bg-white p-4 rounded-xl shadow-lg border border-slate-50 rotate-3 animate-bounce hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">RA</div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Read Aloud</p>
                  <p className="font-bold text-slate-800">Processing...</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 top-20 bg-blue-600 text-white p-4 rounded-xl shadow-lg -rotate-3 hidden md:block">
              <div className="text-2xl font-bold">79+</div>
              <div className="text-xs opacity-90">Target Score</div>
            </div>
          </div>
        </div>
      </header>

      {/* PURPLE BANNER (PRO EVALUATION) */}
      <section className="bg-[#4F46E5] text-white py-16 px-6 overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Experience Pro-Level Evaluation for Speaking <br />
              Guaranteed Accuracy, Mirroring the Real Exam
            </h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {["Accurate Content Scoring", "Words-per-Minute Detection", "AI-Powered Feedback"].map(feat => (
                <div key={feat} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="font-medium text-sm">{feat}</span>
                </div>
              ))}
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg shadow-lg shadow-orange-900/20 transition">
              Practice Now!
            </button>
          </div>

          <div className="relative" data-aos="fade-left">
            <img src={scoreBanner} alt="Scoring Analysis" className="rounded-xl shadow-2xl transform md:rotate-2 hover:rotate-0 transition duration-500" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / FEATURES */}
      <section className="py-24 bg-slate-50">
        <div className="text-center mb-24 max-w-3xl mx-auto" data-aos="fade-up">
          <div className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full font-bold text-sm mb-4 tracking-wide">THE PROCESS</div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Explore Our <span className="text-violet-600">Intelligent Assessment</span> System
          </h2>
          <p className="text-slate-600 text-lg">
            Gear up for PTE Academic and Core with our massive question bank. Get instant, pinpointed feedback to discover your growth areas and improve fast.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Feature 01 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-violet-200">01</div>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 relative z-10">
                AI-Scored Full-Length Mocks
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Our state-of-the-art practice platform utilizes advanced AI to ensure you are fully prepared for both PTE Academic and Core. Take complete mock tests with detailed solutions to recognize gaps in your learning and secure your goal score.
              </p>
              <Link to="/signin?redirect=/mock-test" className="text-violet-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Start Mock Test <ArrowRight size={20} />
              </Link>
            </div>
            <div data-aos="fade-left">
              <img src={featureMock} alt="Mock Test Interface" className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" />
            </div>
          </div>

          {/* Feature 02 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1" data-aos="fade-right">
              <img src={featureSection} alt="Section Tests" className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" />
            </div>
            <div className="order-1 md:order-2" data-aos="fade-left">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-violet-200">02</div>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 relative z-10">
                Master Each Section Individually
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                The PTE exam comprises four distinct modules, and mastering each is key to a high score. Our platform offers dedicated, section-specific tests for Speaking, Writing, Reading, and Listening. Deeply understand the scoring criteria and focus your efforts where they matter most.
              </p>
              <Link to="/practice" className="text-violet-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Start Sectional Practice <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-violet-200">03</div>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 relative z-10">
                Unlimited Practice by Question Type
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Deeply understand the exam pattern by tackling questions one type at a time. Zero in on your weaker areas to boost your overall performance. Our advanced AI evaluation provides actionable insights to refine your strategy and help you achieve your desired score.
              </p>
              <Link to="/practice" className="text-violet-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Start Question Practice <ArrowRight size={20} />
              </Link>
            </div>
            <div data-aos="fade-left">
              <img src={featureAnalytics} alt="Analytics Dashboard" className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" />
            </div>
          </div>

          {/* Feature 04 - Mobile App */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1" data-aos="fade-right">
              <img src={featureMobile} alt="Mobile Application" className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" />
            </div>
            <div className="order-1 md:order-2" data-aos="fade-left">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-violet-200">04</div>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 relative z-10">
                Study Anytime, Anywhere
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Break free from your desk. Our comprehensive mobile application for iOS and Android lets you access premium practice materials on the move. Download today and turn your commute into productive study time.
              </p>
              <Link to="#" className="text-violet-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Download App <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PAWAN PTE IS BEST */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            The <span className="text-blue-600">Pawan PTE</span> Advantage
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16">
            Experience a platform built to mirror the real exam environment, ensuring you are exam-ready from day one.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Instant AI Feedback", icon: <Cpu />, desc: "Leverage cutting-edge AI algorithms to receive immediate, precise scoring on your practice tests to gauge your readiness." },
              { title: "High-Yield Question Bank", icon: <FileCheck />, desc: "Practice with a curated collection of recurring exam questions, boosting your chances of encountering familiar topics on test day." },
              { title: "Expert Model Answers", icon: <FileText />, desc: "Compare your responses with high-scoring sample answers to identify gaps and refine your delivery for maximum points." }
            ].map((item, i) => (
              <div key={i} className="bg-white border text-center p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow text-center group border-t-8 border-t-blue-600" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform text-white">
                  {/* Rendering Icons directly */}
                  <div className="transform scale-150">
                    {i === 0 && <Cpu size={24} />}
                    {i === 1 && <FileCheck size={24} />}
                    {i === 2 && <FileText size={24} />}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMIC & CORE TABS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12">
            Ace the <span className="text-blue-600">PTE Academic</span> Exam
          </h2>

          <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-100 max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-200">Academic Module</button>
            </div>

            <div className="flex justify-center gap-8 mb-12 border-b border-slate-100 pb-4 font-bold text-slate-500 overflow-x-auto">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 transition-colors ${activeTab === tab
                    ? "text-slate-900 border-b-2 border-slate-900 pb-4"
                    : "hover:text-blue-600 pb-4"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-[#F8F7F4] rounded-2xl p-12 text-center transition-all duration-300">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{tabContent[activeTab].title}</h3>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {tabContent[activeTab].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCORING SYSTEM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Precision-Driven <span className="text-slate-900">AI Scoring</span>
          </h2>
          <p className="text-slate-500 mb-16">Understand your performance with our state-of-the-art evaluation engine.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { step: "1", title: "Smart Evaluation", desc: "Our intelligent algorithms rigorously assess your Speaking, Writing, Reading, and Listening skills against official standards." },
              { step: "2", title: "Constant Calibration", desc: "We continually update our scoring models to align with the latest PTE exam patterns, ensuring high-fidelity results." },
              { step: "3", title: "Rapid Feedback", desc: "Get immediate, detailed score reports for every mock test. Identify your strengths and target areas for improvement instantly." }
            ].map((item, i) => (
              <div key={i} className="bg-blue-50 p-8 rounded-2xl hover:bg-blue-100 transition-colors" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center text-3xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PREPARING (CHECKLIST) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 text-center mb-16">
            Unlock Your Potential with <span className="text-blue-600">Premium Practice</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Simulate Real Exam Conditions", desc: "Immerse yourself in a test environment that mirrors the actual PTE interface, analyzing the pressure and timing before the big day." },
              { title: "Pinpoint Performance Gaps", desc: "Our detailed analytics reveal exactly where you excel and where you need focus, transforming data into your personal study roadmap." },
              { title: "Master Time Management", desc: "Train yourself to pace through each section efficiently. Learn to allocate your precious minutes where they count the most." },
              { title: "Enhance Speed & Precision", desc: "Routine practice sharpens your reflexes. Minimize errors and boost your answering speed to confidently hit your target score." }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay={i * 50}>
                <div className="mt-1">
                  <CheckCircle className="text-blue-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mb-6">FAQs</h2>
            <p className="text-slate-500 text-lg">
              Have questions about PTE practice tests? Dive into our comprehensive FAQs to find answers to all your PTE Academic exam preparation needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "How to buy a PTE mock test online from Pawan PTE?", a: "Visit our 'Pricing' page to explore our flexible plans. You can securely pay online to unlock full-length mock tests, section-wise practice, and premium AI scoring features instantly." },
              { q: "Can I access Pawan PTE's Platform on mobile devices?", a: "Yes! The Pawan PTE platform is fully responsive on mobile browsers. Plus, our dedicated mobile app allows you to practice Speaking, Writing, Reading, and Listening anytime, anywhere." },
              { q: "Is PTE easier than IELTS?", a: "Many students find PTE easier due to its computer-based nature and objective scoring system, which removes human bias. However, both exams assess English proficiency thoroughly." },
              { q: "How accurate is Pawan PTE's scoring system?", a: "Our AI scoring system is trained on thousands of real PTE exam responses. We provide instant, highly accurate scores for Speaking (pronunciation, fluency) and Writing (grammar, vocabulary) that closely match the official Pearson scoring guide." },
              { q: "What is PTE Academic Exam?", a: "The PTE Academic is a computer-based English test accepted by educational institutions worldwide for study abroad purposes. It assesses your Speaking, Writing, Reading, and Listening skills in a single 2-hour session." },
              { q: "Are our PTE mock tests similar to the actual PTE exam?", a: "Absolutely. Our mock tests replicate the real PTE Academic interface, timer settings, and question difficulty, ensuring you get the most realistic exam experience possible before the big day." },
              { q: "How to check PTE result?", a: "After completing a test, your results are generated instantly by our AI. Go to your 'Dashboard' or 'Analytics' section to view a detailed breakdown of your performance, including communicative and enabling skills." },
              { q: "Can I practice specific PTE sections with Pawan PTE?", a: "Yes, you can practice individual modules. Our 'Section Wise Tests' allow you to focus specifically on Speaking, Writing, Reading, or Listening to improve your weak areas." }
            ].map((faq, i) => (
              <div
                key={i}
                className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 ${activeFaq === i ? 'ring-2 ring-blue-100 shadow-md' : 'hover:shadow-md'}`}
              >
                <div
                  className="flex justify-between items-start gap-4 cursor-pointer group"
                  onClick={() => toggleFaq(i)}
                >
                  <h4 className={`font-bold text-lg transition-colors ${activeFaq === i ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {faq.q}
                  </h4>
                  <ChevronDown
                    className={`text-slate-400 mt-1 flex-shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-blue-600' : ''}`}
                    size={20}
                  />
                </div>
                {/* Animated Answer */}
                <div className={`grid transition-all duration-300 ease-in-out ${activeFaq === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className="text-slate-600 text-sm leading-relaxed overflow-hidden">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Take a Mock Test Now!
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Practice with 30000+ real exam questions.
          </p>
          <Link to="/signin" className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-slate-50 hover:scale-105 transition transform">
            SIGN UP
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1e293b] text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Pawan PTE</h2>
            <p className="text-sm leading-relaxed mb-6">
              The most trusted AI-powered PTE practice platform. Join thousands of students achieving their dream scores.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">F</div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">I</div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-sky-600 transition cursor-pointer">T</div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Mock Test</a></li>
              <li><a href="#" className="hover:text-white transition">Practice</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Study Material</a></li>
              <li><a href="#" className="hover:text-white transition">PTE Score Guide</a></li>
              <li><a href="#" className="hover:text-white transition">Webinars</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>support@pawanpte.com</li>
              <li>+91 98765 43210</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-700 text-center text-sm">
          <p>© 2025 Pawan PTE. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
