// // components/MainContent.js
// import { useRef, useEffect } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// export default function MainContent() {
//   const contentRef = useRef(null)

//   useEffect(() => {
//     console.log('🎯 Setting up MainContent independent ScrollTrigger');
    
//     // ✅ Wait a bit to ensure DOM is ready and main ScrollTrigger is cleaned up
//     const setupTimeout = setTimeout(() => {
//       // ✅ Create a completely fresh ScrollTrigger context
//       const ctx = gsap.context(() => {
//         // ✅ Reset any existing transforms
//         gsap.set('.main-content-container', {
//           transform: 'none',
//           position: 'relative'
//         });
        
//         // Hero section entrance
//         gsap.fromTo('.hero-content', 
//           {
//             opacity: 0,
//             y: 100,
//             scale: 0.9
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 1.5,
//             ease: "power3.out"
//           }
//         );

//         // Project cards with scroll trigger
//         gsap.fromTo('.project-card', 
//           {
//             opacity: 0,
//             y: 80,
//             rotateX: 15
//           },
//           {
//             opacity: 1,
//             y: 0,
//             rotateX: 0,
//             duration: 1.2,
//             ease: "power2.out",
//             stagger: 0.2,
//             scrollTrigger: {
//               trigger: '.projects-grid',
//               start: 'top 80%',
//               end: 'bottom 20%',
//               toggleActions: 'play none none reverse',
//               markers: false // ✅ Remove markers for production
//             }
//           }
//         );

//         // Parallax effect
//         gsap.to('.parallax-bg', {
//           yPercent: -30,
//           ease: "none",
//           scrollTrigger: {
//             trigger: contentRef.current,
//             start: "top bottom",
//             end: "bottom top",
//             scrub: 1
//           }
//         });

//         // Skills animation
//         gsap.fromTo('.skill-item', 
//           {
//             opacity: 0,
//             scale: 0.8,
//             y: 30
//           },
//           {
//             opacity: 1,
//             scale: 1,
//             y: 0,
//             duration: 0.8,
//             ease: "back.out(1.7)",
//             stagger: 0.1,
//             scrollTrigger: {
//               trigger: '.skills-section',
//               start: 'top 70%',
//               toggleActions: 'play none none reverse'
//             }
//           }
//         );

//       }, contentRef);

//       return () => {
//         console.log('🧹 Cleaning up MainContent ScrollTriggers');
//         ctx.revert();
//       };
      
//     }, 200); // ✅ Small delay to ensure clean setup

//     return () => clearTimeout(setupTimeout);
//   }, []);

//   return (
//     <div ref={contentRef} className="main-content-container min-h-screen bg-black relative overflow-x-hidden">
//       {/* Parallax Background */}
//       <div className="parallax-bg absolute inset-0 opacity-20">
//         <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30" />
//       </div>

//       {/* Hero Section */}
//       <section className="hero-content relative z-10 min-h-screen flex items-center justify-center text-center text-white p-8">
//         <div>
//           <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
//             Welcome Back to
//             <br />
//             <span className="text-blue-300">Reality</span>
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
//             You've successfully traversed through dimensions and emerged in my portfolio universe. 
//             Explore the projects and experiences I've crafted.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105">
//               View Projects
//             </button>
//             <button className="px-8 py-4 border border-purple-400 hover:bg-purple-400/20 rounded-lg text-white font-semibold transition-all duration-300">
//               Contact Me
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section className="projects-section relative z-10 py-20 px-8">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-16">
//             Interdimensional <span className="text-purple-300">Projects</span>
//           </h2>
          
