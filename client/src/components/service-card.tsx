import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Palette, Wind, Droplet, Feather } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';
import { serviceCardAnimation } from '@/lib/animations';
import { Service } from '@shared/schema';

type ServiceCardProps = {
  service: Service;
  delay: number;
};

const ServiceCard = ({ service, delay }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Map icon name to component
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'scissors': return <Scissors className="text-[#FFAD57]" />;
      case 'palette': return <Palette className="text-[#FFAD57]" />;
      case 'wind': return <Wind className="text-[#FFAD57]" />;
      case 'droplet': return <Droplet className="text-[#FFAD57]" />;
      case 'feather': return <Feather className="text-[#FFAD57]" />;
      default: return <Scissors className="text-[#FFAD57]" />;
    }
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      whileHover="hover"
      initial="initial"
      variants={serviceCardAnimation}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {getIcon(service.icon)}
            <h3 className="text-xl font-bold text-[#165C5C]">{service.name}</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {service.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-[#FFAD57] font-bold">
              {formatPrice(service.price)}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDuration(service.duration)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          <a
            href="#reservar"
            className="text-[#165C5C] hover:text-[#FFAD57] transition-colors font-medium inline-flex items-center"
          >
            Reservar
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="ml-1 h-4 w-4" />
            </motion.span>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
