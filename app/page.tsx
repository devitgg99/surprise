"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [clickCount, setClickCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ width: number; height: number; left: number; top: number; animation: string; delay: string }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ left: number; top: number; animation: string; moveAnimation: string; delay: string }>>([]);
  const [glowOrbs, setGlowOrbs] = useState<Array<{ width: number; height: number; left: number; top: number; animation: string; delay: string }>>([]);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize client-side only elements to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Generate floating elements
    setFloatingElements(
      Array.from({ length: 8 }, () => ({
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animation: `${15 + Math.random() * 10}s`,
        delay: `${Math.random() * 5}s`,
      }))
    );

    // Generate sparkles
    setSparkles(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        animation: `${2 + Math.random() * 2}s`,
        moveAnimation: `${10 + Math.random() * 10}s`,
        delay: `${Math.random() * 2}s`,
      }))
    );

    // Generate glow orbs
    setGlowOrbs(
      Array.from({ length: 6 }, () => ({
        width: 100 + Math.random() * 200,
        height: 100 + Math.random() * 200,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animation: `${15 + Math.random() * 15}s`,
        delay: `${Math.random() * 5}s`,
      }))
    );
  }, []);

  // Create particles on hover
  useEffect(() => {
    if (isHovered) {
      const newParticles: Particle[] = Array.from({ length: 15 }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 3 + 2,
        color: ['#d97706', '#ea580c', '#f97316', '#fb923c'][Math.floor(Math.random() * 4)],
        life: 1,
      }));
      setParticles((prev) => [...prev, ...newParticles]);
    }
  }, [isHovered]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0 && p.x > 0 && p.x < window.innerWidth && p.y < window.innerHeight)
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length]);

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(draw);
    };

    draw();
  }, [particles]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    setClickCount((prev) => prev + 1);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    // Navigate to surprise page after 3 clicks
    if (clickCount >= 2) {
      setTimeout(() => {
        router.push('/surprise');
      }, 500);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f1e8] via-[#faf7f0] to-[#f0ebe0] font-sans">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8b6f5e 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'patternMove 20s linear infinite',
          }} 
        />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-10">
        <div className="absolute top-8 left-8 w-32 h-32 border-4 border-[#d97706] rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-16 left-16 w-16 h-16 border-4 border-[#ea580c] rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <div className="absolute bottom-8 right-8 w-32 h-32 border-4 border-[#d97706] rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="absolute bottom-16 right-16 w-16 h-16 border-4 border-[#ea580c] rounded-full animate-spin" style={{ animationDuration: '18s' }} />
      </div>

      {/* Animated geometric shapes */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                width: '60px',
                height: '60px',
                border: `3px solid ${['#d97706', '#ea580c', '#f97316'][i % 3]}`,
                borderRadius: i % 2 === 0 ? '50%' : '20%',
                animation: `shapeRotate ${15 + i * 3}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating decorative elements */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {floatingElements.map((el, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${el.width}px`,
                height: `${el.height}px`,
                left: `${el.left}%`,
                top: `${el.top}%`,
                background: `radial-gradient(circle, #8b6f5e, transparent)`,
                animation: `float ${el.animation} ease-in-out infinite`,
                animationDelay: el.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Sparkle effects with enhanced animations */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                animation: `sparkle ${sparkle.animation} ease-in-out infinite, sparkleMove ${sparkle.moveAnimation} linear infinite`,
                animationDelay: sparkle.delay,
              }}
            >
              <div 
                className="w-1 h-1 bg-[#d97706] rounded-full"
                style={{
                  boxShadow: '0 0 6px rgba(217, 119, 6, 0.8)',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Animated glow orbs */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {glowOrbs.map((orb, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${orb.width}px`,
                height: `${orb.height}px`,
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                background: `radial-gradient(circle, rgba(217, 119, 6, 0.1), transparent)`,
                animation: `glowOrb ${orb.animation} ease-in-out infinite`,
                animationDelay: orb.delay,
                filter: 'blur(40px)',
              }}
            />
          ))}
        </div>
      )}

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Central button with ripple effects and decorative rings */}
      <div className="relative z-10">
        {/* Decorative rings around button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="absolute w-32 h-32 border-2 border-[#d97706] rounded-full opacity-30"
            style={{
              animation: 'ringPulse 2s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-40 h-40 border-2 border-[#ea580c] rounded-full opacity-20"
            style={{
              animation: 'ringPulse 2.5s ease-in-out infinite 0.3s',
            }}
          />
          <div 
            className="absolute w-48 h-48 border-2 border-[#f97316] rounded-full opacity-10"
            style={{
              animation: 'ringPulse 3s ease-in-out infinite 0.6s',
            }}
          />
        </div>

        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="relative px-12 py-4 rounded-full bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#d97706] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group"
          style={{
            boxShadow: isHovered 
              ? '0 20px 40px rgba(217, 119, 6, 0.4), 0 0 60px rgba(217, 119, 6, 0.2)' 
              : '0 10px 30px rgba(217, 119, 6, 0.3)',
            backgroundSize: '200% 100%',
            animation: isHovered 
              ? 'gradient-shift 2s ease infinite, buttonPulse 2s ease-in-out infinite' 
              : 'buttonBreathe 3s ease-in-out infinite',
          }}
        >
          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '0px',
                height: '0px',
                transform: 'translate(-50%, -50%)',
                animation: 'ripple 0.6s ease-out',
              }}
            />
          ))}
          
          <span 
            className="relative z-10"
            style={{
              animation: isHovered ? 'textBounce 0.5s ease-in-out infinite' : 'none',
            }}
          >
            Click here
          </span>
          
          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transform: 'translateX(-100%)',
              animation: isHovered ? 'shine 2s infinite' : 'none',
            }}
          />
        </button>

        {/* Click counter hint */}
        {clickCount > 0 && clickCount < 3 && (
          <p className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-[#8b6f5e] text-sm font-medium animate-pulse">
            {3 - clickCount} more click{3 - clickCount > 1 ? 's' : ''} to reveal the surprise!
          </p>
        )}
      </div>

      {/* Welcome text with animations */}
      <div className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-10 px-4">
        <div className="relative">
          {/* Decorative background for text */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#d97706]/10 via-[#ea580c]/10 to-[#d97706]/10 rounded-2xl blur-xl -z-10"
            style={{
              animation: 'textBackgroundPulse 4s ease-in-out infinite',
            }}
          />
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#8b6f5e] opacity-90 text-center relative"
            style={{
              animation: 'fadeInDown 1s ease-out, textGlow 3s ease-in-out infinite',
              animationDelay: '0s, 1s',
              textShadow: '2px 2px 8px rgba(139, 111, 94, 0.3)',
            }}
          >
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0s', display: 'inline-block' }}>H</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.1s', display: 'inline-block' }}>e</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.2s', display: 'inline-block' }}>y</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.3s', display: 'inline-block' }}>   !</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.4s', display: 'inline-block' }}>b</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.5s', display: 'inline-block' }}>a</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.6s', display: 'inline-block' }}>b</span>
            <span style={{ animation: 'wave 2s ease-in-out infinite', animationDelay: '0.7s', display: 'inline-block' }}>e</span>
          </h1>
          <p 
            className="text-center text-[#8b6f5e] opacity-70 mt-3 text-base md:text-lg font-medium"
            style={{
              animation: 'fadeInUp 1s ease-out 0.5s both',
            }}
          >
            I got something for you ✨
          </p>
        </div>
      </div>

      {/* Floating decorative hearts/emojis */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-3xl opacity-30"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${15 + (i % 4) * 20}%`,
                animation: `floatHeart ${4 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {['💝', '🎁', '🎈', '🎉', '⭐', '✨', '💖', '🎂'][i]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