//           <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               { icon: "🚀", title: "Cosmic Engine", desc: "A revolutionary 3D rendering engine that powers interdimensional experiences.", color: "blue" },
//               { icon: "⚡", title: "Quantum Interface", desc: "AI-powered interface that adapts to user behavior across different realities.", color: "purple" },
//               { icon: "🌌", title: "Reality Bridge", desc: "Connect and synchronize data across parallel universes seamlessly.", color: "pink" },
//               { icon: "🔮", title: "Temporal Analytics", desc: "Advanced analytics platform processing data across multiple timelines.", color: "green" },
//               { icon: "🎭", title: "Multiverse UI", desc: "Dynamic user interface library adapting to different reality states.", color: "yellow" },
//               { icon: "🛸", title: "Space Navigator", desc: "Navigate through infinite dimensional spaces with wormhole travel.", color: "cyan" }
//             ].map((project, index) => (
//               <div key={index} className={`project-card p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 hover:border-${project.color}-400 transition-all duration-300 cursor-pointer`}>
//                 <div className={`w-12 h-12 bg-${project.color}-500 rounded-lg mb-6 flex items-center justify-center`}>
//                   <span className="text-2xl">{project.icon}</span>
//                 </div>
//                 <h3 className={`text-2xl font-bold mb-4 text-${project.color}-300`}>{project.title}</h3>
//                 <p className="text-gray-300 leading-relaxed">{project.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section className="skills-section relative z-10 py-20 px-8 bg-gray-900/30">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
//             Interdimensional <span className="text-blue-300">Skills</span>
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               'React/Next.js', 'Three.js/WebGL', 'GSAP Animation', 'Node.js',
//               'TypeScript', 'WebGL Shaders', 'AI/ML', 'Cloud Computing',
//               'Quantum Physics', 'Space-Time API', 'Reality Distortion', 'Dimensional Travel'
//             ].map((skill, index) => (
//               <div
//                 key={skill}
//                 className="skill-item p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-blue-400 transition-all duration-300"
//               >
//                 <span className="text-white font-medium">{skill}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="contact-section relative z-10 py-20 px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
//             Contact Across <span className="text-purple-300">Dimensions</span>
//           </h2>
//           <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
//             Ready to embark on another interdimensional journey? Let's create something extraordinary together.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//             <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
//               📧 Send Transmission
//             </button>
//             <button className="px-8 py-4 border border-blue-400 hover:bg-blue-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🔗 LinkedIn Portal
//             </button>
//             <button className="px-8 py-4 border border-green-400 hover:bg-green-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🌌 GitHub Universe
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


// !
// components/MainContent.js
// components/MainContent.js
// import { useRef, useEffect } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// export default function MainContent() {
//   const contentRef = useRef(null)

//   useEffect(() => {
//     console.log('🎯 Setting up MainContent ScrollTriggers with proper isolation');
    
//     // ✅ Create completely isolated ScrollTrigger context
//     const ctx = gsap.context(() => {
//       // Ensure we start from top
//       window.scrollTo(0, 0);
      
//       // Hero section entrance
//       gsap.fromTo('.hero-content', 
//         { opacity: 0, y: 100, scale: 0.9 },
//         { 
//           opacity: 1, 
//           y: 0, 
//           scale: 1, 
//           duration: 1.5, 
//           ease: "power3.out" 
//         }
//       );

//       // Project cards with ScrollTrigger
//       gsap.fromTo('.project-card', 
//         { opacity: 0, y: 80, rotateX: 15 },
//         {
//           opacity: 1,
//           y: 0,
//           rotateX: 0,
//           duration: 1.2,
//           ease: "power2.out",
//           stagger: 0.2,
//           scrollTrigger: {
//             trigger: '.projects-grid',
//             start: 'top 80%',
//             end: 'bottom 20%',
//             toggleActions: 'play none none reverse',
//             // ✅ KEY: Specific scroller and isolation
//             scroller: window,
//             invalidateOnRefresh: false,
//             refreshPriority: 1 // Higher priority than parent
//           }
//         }
//       );

//       // Skills animation
//       gsap.fromTo('.skill-item', 
//         { opacity: 0, scale: 0.8, y: 30 },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.8,
//           ease: "back.out(1.7)",
//           stagger: 0.1,
//           scrollTrigger: {
//             trigger: '.skills-section',
//             start: 'top 70%',
//             toggleActions: 'play none none reverse',
//             scroller: window,
//             refreshPriority: 1
//           }
//         }
//       );

//       // Parallax effect
//       gsap.to('.parallax-bg', {
//         yPercent: -30,
//         ease: "none",
//         scrollTrigger: {
//           trigger: contentRef.current,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: 1,
//           scroller: window,
//           refreshPriority: 1
//         }
//       });

//     }, contentRef); // ✅ Scoped to MainContent only

//     return () => {
//       console.log('🧹 Cleaning up MainContent ScrollTriggers');
//       ctx.revert(); // This only kills MainContent ScrollTriggers
//     };
//   }, []);

//   return (
//     <div 
//       ref={contentRef} 
//       className="main-content-container w-full min-h-screen relative"
//       style={{
//         position: 'relative',
//         top: 0,
//         left: 0,
//         transform: 'none',
//         zIndex: 100 // ✅ Higher z-index to ensure dominance
//       }}
//     >
//       {/* ✅ Add invisible scroll anchor at top */}
//       <div 
//         id="main-content-top" 
//         style={{ 
//           position: 'absolute', 
//           top: 0, 
//           left: 0, 
//           width: '1px', 
//           height: '1px' 
//         }} 
//       />
      
//       {/* Your existing MainContent sections */}
      
//       {/* Parallax Background */}
//       <div className="parallax-bg absolute inset-0 opacity-20">
//         <div className="w-full h-full" />
//       </div>

