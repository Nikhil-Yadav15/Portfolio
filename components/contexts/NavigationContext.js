"use client";
import React, { createContext, useContext, useState } from "react";

const NavContext = createContext(null);

export const NavProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState("hero"); 
  const [toNavigate, setToNavigate] = useState(null);           
  const [fromHero, setFromHero] = useState(null);

  return (
    <NavContext.Provider
      value={{ currentSection, setCurrentSection, toNavigate, setToNavigate, fromHero, setFromHero }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
