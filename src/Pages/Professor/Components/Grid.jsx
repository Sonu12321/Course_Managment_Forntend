import { useRef, useEffect } from "react";
import { gsap } from "gsap";

// Enhanced ShinyText component with smoother animations
const ShinyText = ({ text, disabled = false, speed = 3, className = "" }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`
          bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 
          bg-clip-text text-transparent font-bold
          ${!disabled ? 'animate-pulse' : ''}
        `}
        style={{
          backgroundSize: disabled ? '100%' : '200% 100%',
          animation: disabled ? 'none' : `shine ${speed}s ease-in-out infinite alternate`,
        }}
      >
        {text}
      </span>
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </span>
  );
};

const ChromaGrid = ({
  items,
  className = "",
  radius = 320,
  damping = 0.5,
  fadeOut = 0.7,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: "https://i.pravatar.cc/300?img=8",
      title: "Alex Rivera",
      subtitle: "Full Stack Developer",
      handle: "@alexrivera",
      borderColor: "#6366f1",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      url: "https://github.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=11",
      title: "Jordan Chen",
      subtitle: "DevOps Engineer",
      handle: "@jordanchen",
      borderColor: "#10b981",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      url: "https://linkedin.com/in/",
    },
    {
      image: "https://i.pravatar.cc/300?img=3",
      title: "Morgan Blake",
      subtitle: "UI/UX Designer",
      handle: "@morganblake",
      borderColor: "#f59e0b",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      url: "https://dribbble.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=16",
      title: "Casey Park",
      subtitle: "Data Scientist",
      handle: "@caseypark",
      borderColor: "#ef4444",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      url: "https://kaggle.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=25",
      title: "Sam Kim",
      subtitle: "Mobile Developer",
      handle: "@thesamkim",
      borderColor: "#8b5cf6",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      url: "https://github.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=60",
      title: "Tyler Rodriguez",
      subtitle: "Cloud Architect",
      handle: "@tylerrod",
      borderColor: "#06b6d4",
      gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      url: "https://aws.amazon.com/",
    },
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.3, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="min-h-screen  ">
      <div
        ref={rootRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`relative w-full h-full flex flex-wrap py-8 justify-center items-start gap-6 ${className}`}
        style={{
          "--r": `${radius}px`,
          "--x": "50%",
          "--y": "50%",
        }}
      >
        {/* Enhanced Professional Heading */}
        <div className="w-full flex justify-center mb-12">
          <div className="relative group">
            {/* Backdrop blur effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-teal-600/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main heading container */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight">
                <ShinyText
                  text="Meet Our Expert Team"
                  disabled={false}
                  speed={2.5}
                  className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent"
                />
              </h1>
              
              {/* Subtitle */}
              <p className="text-center text-slate-600 mt-4 text-lg font-medium tracking-wide">
                Discover the talented professionals driving innovation
              </p>
              
              {/* Bottom decorative line */}
              <div className="flex justify-center mt-6">
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {data.map((c, i) => (
            <article
              key={i}
              onMouseMove={handleCardMove}
              onClick={() => handleCardClick(c.url)}
              className="group relative flex flex-col w-full max-w-[320px] rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl bg-white/95 backdrop-blur-sm"
              style={{
                "--card-border": c.borderColor || "transparent",
                background: `linear-gradient(145deg, ${c.gradient || 'white'}, rgba(255,255,255,0.9))`,
                "--spotlight-color": "rgba(255,255,255,0.4)",
              }}
            >
              {/* Enhanced spotlight effect */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-20 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
                }}
              />

              {/* Image container with enhanced styling */}
              <div className="relative z-10 p-4">
                <div className="relative overflow-hidden rounded-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Enhanced footer with better typography */}
              <footer className="relative z-10 p-6 text-slate-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-900 transition-colors duration-300">
                      {c.title}
                    </h3>
                    {c.handle && (
                      <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {c.handle}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 font-medium text-base">
                    {c.subtitle}
                  </p>
                  
                  {c.location && (
                    <span className="inline-block text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      📍 {c.location}
                    </span>
                  )}
                </div>
                
                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">View Profile</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Enhanced mask effects with smoother gradients */}
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            backdropFilter: "blur(0.5px) brightness(0.85)",
            WebkitBackdropFilter: "blur(0.5px) brightness(0.85)",
            background: "rgba(0,0,0,0.001)",
            maskImage:
              "radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 20%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.30) 65%, rgba(0,0,0,0.50) 80%, rgba(0,0,0,0.75) 95%, white 100%)",
            WebkitMaskImage:
              "radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 20%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.30) 65%, rgba(0,0,0,0.50) 80%, rgba(0,0,0,0.75) 95%, white 100%)",
          }}
        />

        <div
          ref={fadeRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-40"
          style={{
            backdropFilter: "blur(0.5px) brightness(0.85)",
            WebkitBackdropFilter: "blur(0.5px) brightness(0.85)",
            background: "rgba(0,0,0,0.001)",
            maskImage:
              "radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 20%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.70) 65%, rgba(255,255,255,0.50) 80%, rgba(255,255,255,0.25) 95%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 20%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.70) 65%, rgba(255,255,255,0.50) 80%, rgba(255,255,255,0.25) 95%, transparent 100%)",
            opacity: 1,
          }}
        />
      </div>
    </div>
  );
};

export default ChromaGrid;