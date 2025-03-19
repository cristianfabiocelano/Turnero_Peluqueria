import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronUp,
  Scissors,
  CalendarCheck,
  SparkleIcon,
  Star,
  Heart,
  Calendar,
  BarChart4,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Video,
  MessageSquare
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ServiceCard from "@/components/service-card";
import StylistCard from "@/components/stylist-card";
import GalleryItem from "@/components/gallery-item";
import BookingForm from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  fadeIn,
  staggerContainer,
  floatAnimation,
  slideInLeft,
  slideInRight
} from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { 
  contactMessageSchema, 
  type ContactMessage,
  type Service,
  type Stylist,
  type GalleryItem as GalleryItemType
} from "@shared/schema";

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const { toast } = useToast();

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Fetch stylists
  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ['/api/stylists'],
  });

  // Fetch gallery items
  const { data: galleryItems = [] } = useQuery<GalleryItemType[]>({
    queryKey: ['/api/gallery'],
  });

  // Contact form
  const contactForm = useForm<ContactMessage>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: (data: ContactMessage) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "¡Mensaje Enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      contactForm.reset();
    },
    onError: () => {
      toast({
        title: "Error al enviar el mensaje",
        description: "Por favor intenta nuevamente.",
        variant: "destructive"
      });
    }
  });

  // Handle contact form submission
  const onSubmitContact = (data: ContactMessage) => {
    contactMutation.mutate(data);
  };

  // Scroll to top button
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Features section data
  const features = [
    {
      icon: <Scissors className="text-white text-2xl" />,
      title: "Estilistas Expertos",
      description: "Nuestro equipo de profesionales cuenta con años de experiencia y constante actualización."
    },
    {
      icon: <CalendarCheck className="text-white text-2xl" />,
      title: "Reservas Online",
      description: "Reserva tu turno fácilmente desde cualquier dispositivo en cualquier momento."
    },
    {
      icon: <SparkleIcon className="text-white text-2xl" />,
      title: "Productos Premium",
      description: "Utilizamos exclusivamente productos de alta calidad para garantizar los mejores resultados."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "María Rodríguez",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Me encantó mi experiencia en Lo de Carlitos. Laura hizo un trabajo increíble con mi coloración, captó exactamente lo que quería y el resultado fue mejor de lo que esperaba."
    },
    {
      name: "Juan López",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Martín es un genio con la barba. Por fin encontré un lugar donde entienden exactamente el estilo que busco. El sistema de turnos online es súper conveniente."
    },
    {
      name: "Carolina Méndez",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4.5,
      text: "El tratamiento de keratina que me hicieron cambió por completo mi cabello. Llevo años luchando con el frizz y ahora tengo un pelo increíble. ¡Súper recomendable!"
    },
    {
      name: "Diego Fernández",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Carlos tiene un talento impresionante. Entendió perfectamente el look que quería y adaptó el corte a mi tipo de cara. El ambiente del lugar es genial y el servicio es de primera."
    }
  ];

  // About section data
  const aboutFeatures = [
    { icon: <Star className="text-[#165C5C]" />, text: "Servicio Premium" },
    { icon: <Heart className="text-[#165C5C]" />, text: "Clientes Satisfechos" },
    { icon: <Calendar className="text-[#165C5C]" />, text: "Horarios Flexibles" },
    { icon: <BarChart4 className="text-[#165C5C]" />, text: "Productos Exclusivos" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="pt-28 pb-20 bg-gradient-to-r from-[#165C5C] to-[#CFB6CB] relative" style={{ minHeight: '100vh' }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Descubre tu <span className="text-[#FFAD57]">estilo</span> en Lo de Carlitos
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 mb-8">
              Más que una peluquería, una experiencia completa para transformarte y renovar tu imagen.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                className="bg-[#FFAD57] text-white hover:bg-[#FFAD57]/90 hover:scale-105 transition-transform"
                size="lg"
              >
                <a href="#reservar">Reservar Turno</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white text-[#165C5C] hover:bg-white/90 hover:scale-105 transition-transform border-0"
                size="lg"
              >
                <a href="#servicios">Ver Servicios</a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            variants={floatAnimation}
            animate="animate"
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Estilista profesional trabajando" 
                className="rounded-full w-72 h-72 md:w-96 md:h-96 object-cover border-8 border-white shadow-2xl"
              />
              <motion.div 
                className="absolute -top-5 -right-5 bg-[#FFAD57] text-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="text-center">
                  <span className="block font-bold text-xl">20%</span>
                  <span className="block text-sm">DESCUENTO</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index)}
                className="bg-[#EADBEE] rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="rounded-full bg-[#165C5C] w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#165C5C] mb-3">{feature.title}</h3>
                <p className="text-gray-700">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios personalizados para satisfacer todas tus necesidades de estilo y belleza.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} delay={index} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn()}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1626682501777-5cheagpq3cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Interior de Lo de Carlitos" 
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FFAD57] rounded-lg shadow-lg hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Detalle de peluquería" 
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="md:w-1/2 md:pl-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(3)}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-6">Sobre Lo de Carlitos</h2>
              <p className="text-gray-600 mb-6">
                Con más de 15 años de experiencia, Lo de Carlitos se ha convertido en un referente de estilo y calidad en el mundo de la peluquería.
              </p>
              <p className="text-gray-600 mb-6">
                Nuestro compromiso es brindarte una experiencia única, donde no solo transformamos tu imagen, sino que te hacemos sentir especial desde que entras por nuestra puerta.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {aboutFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#EADBEE] flex items-center justify-center mr-3">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="bg-[#165C5C] text-white hover:bg-[#165C5C]/90 hover:scale-105 transition-transform"
              >
                <a href="#contacto">Conócenos Más</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stylists Section */}
      <section id="estilistas" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-4">Nuestros Estilistas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conoce al equipo de profesionales detrás de Lo de Carlitos, cada uno especializado en diferentes técnicas y estilos.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {stylists.map((stylist, index) => (
              <StylistCard key={stylist.id} stylist={stylist} delay={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-4">Galería de Trabajos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora algunos de nuestros mejores trabajos y encuentra inspiración para tu próximo cambio de look.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item, index) => (
              <GalleryItem key={item.id} item={item} delay={index * 0.5} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#EADBEE] bg-opacity-30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La satisfacción de nuestros clientes es nuestro mejor premio. Esto es lo que opinan de nosotros.
            </p>
          </motion.div>
          
          <div className="flex overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex space-x-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn(index)}
                  className="flex-shrink-0 w-full max-w-md bg-white p-8 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-[#165C5C]">{testimonial.name}</h4>
                      <div className="flex text-[#FFAD57]">
                        {Array(Math.floor(testimonial.rating)).fill(0).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        {testimonial.rating % 1 > 0 && (
                          <div className="relative">
                            <Star className="h-4 w-4 text-gray-300" />
                            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                              <Star className="h-4 w-4 fill-current text-[#FFAD57]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="reservar" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-4">Reserva Tu Turno</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elige el servicio, la fecha y el profesional que prefieras. Confirma tu reserva en pocos pasos.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
          >
            <BookingForm services={services} stylists={stylists} />
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn()}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#165C5C] mb-6">Contacto</h2>
              <p className="text-gray-600 mb-8">
                ¿Tienes alguna pregunta o necesitas más información? No dudes en contactarnos.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#EADBEE] flex items-center justify-center mr-4">
                    <MapPin className="text-[#165C5C]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Dirección</h3>
                    <p className="text-gray-600">Av. Corrientes 1234, Buenos Aires</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#EADBEE] flex items-center justify-center mr-4">
                    <Phone className="text-[#165C5C]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Teléfono</h3>
                    <p className="text-gray-600">+54 11 2345-6789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#EADBEE] flex items-center justify-center mr-4">
                    <Mail className="text-[#165C5C]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@lodecarlitos.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#EADBEE] flex items-center justify-center mr-4">
                    <Clock className="text-[#165C5C]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Horarios</h3>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 - 20:00<br/>Sábados: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3">Síguenos</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: <Instagram size={20} />, label: "Instagram" },
                    { icon: <Facebook size={20} />, label: "Facebook" },
                    { icon: <Video size={20} />, label: "TikTok" },
                    { icon: <MessageSquare size={20} />, label: "WhatsApp" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="w-10 h-10 rounded-full bg-[#165C5C] text-white flex items-center justify-center hover:scale-105 transition-transform"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(3)}
            >
              <Card className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-[#165C5C] mb-6">Envíanos un mensaje</h3>
                
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contactForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-[#FFAD57] text-white hover:bg-[#FFAD57]/90 w-full hover:scale-105 transition-transform"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Enviando..." : "Enviar Mensaje"}
                    </Button>
                  </form>
                </Form>
              </Card>
              
              <div className="mt-8 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.9928553348974!2d-58.38381492425334!3d-34.60339727295209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac630121623%3A0x53386f2ac88991a9!2sAv.%20Corrientes%201234%2C%20C1043AAZ%20CABA!5e0!3m2!1ses!2sar!4v1656614820365!5m2!1ses!2sar" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Lo de Carlitos"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Back to top button */}
      {showScrollButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#FFAD57] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform z-50"
        >
          <ChevronUp />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
