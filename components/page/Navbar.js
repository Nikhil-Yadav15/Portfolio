"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  IconLayoutNavbarCollapse,
  IconLayoutNavbarExpand,
  IconHome,
  IconUser,
  IconStack,
  IconFolder,
  IconMail,
  IconDownload,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNav } from "@/components/contexts/NavigationContext";

export default function DarkNavbar({
  desktopClassName = "",
  mobileClassName = "",
  logoText = "Portfolio",
  logoClick = () => console.log("Logo clicked!"),
}) {
  const { setToNavigate, currentSection, setFromHero } = useNav();

  const onResumeClick = () => {
    window.open("/resume.pdf", "_blank");
  };

  const NAV_ITEMS = useMemo(() => [
    {
      title: "Home",
      icon: <IconHome className="h-5 w-5" />,
      onClick: () => {
        if (currentSection === "hero") return;
        window.location.reload();
      }
    },
    {
      title: "About Me",
      icon: <IconUser className="h-5 w-5" />,
      onClick: () => {
        setToNavigate("about");
      }
    },
    {
      title: "Tech Stack",
      icon: <IconStack className="h-5 w-5" />,
      onClick: () => {
        setToNavigate("tech");
        if (currentSection === "hero") setFromHero("tech");
      }
    },
    {
      title: "Projects",
      icon: <IconFolder className="h-5 w-5" />,
      onClick: () => {
        setToNavigate("projects");
        if (currentSection === "hero") setFromHero("projects");
      }
    },
    {
      title: "Contact Me",
      icon: <IconMail className="h-5 w-5" />,
      onClick: () => {
        setToNavigate("contact");
        if (currentSection === "hero") setFromHero("contact");
      }
    },
  ], [currentSection, setToNavigate, setFromHero]);

  return (
    <>
      <DarkNavbarDesktop
        items={NAV_ITEMS}
        className={desktopClassName}
        logoText={logoText}
        logoClick={logoClick}
        onResumeClick={onResumeClick}
      />
      <DarkNavbarMobile
        items={NAV_ITEMS}
        className={mobileClassName}
        onResumeClick={onResumeClick}
      />
    </>
  );
}

