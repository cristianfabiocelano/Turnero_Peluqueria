import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Video, MessageSquare } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Video size={20} />, href: "#", label: "TikTok" },
    { icon: <MessageSquare size={20} />, href: "#", label: "WhatsApp" }
  ];

  const quickLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#estilistas", label: "Estilistas" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" },
    { href: "#reservar", label: "Reservar Turno" }
  ];

  const services = [
    { href: "#servicios", label: "Corte de Cabello" },
    { href: "#servicios", label: "Coloración" },
    { href: "#servicios", label: "Peinados" },
    { href: "#servicios", label: "Tratamientos" },
    { href: "#servicios", label: "Alisado y Keratina" },
    { href: "#servicios", label: "Barbería" }
  ];

  const contactInfo = [
    { icon: <MapPin size={16} />, text: "Av. Corrientes 1234, Buenos Aires" },
    { icon: <Phone size={16} />, text: "+54 11 2345-6789" },
    { icon: <Mail size={16} />, text: "info@lodecarlitos.com" },
    { icon: <Clock size={16} />, text: "Lunes a Viernes: 9:00 - 20:00\nSábados: 9:00 - 18:00" }
  ];

  return (
    <footer className="bg-[#165C5C] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#165C5C] font-bold text-lg">LC</span>
              </div>
              <span className="ml-3 text-xl font-bold">Lo de Carlitos</span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Más que una peluquería, una experiencia para renovar tu imagen y aumentar tu confianza.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-white hover:text-[#FFAD57] transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="opacity-80 hover:opacity-100 hover:text-[#FFAD57] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href} 
                    className="opacity-80 hover:opacity-100 hover:text-[#FFAD57] transition-colors"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <span className="mt-1 mr-3 opacity-80">{info.icon}</span>
                  <span className="opacity-80 whitespace-pre-line">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">
            &copy; {currentYear} Lo de Carlitos. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Política de Privacidad</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