//       {/* Hero Section */}
//       <section className="hero-content relative z-10 min-h-screen flex items-center justify-center text-center text-white p-8">
//         <div>
//           <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
//             Welcome Back to
//             <br />
//             <span className="text-blue-300">Reality</span>
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
//             You've successfully traversed through dimensions and emerged in my portfolio universe. 
//             Explore the projects and experiences I've crafted.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105">
//               View Projects
//             </button>
//             <button className="px-8 py-4 border border-purple-400 hover:bg-purple-400/20 rounded-lg text-white font-semibold transition-all duration-300">
//               Contact Me
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section className="projects-section relative z-10 py-20 px-8">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-16">
//             Interdimensional <span className="text-purple-300">Projects</span>
//           </h2>
          
//           <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               { icon: "🚀", title: "Cosmic Engine", desc: "A revolutionary 3D rendering engine that powers interdimensional experiences.", color: "blue" },
//               { icon: "⚡", title: "Quantum Interface", desc: "AI-powered interface that adapts to user behavior across different realities.", color: "purple" },
//               { icon: "🌌", title: "Reality Bridge", desc: "Connect and synchronize data across parallel universes seamlessly.", color: "pink" },
//               { icon: "🔮", title: "Temporal Analytics", desc: "Advanced analytics platform processing data across multiple timelines.", color: "green" },
//               { icon: "🎭", title: "Multiverse UI", desc: "Dynamic user interface library adapting to different reality states.", color: "yellow" },
//               { icon: "🛸", title: "Space Navigator", desc: "Navigate through infinite dimensional spaces with wormhole travel.", color: "cyan" }
//             ].map((project, index) => (
//               <div key={index} className={`project-card p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer hover:border-blue-400`}>
//                 <div className={`w-12 h-12 bg-blue-500 rounded-lg mb-6 flex items-center justify-center`}>
//                   <span className="text-2xl">{project.icon}</span>
//                 </div>
//                 <h3 className={`text-2xl font-bold mb-4 text-blue-300`}>{project.title}</h3>
//                 <p className="text-gray-300 leading-relaxed">{project.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section className="skills-section relative z-10 py-20 px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
//             Interdimensional <span className="text-blue-300">Skills</span>
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               'React/Next.js', 'Three.js/WebGL', 'GSAP Animation', 'Node.js',
//               'TypeScript', 'WebGL Shaders', 'AI/ML', 'Cloud Computing',
//               'Quantum Physics', 'Space-Time API', 'Reality Distortion', 'Dimensional Travel'
//             ].map((skill, index) => (
//               <div
//                 key={skill}
//                 className="skill-item p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-blue-400 transition-all duration-300"
//               >
//                 <span className="text-white font-medium">{skill}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="contact-section relative z-10 py-20 px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
//             Contact Across <span className="text-purple-300">Dimensions</span>
//           </h2>
//           <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
//             Ready to embark on another interdimensional journey? Let's create something extraordinary together.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//             <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
//               📧 Send Transmission
//             </button>
//             <button className="px-8 py-4 border border-blue-400 hover:bg-blue-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🔗 LinkedIn Portal
//             </button>
//             <button className="px-8 py-4 border border-green-400 hover:bg-green-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🌌 GitHub Universe
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// !New with same background

// import { useRef, useEffect } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// export default function MainContent() {
//   const contentRef = useRef(null)

//   useEffect(() => {
//     console.log('🎯 Setting up MainContent ScrollTriggers with proper isolation');
    
//     // ✅ Create completely isolated ScrollTrigger context
//     const ctx = gsap.context(() => {
//       // Ensure we start from top
//       window.scrollTo(0, 0);
      
//       // Hero section entrance
//       gsap.fromTo('.hero-content', 
//         { opacity: 0, y: 100, scale: 0.9 },
//         { 
//           opacity: 1, 
//           y: 0, 
//           scale: 1, 
//           duration: 1.5, 
//           ease: "power3.out" 
//         }
//       );

//       // Project cards with ScrollTrigger
//       gsap.fromTo('.project-card', 
//         { opacity: 0, y: 80, rotateX: 15 },
//         {
//           opacity: 1,
//           y: 0,
//           rotateX: 0,
//           duration: 1.2,
//           ease: "power2.out",
//           stagger: 0.2,
//           scrollTrigger: {
//             trigger: '.projects-grid',
//             start: 'top 80%',
//             end: 'bottom 20%',
//             toggleActions: 'play none none reverse',
//             // ✅ KEY: Specific scroller and isolation
//             scroller: window,
//             invalidateOnRefresh: false,
//             refreshPriority: 1 // Higher priority than parent
//           }
//         }
//       );

//       // Skills animation
//       gsap.fromTo('.skill-item', 
//         { opacity: 0, scale: 0.8, y: 30 },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.8,
//           ease: "back.out(1.7)",
//           stagger: 0.1,
//           scrollTrigger: {
//             trigger: '.skills-section',
//             start: 'top 70%',
//             toggleActions: 'play none none reverse',
//             scroller: window,
//             refreshPriority: 1
//           }
//         }
//       );

