"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const [hearts, setHearts] = useState<Array<{ left: number; top: number; emoji: string; animation: string; pulse: string; delay: string }>>([]);
  const [backgroundOrbs, setBackgroundOrbs] = useState<Array<{ width: number; height: number; left: number; top: number; animation: string; delay: string }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
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

    // Generate hearts
    const emojis = ['❤️', '💖', '💝', '🎁', '⭐', '✨'];
    setHearts(
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f1e8] via-[#faf7f0] to-[#f0ebe0] font-sans">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-8">
          <h1 
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#d97706] mb-4"
            style={{
              animation: 'surpriseBounce 1s ease-out, gradient-shift 3s ease infinite',
              backgroundSize: '200% 100%',
            }}
          >
            <span style={{ animation: 'emojiSpin 2s ease-in-out infinite', display: 'inline-block' }}>🎉</span>
            {' '}Surprise!{' '}
            <span style={{ animation: 'emojiSpin 2s ease-in-out infinite', animationDelay: '0.5s', display: 'inline-block' }}>🎉</span>
          </h1>
          <div 
            className="w-32 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto mb-6"
            style={{
              animation: 'lineExpand 1s ease-out 0.5s both',
            }}
          />
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <p 
            className="text-2xl md:text-3xl text-[#8b6f5e] font-semibold"
            style={{
              animation: 'fadeInScale 1s ease-out 0.8s both',
            }}
          >
            You've discovered the secret!
          </p>
          <p 
            className="text-lg md:text-xl text-[#8b6f5e] opacity-80"
            style={{
              animation: 'fadeInScale 1s ease-out 1s both',
            }}
          >
            This is your special moment. Enjoy every second of it! ✨
          </p>

          <div 
            className="flex justify-center gap-4 mt-8"
            style={{
              animation: 'fadeInUp 1s ease-out 1.2s both',
            }}
          >
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                animation: 'buttonBreathe 3s ease-in-out infinite',
                backgroundSize: '200% 100%',
              }}
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8b6f5e] to-[#6b5648] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                animation: 'buttonBreathe 3s ease-in-out infinite 0.5s',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </div>

      {/* Floating hearts with enhanced animations */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {hearts.map((heart, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                animation: `heartFloat ${heart.animation} ease-in-out infinite, heartPulse ${heart.pulse} ease-in-out infinite`,
                animationDelay: heart.delay,
              }}
            >
              {heart.emoji}
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

