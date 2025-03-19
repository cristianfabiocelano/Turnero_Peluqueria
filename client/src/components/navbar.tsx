import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mobileMenuAnimation } from "@/lib/animations";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#estilistas", label: "Estilistas" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <a href="#inicio" className="flex items-center">
            <div className="w-12 h-12 bg-[#165C5C] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">LC</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-[#165C5C]">Lo de Carlitos</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="font-medium hover:text-[#FFAD57] transition duration-300"
              >
                {link.label}
              </a>
            ))}
            <a 
              href="#reservar" 
              className="bg-[#FFAD57] text-white px-4 py-2 rounded-md font-medium hover:scale-105 transition-transform duration-300"
            >
              Reservar Turno
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-[#165C5C]"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuAnimation}
            className="md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#165C5C] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LC</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-[#165C5C]">Lo de Carlitos</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            <div className="py-4 px-6 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="block font-medium hover:text-[#FFAD57] transition duration-300"
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="#reservar" 
                className="block bg-[#FFAD57] text-white px-4 py-2 rounded-md font-medium text-center hover:scale-105 transition-transform duration-300"
              >
                Reservar Turno
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
