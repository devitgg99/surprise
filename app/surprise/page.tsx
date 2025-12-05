"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export default function SurprisePage() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hearts, setHearts] = useState<Array<{ left: number; top: number; type: 'balloon' | 'confetti'; animation: string; pulse: string; delay: string }>>([]);
  const [backgroundOrbs, setBackgroundOrbs] = useState<Array<{ width: number; height: number; left: number; top: number; animation: string; delay: string }>>([]);
  const [monkeyAnimation, setMonkeyAnimation] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Load Lottie animation
    fetch('/dancingmonkey.json')
      .then(res => res.json())
      .then(data => setMonkeyAnimation(data))
      .catch(err => console.error('Error loading animation:', err));
    
    // Play background music
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume to 50%
      audioRef.current.play().catch(err => {
        // Autoplay might be blocked by browser, user interaction required
        console.log('Autoplay blocked, user interaction required:', err);
      });
    }
    
    // Create confetti
    const colors = ['#d97706', '#ea580c', '#f97316', '#fb923c', '#8b6f5e', '#f5f1e8'];
    const newConfetti: Confetti[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));
    setConfetti(newConfetti);
    setShowContent(true);

    // Generate floating elements (balloons and confetti)
    setHearts(
      Array.from({ length: 12 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        type: Math.random() > 0.5 ? 'balloon' : 'confetti' as 'balloon' | 'confetti',
        animation: `${3 + Math.random() * 3}s`,
        pulse: `${2 + Math.random() * 2}s`,
        delay: `${Math.random() * 2}s`,
      }))
    );

    // Generate background orbs
    setBackgroundOrbs(
      Array.from({ length: 8 }, () => ({
        width: 150 + Math.random() * 250,
        height: 150 + Math.random() * 250,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animation: `${20 + Math.random() * 20}s`,
        delay: `${Math.random() * 5}s`,
      }))
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || confetti.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setConfetti((prev) =>
        prev.map((c) => {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
          ctx.restore();

          return {
            ...c,
            x: c.x + c.vx,
            y: c.y + c.vy,
            vy: c.vy + 0.1,
            rotation: c.rotation + c.rotationSpeed,
          };
        }).filter((c) => c.y < canvas.height + 20)
      );

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [confetti.length]);

  return (
    <div className="relative flex min-h-screen  items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f1e8] via-[#faf7f0] to-[#f0ebe0] font-sans">
      {/* Background music */}
      <audio
        ref={audioRef}
        src="/happybirthdaysong.mp3"
        loop
        preload="auto"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Birthday feature section */}
      <div className="relative mt-10 flex flex-col items-center gap-8 md:gap-12 text-center px-4">
        <h2 
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#d97706] drop-shadow-lg"
          style={{
            animation: 'fadeInDown 0.8s ease-out, textGlow 3s ease-in-out infinite 0.8s',
          }}
        >
          Happy Birthday
        </h2>

        <div 
          className="flex items-center justify-center h-full md:gap-12 lg:gap-16"
          style={{
            animation: 'fadeInScale 1s ease-out 0.3s both',
          }}
        >
          <Image
            src="/meyly1.svg"
            alt="left decoration"
            width={320}
            height={320}
            className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 transition-transform duration-300 hover:scale-110"
            style={{
              animation: 'slideInLeft 0.8s ease-out 0.5s both',
            }}
            priority
          />
          <Image
            src="/cake.svg"
            alt="birthday cake"
            width={400}
            height={400}
            className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            style={{
              animation: 'cakeBounce 1s ease-out 0.7s both, cakeFloat 3s ease-in-out infinite 1.7s',
            }}
            priority
          />
          <Image
            src="/meyly2.svg"
            alt="right decoration"
            width={320}
            height={320}
            className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 transition-transform duration-300 hover:scale-110"
            style={{
              animation: 'slideInRight 0.8s ease-out 0.5s both',
            }}
            priority
          />
        </div>

        {/* Monkey animation below cake */}
        {monkeyAnimation && (
          <div 
            className="flex justify-center -mt-16 md:-mt-20 lg:-mt-24 xl:-mt-28"
            style={{
              animation: 'fadeInUp 1s ease-out 1.2s both',
            }}
          >
            <div className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex-shrink-0">
              <Lottie 
                animationData={monkeyAnimation} 
                loop={true}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        <p 
          className="text-2xl md:text-3xl lg:text-4xl text-[#8b6f5e] opacity-90 max-w-4xl leading-relaxed text-center -mt-12 md:-mt-14 lg:-mt-16 xl:-mt-18"
          style={{
            animation: 'fadeInUp 1s ease-out 1.5s both, textGlow 3s ease-in-out infinite 2.5s',
          }}
        >
          Happy Birthday! babee i love you so much and i wish you a very happy birthday!
        </p>
      </div>

      {/* Floating balloons and confetti with enhanced animations */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {hearts.map((heart, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                animation: `heartFloat ${heart.animation} ease-in-out infinite, heartPulse ${heart.pulse} ease-in-out infinite`,
                animationDelay: heart.delay,
              }}
            >
              <Image 
                src={heart.type === 'balloon' ? '/ballon.svg' : '/confetti.svg'} 
                alt={heart.type === 'balloon' ? 'balloon' : 'confetti'} 
                width={heart.type === 'balloon' ? 60 : 40} 
                height={heart.type === 'balloon' ? 50 : 40} 
                className="inline-block"
              />
            </div>
          ))}
        </div>
      )}

      {/* Animated background orbs */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {backgroundOrbs.map((orb, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${orb.width}px`,
                height: `${orb.height}px`,
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                background: `radial-gradient(circle, rgba(217, 119, 6, 0.15), transparent)`,
                animation: `glowOrb ${orb.animation} ease-in-out infinite`,
                animationDelay: orb.delay,
                filter: 'blur(50px)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

