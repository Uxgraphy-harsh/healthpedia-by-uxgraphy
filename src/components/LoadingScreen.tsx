import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loadingFlower from "@/assets/loading-flower.png";
import loadingPetal from "@/assets/loading-petal.png";

interface Petal {
  id: number;
  startX: number;
  delay: number;
  fallDuration: number;
  size: number;
  blur: boolean;
  startRotation: number;
  opacity: number;
  drift: number;
  wobbleSpeed: number;
}

interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      startX: 5 + Math.random() * 90,
      delay: Math.random() * 2.5,
      fallDuration: 6 + Math.random() * 5,
      size: 18 + Math.random() * 28,
      blur: i % 4 === 0,
      startRotation: Math.random() * 360,
      opacity: 0.25 + Math.random() * 0.5,
      drift: 20 + Math.random() * 40,
      wobbleSpeed: 2 + Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 800);
    }, 4500);
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
          {/* Falling petals with natural physics */}
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute pointer-events-none"
              style={{
                left: `${petal.startX}%`,
                width: petal.size,
                height: petal.size * 0.6,
              }}
              initial={{ y: -40 }}
              animate={{ y: "100vh" }}
              transition={{
                y: {
                  duration: petal.fallDuration,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }}
            >
              {/* Horizontal sway — sinusoidal drift */}
              <motion.div
                animate={{ x: [0, petal.drift, -petal.drift * 0.6, petal.drift * 0.3, 0] }}
                transition={{
                  x: {
                    duration: petal.wobbleSpeed * 2,
                    delay: petal.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {/* Tumble rotation — petals flip and spin as they fall */}
                <motion.img
                  src={loadingPetal}
                  alt=""
                  className="w-full h-full"
                  style={{
                    filter: petal.blur ? "blur(3px)" : "blur(0.5px)",
                    opacity: petal.opacity,
                  }}
                  initial={{ rotate: petal.startRotation, rotateX: 0 }}
                  animate={{
                    rotate: petal.startRotation + 180 + Math.random() * 180,
                    rotateX: [0, 180, 360],
                    rotateY: [0, 40, -40, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: petal.fallDuration,
                      delay: petal.delay,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    rotateX: {
                      duration: petal.wobbleSpeed * 1.5,
                      delay: petal.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotateY: {
                      duration: petal.wobbleSpeed,
                      delay: petal.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              </motion.div>
            </motion.div>
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
