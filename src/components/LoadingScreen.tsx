import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loadingFlower from "@/assets/loading-flower.png";
import loadingPetal from "@/assets/loading-petal.png";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  blur: boolean;
  rotation: number;
  swayAmount: number;
  opacity: number;
}

interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 4,
      size: 20 + Math.random() * 30,
      blur: i % 3 === 0,
      rotation: Math.random() * 360,
      swayAmount: 30 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 800);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#FB3661" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Falling petals */}
          {petals.map((petal) => (
            <motion.img
              key={petal.id}
              src={loadingPetal}
              alt=""
              className="absolute pointer-events-none"
              style={{
                width: petal.size,
                height: petal.size * 0.6,
                left: `${petal.x}%`,
                filter: petal.blur ? "blur(3px)" : "blur(0.5px)",
                opacity: petal.opacity,
              }}
              initial={{
                top: "-10%",
                rotate: petal.rotation,
                x: 0,
              }}
              animate={{
                top: "110%",
                rotate: petal.rotation + 360,
                x: [0, petal.swayAmount, -petal.swayAmount / 2, petal.swayAmount / 3, 0],
              }}
              transition={{
                top: {
                  duration: petal.duration,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                rotate: {
                  duration: petal.duration * 1.5,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                x: {
                  duration: petal.duration * 0.8,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          ))}

          {/* Center flower */}
          <motion.div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.08, 1],
                filter: [
                  "blur(0px) brightness(1)",
                  "blur(2px) brightness(1.15)",
                  "blur(0px) brightness(1)",
                ],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <img
                src={loadingFlower}
                alt="Loading"
                className="w-28 h-28 object-contain"
              />
            </motion.div>

            <motion.p
              className="text-white text-xl font-serif text-center leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Charging up your
              <br />
              Ai Powered Health Assistant...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
