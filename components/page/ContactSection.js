"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import BlurText from "@/components/ui/BlurText";
import {NeonSpotlightCard} from "@/components/ui/NeonSpotlightCard";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactSection() {
  const words = [
    { text: "Awaiting", className: "text-white font-lora" },
    { text: "  ", className: "text-white font-lora" }, // space
    { text: "next", className: "text-white font-lora" },
    { text: " ", className: "text-white font-lora" },
    { text: "collaboration", className: "text-white font-lora" },
    { text: ".", className: "text-white font-lora" },
    { text: ".", className: "text-white font-lora" },
    { text: ".", className: "text-white font-lora" },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [serverState, setServerState] = useState(null);

  const onSubmit = async (data) => {
    setServerState(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setServerState({ ok: true });
        reset();
      } else {
        setServerState({ ok: false });
      }
    } catch {
      setServerState({ ok: false });
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <BlurText
                  text="Get in Touch"
                  delay={110}
                  animateBy="chars"
                  direction="top"
                  className="cursor-pointer font-lora text-4xl md:text-5xl lg:text-6xl font-bold  mb-4 flex justify-center text-blue-100"
                />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <NeonSpotlightCard
            borderSize={4}
            borderRadius={24}
            neonColors={{
              firstColor: "#8B5CF6", 
              secondColor: "#3B0764",
            }}
            spotlight={{
              radius: 350,
              maskColor: "#000000",
              canvasColors: [
                [139, 92, 246], 
                [59, 7, 100],   
                [168, 85, 247], 
                [236, 72, 153], 
              ],
              dotSize: 2,
            }}
            contentBg="rgba(6,6,20,0.95)"
            className="w-full"
          >
            <div className="p-8 md:p-12"> 
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
                autoComplete="off"
              >
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="text-purple-300 text-sm font-mono tracking-wide">
                      Name
                    </label>
                    <input
                      id="name"
                      {...register("name")}
                      placeholder="Enter your name"
                      className="w-full rounded-lg px-4 py-3 bg-black/60 border border-purple-700/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white transition-all duration-300 placeholder:text-purple-300/60 font-mono backdrop-blur-sm"
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-pink-400 font-mono"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="email" className="text-cyan-300 text-sm font-mono tracking-wide">
                      Email
                    </label>
                    <input
                      id="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      className="w-full rounded-lg px-4 py-3 bg-black/60 border border-cyan-700/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white transition-all duration-300 placeholder:text-cyan-300/60 font-mono backdrop-blur-sm"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-pink-400 font-mono"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="subject" className="text-pink-300 text-sm font-mono tracking-wide">
                    Subject
                  </label>
                  <input
                    id="subject"
                    {...register("subject")}
                    placeholder="What's this about?"
                    className="w-full rounded-lg px-4 py-3 bg-black/60 border border-pink-700/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white transition-all duration-300 placeholder:text-pink-300/60 font-mono backdrop-blur-sm"
                  />
                  {errors.subject && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-pink-400 font-mono"
                    >
                      {errors.subject.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <label htmlFor="message" className="text-purple-300 text-sm font-mono tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    placeholder="Tell me about your project or idea..."
                    rows={6}
                    className="w-full rounded-lg px-4 py-3 bg-black/60 border border-purple-800/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white transition-all duration-300 resize-none placeholder:text-purple-200/60 font-mono backdrop-blur-sm"
                  />
                  {errors.message && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-pink-400 font-mono"
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center mt-4"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="cursor-pointer bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all duration-300 hover:from-purple-900 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wide text-lg max-w-xs w-full md:max-w-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Transmitting...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </motion.div>

                {isSubmitSuccessful && serverState?.ok && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-center text-sm font-mono bg-green-400/10 border border-green-400/30 rounded-lg p-3"
                  >
                    ✅ Message transmitted successfully! I&apos;ll respond soon 🚀
                  </motion.div>
                )}
                {serverState && !serverState.ok && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-pink-400 text-center text-sm font-mono bg-pink-400/10 border border-pink-400/30 rounded-lg p-3"
                  >
                    ❌ Transmission failed. Please try again or contact me directly.
                  </motion.div>
                )}
              </form>
            </div>
          </NeonSpotlightCard>
        </motion.div>
      </div>

      <footer className="w-full bg-[#0a0a0a] border-t border-t-purple-700/50 py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col text-sm text-gray-400 font-mono order-2 md:order-1"
          >
            <div className="flex items-center">
              <span className="text-cyan-400 mr-2">&gt;</span>

              <div className="w-64 md:w-80 overflow-hidden">
                <TypewriterEffect 
                  words={words} 
                  className="text-white font-lora font-light italic text-lg whitespace-nowrap" 
                  cursorClassName="bg-cyan-400"
                />
              </div>
            </div>
          </motion.div>


          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-6 justify-center order-1 md:order-2"
          >
            <motion.a
              whileHover={{ 
                scale: 1.15, 
                filter: "drop-shadow(0 0 12px #a855f7)"
              }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/Nikhil-Yadav15"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-3 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/5 backdrop-blur-sm"
            >
              <FaGithub size={24} />
            </motion.a>
            <motion.a
              whileHover={{ 
                scale: 1.15, 
                filter: "drop-shadow(0 0 12px #a855f7)"
              }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/nikhil-yadav-593a98321"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-3 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/5 backdrop-blur-sm"
            >
              <FaLinkedin size={24} />
            </motion.a>
            <motion.a
              whileHover={{ 
                scale: 1.15, 
                filter: "drop-shadow(0 0 12px #22d3ee)"
              }}
              whileTap={{ scale: 0.95 }}
              href="https://discord.com/users/codeslinger24"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-3 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/5 backdrop-blur-sm"
            >
              <FaDiscord size={24} />
            </motion.a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="text-1xl italic  text-white text-center md:text-right font-lora order-3"
          >
            © Nikhil Yadav
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
