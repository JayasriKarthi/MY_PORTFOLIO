import React from "react";
import { motion } from "framer-motion";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    
  },
  {
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    
  },
];

export default function PhotoGallery() {
  return (
    <section className="mt-10 px-2 sm:px-4">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold text-white">Photos</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {photos.map((photo) => (
          <motion.div
            key={photo.src}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow"
          >
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={photo.src}
                alt={photo.label}
                loading="lazy"
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent opacity-90" />
              <div className="absolute left-4 bottom-4 right-4 text-white">
                <p className="text-sm font-medium tracking-wide drop-shadow-lg">{photo.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
