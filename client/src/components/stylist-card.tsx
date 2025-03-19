import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, stylistInfoAnimation } from '@/lib/animations';
import { Stylist } from '@shared/schema';

type StylistCardProps = {
  stylist: Stylist;
  delay: number;
};

const StylistCard = ({ stylist, delay }: StylistCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn(delay)}
      className="h-full"
    >
      <Card 
        className="rounded-lg overflow-hidden shadow-md h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img 
            src={stylist.imageUrl} 
            alt={stylist.name} 
            className="w-full h-80 object-cover"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={stylistInfoAnimation}
                className="absolute bottom-0 left-0 right-0 bg-[#165C5C]/90 p-4"
              >
                <h3 className="text-xl font-bold text-white mb-1">{stylist.name}</h3>
                <p className="text-white opacity-90 text-sm mb-2">{stylist.role}</p>
                <p className="text-white opacity-75 text-sm">
                  {stylist.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <CardContent className="p-4 bg-white">
          <h3 className="text-xl font-bold text-[#165C5C]">{stylist.name}</h3>
          <p className="text-gray-600">{stylist.role}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StylistCard;
