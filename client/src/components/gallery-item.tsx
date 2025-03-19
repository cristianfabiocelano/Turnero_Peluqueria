import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { fadeIn, galleryItemAnimation } from '@/lib/animations';
import { GalleryItem } from '@shared/schema';

type GalleryItemProps = {
  item: GalleryItem;
  delay: number;
};

const GalleryItemComponent = ({ item, delay }: GalleryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn(delay)}
        className="gallery-item overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsOpen(true)}
      >
        <motion.img
          src={item.imageUrl} 
          alt={item.description}
          className="w-full h-48 md:h-64 object-cover"
          initial="initial"
          whileHover="hover"
          variants={galleryItemAnimation}
        />
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <img 
            src={item.imageUrl.replace('w=300', 'w=1200')} 
            alt={item.description} 
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <p className="text-center text-gray-600 mt-2">{item.description}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryItemComponent;
