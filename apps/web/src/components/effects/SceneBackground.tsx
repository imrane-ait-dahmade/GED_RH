'use client';

import { motion } from 'framer-motion';

export function SceneBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-950">
      {/* Gradient de base */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-surface-950 to-brand-950" />
      {/* Orbes animés (remplacement du rendu Three.js) */}
      <motion.div
        className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-600/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-brand-500/15 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Particules décoratives (points CSS) */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-brand-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      {/* Overlay pour lisible */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950/60 via-surface-950/40 to-surface-950/80" />
    </div>
  );
}
