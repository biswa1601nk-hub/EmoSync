import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hls from 'hls.js';

export const GlobalBackground = () => {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');

  useEffect(() => {
    let videoSrc = "";
    
    // Determine video based on route
    if (location.pathname === '/login' || location.pathname === '/register') {
      videoSrc = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";
    } else if (location.pathname === '/dashboard' || location.pathname === '/admin') {
      videoSrc = "https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8";
    }

    if (videoSrc === activeVideo) return; // Do nothing if it's the same video

    setActiveVideo(videoSrc);
    setIsLoaded(false); // Reset load state for new video

    if (!videoSrc) {
       if (videoRef.current) {
           videoRef.current.pause();
           videoRef.current.removeAttribute('src');
           videoRef.current.load();
       }
       return;
    }

    if (videoRef.current) {
      if (videoSrc.endsWith('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls({ startPosition: -1 });
          hls.loadSource(videoSrc);
          hls.attachMedia(videoRef.current);
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = videoSrc;
        }
      } else {
        videoRef.current.src = videoSrc;
      }
    }
  }, [location.pathname, activeVideo]);

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  const showOverlay = activeVideo !== '';

  return (
    <>
      {/* 1. Global Float Blobs (Always present, perfectly synced) */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* 2. Global Video & Pulse Blobs (Fixed across the app) */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black ${showOverlay ? 'block' : 'hidden'}`}>
         <video 
           ref={videoRef}
           autoPlay 
           loop 
           muted 
           playsInline
           onCanPlay={handleCanPlay}
           className="absolute inset-0 w-full h-full object-cover mix-blend-screen scale-105 opacity-40"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f18]/90 via-transparent to-[#0a0f18]/90"></div>
         
         {/* Pulse blobs removed for performance - CSS background blobs handle the ambient color */}
         <div></div>
      </div>
    </>
  );
};