const DarkNavbarMobile = React.memo(function DarkNavbarMobile({ items, className, onResumeClick }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useScrollHide(setHidden);

  const handleToggle = useCallback(() => setOpen(s => !s), []);
  const handleItemClick = useCallback((itemOnClick) => {
    setOpen(false);
    itemOnClick?.();
  }, []);

  const handleResumeClick = useCallback(() => {
    setOpen(false);
    onResumeClick?.();
  }, [onResumeClick]);

  return (
    <div className={cn("fixed top-4 right-4 z-50 block max-[800px]:block min-[800px]:hidden", className)}>
      <motion.div
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="flex flex-col items-end gap-3"
      >
        <button
          onClick={handleToggle}
          aria-expanded={open}
          aria-label="Open navigation"
          className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700/50 shadow-lg backdrop-blur-md hover:bg-neutral-800/90 transition-colors"
        >
          <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-300" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {items.map((item) => (
                <motion.button
                  key={item.title}
                  layout
                  onClick={() => handleItemClick(item.onClick)}
                  className="flex font-lora h-12 w-12 items-center justify-center rounded-full bg-neutral-900/90 border border-neutral-700/50 shadow-md backdrop-blur-md hover:bg-neutral-800/90 transition-colors"
                  aria-label={item.title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-5 w-5 text-neutral-300">{item.icon}</div>
                </motion.button>
              ))}

              <motion.button
                layout
                onClick={handleResumeClick}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 border border-blue-500/50 shadow-md backdrop-blur-md hover:bg-blue-500/90 transition-colors"
                aria-label="View Resume"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconDownload className="h-5 w-5 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

const DarkNavbarDesktop = React.memo(function DarkNavbarDesktop({
  items,
  className,
  logoText,
  logoClick,
  onResumeClick
}) {
  const mouseX = useMotionValue(Infinity);
  const [hidden, setHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useScrollHide(setHidden);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.pageX);
  }, [mouseX]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  const toggleCollapsed = useCallback(() => setCollapsed(s => !s), []);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: hidden ? -96 : 0,
        opacity: hidden ? 0 : 1,
        width: collapsed ? "48px" : "80dvw",
        left: collapsed ? "auto" : "50%",
        right: collapsed ? "24px" : "auto",
        x: collapsed ? 0 : "-50%"
      }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className={cn(
        "fixed top-6 z-40 hidden h-16 items-center rounded-3xl bg-transparent shadow-xl backdrop-blur-md min-[800px]:flex",
        collapsed ? "px-0 justify-center" : "px-8",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={toggleCollapsed}
              className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/90 border border-neutral-700/50 shadow-lg backdrop-blur-md hover:bg-neutral-800/90 transition-colors"
              aria-label="Expand navigation"
            >
              <IconLayoutNavbarExpand className="h-5 w-5 text-neutral-300" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center w-full"
          >
            <div className="flex-1 flex items-center gap-4">
              <button
                onClick={logoClick}
                className="text-xl font-lora font-bold text-white hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {logoText}
              </button>
            </div>

            <nav className="flex font-lora font-bold items-center gap-2 flex-1 justify-center">
              {items.map((item) => (
                <NavItem mouseX={mouseX} key={item.title} {...item} />
              ))}
            </nav>

            <div className="flex-1 flex justify-end mx-8">
              <ShimmerButton
                className="text-white font-bold font-lora bg-red-200"
                onClick={onResumeClick}
              >
                Resume
              </ShimmerButton>
            </div>

            <button
              onClick={toggleCollapsed}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 border border-neutral-700/30 hover:bg-neutral-700/60 transition-colors"
              aria-label="Collapse navigation"
            >
              <IconLayoutNavbarCollapse className="h-4 w-4 text-neutral-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const NavItem = React.memo(function NavItem({ mouseX, title, icon, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    if (!ref.current) return 0;
    const bounds = ref.current.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-100, 0, 100], [120, 150, 120]);
  const heightTransform = useTransform(distance, [-100, 0, 100], [40, 50, 40]);
  const iconScaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.2, 1]);

  const springConfig = { mass: 0.1, stiffness: 200, damping: 15 };
  const width = useSpring(widthTransform, springConfig);
  const height = useSpring(heightTransform, springConfig);
  const iconScale = useSpring(iconScaleTransform, springConfig);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);
  const handleClick = useCallback(() => onClick?.(), [onClick]);

  return (
    <motion.button
      ref={ref}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative flex items-center justify-center gap-2 px-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/30 hover:bg-neutral-700/60 transition-colors overflow-hidden cursor-pointer"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        style={{ scale: iconScale }}
        className="flex items-center justify-center text-neutral-300"
      >
        {icon}
      </motion.div>

      <span className="text-sm font-medium text-neutral-300 whitespace-nowrap">
        {title}
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-10 left-1/2 px-2 py-1 rounded-md border border-neutral-700/50 bg-neutral-900/95 text-xs text-neutral-200 shadow-lg backdrop-blur-md pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-white"
        initial={{ width: 0 }}
        animate={{ width: hovered ? "100%" : 0 }}
        transition={{ duration: 0.15 }}
      />
    </motion.button>
  );
});

function useScrollHide(setHidden) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let lastY = window.scrollY;
    let timeoutId = null;

    const onScroll = () => {
      if (timeoutId) return;
      
      timeoutId = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        if (Math.abs(delta) < 10) {
          timeoutId = null;
          return;
        }

        if (currentY > lastY && currentY > 80) {
          setHidden(true);
        } else {
          setHidden(false);
        }

        lastY = currentY;
        timeoutId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) cancelAnimationFrame(timeoutId);
    };
  }, [setHidden]);
}
