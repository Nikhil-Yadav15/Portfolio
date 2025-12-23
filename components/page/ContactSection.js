"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";

// --- Utility for cleaner classes ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Zod Schema ---
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// --- Component: Background Stars with Shooting Effect ---
const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let stars = [];
    let shootingStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      // Reduce star count on mobile for performance
      const starCount = window.innerWidth < 768 ? 80 : 150;
      stars = Array.from({ length: starCount }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.2,
      }));
    };

    const createShootingStar = () => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * (canvas.height / 2);
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 15 + 10,
        angle: Math.PI / 4,
        opacity: 1,
        life: 1,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Static Stars
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      // Draw Shooting Stars
      shootingStars.forEach((star, index) => {
        star.x += star.speed * Math.cos(star.angle);
        star.y += star.speed * Math.sin(star.angle);
        star.life -= 0.02;

        const tailX = star.x - star.length * Math.cos(star.angle);
        const tailY = star.y - star.length * Math.sin(star.angle);

        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(168, 85, 247, ${star.life})`);
        gradient.addColorStop(1, `rgba(168, 85, 247, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (star.life <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      if (Math.random() < 0.02) createShootingStar();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-40"
    />
  );
};

// --- Component: Premium Input Field ---
const InputGroup = ({ label, id, error, children }) => {
  return (
    <div className="space-y-2 relative">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-[0.2em] text-white uppercase ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        {children}
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 group-focus-within:w-full" />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 top-0 flex items-center gap-1 text-rose-400 text-xs"
          >
            <AlertCircle size={12} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Component: Classy Button ---
const ShinyButton = ({ children, disabled, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      className={cn(
        "relative group px-8 py-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg overflow-hidden transition-all duration-300 border border-white/10 shadow-lg hover:shadow-purple-500/20",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
        {children}
      </span>
    </motion.button>
  );
};

// --- Main Component ---
export default function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [serverState, setServerState] = useState(null);

  // Typewriter words configuration
  const words = [
    { text: "Let's ", className: "text-white font-lora font-bold" },
    { text: "build ", className: "text-white font-lora font-bold" },
    { text: "the ", className: "text-white font-lora font-bold" },
    { text: "impossible. ", className: "text-purple-400 font-lora font-bold" },
  ];

  const onSubmit = async (data) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setServerState({ ok: true });
    reset();
    setTimeout(() => setServerState(null), 5000);
  };

  const inputClasses =
    "w-full bg-slate-950/30 border border-white/5 rounded-lg px-4 py-3.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:bg-slate-900/50 transition-all duration-300 hover:border-white/10";

  return (
    // Changed min-h-screen to min-h-[100dvh] for mobile browsers
    <section data-lenis-prevent className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black/10 selection:bg-purple-500/30">
      
      {/* 1. Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030014] to-[#030014] z-0" />
      <StarBackground />
      
      {/* 2. Content Wrapper */}
      {/* Using 'flex-col' for mobile (default) and 'lg:flex-row' for desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 min-h-[100dvh]">
        
        {/* Left Side: Text & Info */}
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-medium tracking-wider uppercase mb-6">
              <Sparkles size={14} />
              <span>Open for Work</span>
            </div>
            
            {/* Typewriter Effect Integration */}
            <div className="mb-6 h-20 md:h-32 flex items-center justify-center lg:justify-start">
               <TypewriterEffect words={words} className="text-4xl md:text-6xl lg:text-7xl !leading-tight" cursorClassName="bg-purple-400" />
            </div>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Have a vision that needs engineering? I specialize in turning complex problems into elegant, scalable solutions.
            </p>
          </motion.div>

          {/* Socials - Desktop Only */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:flex flex-row gap-6 items-center justify-start pt-2"
          >
             {/* Socials - Clean Minimalist */}
             {[
               { icon: FaGithub, href: "https://github.com/Nikhil-Yadav15" },
               { icon: FaLinkedin, href: "https://www.linkedin.com/in/nikhil-yadav-593a98321" },
               { icon: FaDiscord, href: "https://discord.com/users/codeslinger24" }
             ].map((social, idx) => (
               <a
                 key={idx}
                 href={social.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 border border-white/5 transition-all duration-300 text-slate-300 hover:text-white"
               >
                 <social.icon size={22} />
               </a>
             ))}
          </motion.div>
        </div>

        {/* Right Side: High-End Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 pb-12 lg:pb-0"
        >
          <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent">
            {/* Backdrop Blur Container */}
            <div className="relative rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-2xl p-6 md:p-10 border border-white/5 shadow-2xl shadow-purple-500/10">
              
              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <InputGroup label="Name" id="name" error={errors.name}>
                    <input
                      {...register("name")}
                      id="name"
                      className={inputClasses}
                      placeholder="John Doe"
                    />
                  </InputGroup>
                  <InputGroup label="Email" id="email" error={errors.email}>
                    <input
                      {...register("email")}
                      id="email"
                      className={inputClasses}
                      placeholder="john@example.com"
                    />
                  </InputGroup>
                </div>

                <InputGroup label="Subject" id="subject" error={errors.subject}>
                  <input
                    {...register("subject")}
                    id="subject"
                    className={inputClasses}
                    placeholder="Project Inquiry"
                  />
                </InputGroup>

                <InputGroup label="Message" id="message" error={errors.message}>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={4}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell me about your project..."
                  />
                </InputGroup>

                <div className="pt-2 md:pt-4">
                    <ShinyButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-lora"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message <Send size={16} />
                        </>
                      )}
                    </ShinyButton>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitSuccessful && serverState?.ok && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 text-sm overflow-hidden"
                    >
                      <CheckCircle2 size={18} className="shrink-0" />
                      <p>Message sent successfully! I will get back to you soon.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
          
          {/* Socials - Mobile Only (Below Form) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex lg:hidden flex-row gap-6 items-center justify-center pt-6"
          >
             {[
               { icon: FaGithub, href: "https://github.com/Nikhil-Yadav15" },
               { icon: FaLinkedin, href: "https://www.linkedin.com/in/nikhil-yadav-593a98321" },
               { icon: FaDiscord, href: "https://discord.com/users/codeslinger24" }
             ].map((social, idx) => (
               <a
                 key={idx}
                 href={social.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 border border-white/5 transition-all duration-300 text-slate-300 hover:text-white"
               >
                 <social.icon size={22} />
               </a>
             ))}
          </motion.div>
        </motion.div>
      </div>



    </section>
  );
}