//       // Subtle parallax effect for background elements
//       gsap.to('.background-orb', {
//         yPercent: -20,
//         ease: "none",
//         scrollTrigger: {
//           trigger: contentRef.current,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: 1,
//           scroller: window,
//           refreshPriority: 1
//         }
//       });

//     }, contentRef); // ✅ Scoped to MainContent only

//     return () => {
//       console.log('🧹 Cleaning up MainContent ScrollTriggers');
//       ctx.revert(); // This only kills MainContent ScrollTriggers
//     };
//   }, []);

//   return (
//     <div 
//       ref={contentRef} 
//       className="main-content-container w-full min-h-screen relative overflow-hidden"
//       style={{
//         position: 'relative',
//         top: 0,
//         left: 0,
//         transform: 'none',
//         zIndex: 100
//       }}
//     >
//       {/* ✅ Add invisible scroll anchor at top */}
//       <div 
//         id="main-content-top" 
//         style={{ 
//           position: 'absolute', 
//           top: 0, 
//           left: 0, 
//           width: '1px', 
//           height: '1px' 
//         }} 
//       />
      
    

//       {/* Hero Section */}
//       <section className="hero-content relative z-10 min-h-screen flex items-center justify-center text-center text-white p-8">
//         <div>
//           <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
//             Welcome Back to
//             <br />
//             <span className="text-blue-300">Reality</span>
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
//             You've successfully traversed through dimensions and emerged in my portfolio universe. 
//             Explore the projects and experiences I've crafted.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105">
//               View Projects
//             </button>
//             <button className="px-8 py-4 border border-purple-400 hover:bg-purple-400/20 rounded-lg text-white font-semibold transition-all duration-300">
//               Contact Me
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section className="projects-section relative z-10 py-20 px-8">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-16">
//             Interdimensional <span className="text-purple-300">Projects</span>
//           </h2>
          
//           <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               { icon: "🚀", title: "Cosmic Engine", desc: "A revolutionary 3D rendering engine that powers interdimensional experiences.", color: "blue" },
//               { icon: "⚡", title: "Quantum Interface", desc: "AI-powered interface that adapts to user behavior across different realities.", color: "purple" },
//               { icon: "🌌", title: "Reality Bridge", desc: "Connect and synchronize data across parallel universes seamlessly.", color: "pink" },
//               { icon: "🔮", title: "Temporal Analytics", desc: "Advanced analytics platform processing data across multiple timelines.", color: "green" },
//               { icon: "🎭", title: "Multiverse UI", desc: "Dynamic user interface library adapting to different reality states.", color: "yellow" },
//               { icon: "🛸", title: "Space Navigator", desc: "Navigate through infinite dimensional spaces with wormhole travel.", color: "cyan" }
//             ].map((project, index) => (
//               <div 
//                 key={index} 
//                 className="project-card p-8 rounded-lg backdrop-blur-sm border border-gray-700/20 hover:border-blue-400/60 transition-all duration-300 cursor-pointer hover:backdrop-blur-md"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.02)',
//                 }}
//               >
//                 <div className="w-12 h-12 bg-blue-500/20 rounded-lg mb-6 flex items-center justify-center border border-blue-400/30">
//                   <span className="text-2xl">{project.icon}</span>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 text-blue-300">{project.title}</h3>
//                 <p className="text-gray-300 leading-relaxed">{project.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section className="skills-section relative z-10 py-20 px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
//             Interdimensional <span className="text-blue-300">Skills</span>
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               'React/Next.js', 'Three.js/WebGL', 'GSAP Animation', 'Node.js',
//               'TypeScript', 'WebGL Shaders', 'AI/ML', 'Cloud Computing',
//               'Quantum Physics', 'Space-Time API', 'Reality Distortion', 'Dimensional Travel'
//             ].map((skill, index) => (
//               <div
//                 key={skill}
//                 className="skill-item p-4 rounded-lg border border-gray-600/30 hover:border-blue-400/60 transition-all duration-300"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.02)',
//                 }}
//               >
//                 <span className="text-white font-medium">{skill}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="contact-section relative z-10 py-20 px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
//             Contact Across <span className="text-purple-300">Dimensions</span>
//           </h2>
//           <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
//             Ready to embark on another interdimensional journey? Let's create something extraordinary together.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//             <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
//               📧 Send Transmission
//             </button>
//             <button className="px-8 py-4 border border-blue-400 hover:bg-blue-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🔗 LinkedIn Portal
//             </button>
//             <button className="px-8 py-4 border border-green-400 hover:bg-green-400/20 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2">
//               🌌 GitHub Universe
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

