import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Hls from 'hls.js';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoSrc = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ startPosition: -1 });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') navigate('/admin');
    else if (role === 'user') navigate('/dashboard');
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/register`, {
        name,
        email,
        password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
         <video 
           ref={videoRef}
           autoPlay 
           loop 
           muted 
           playsInline
           className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f18]/90 via-transparent to-[#0a0f18]/90"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/30 blur-[120px] animate-[pulse_8s_ease-in-out_infinite] mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/20 blur-[150px] animate-[pulse_12s_ease-in-out_infinite] mix-blend-screen"></div>
         <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-red-900/10 blur-[100px] animate-[pulse_15s_ease-in-out_infinite] mix-blend-screen"></div>
      </div>
      
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-xl relative z-10">
        <h2 className="text-3xl font-medium text-white mb-6 text-center">Create an Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success ? (
          <div className="text-center">
            <p className="text-green-500 text-lg font-medium mb-4">Registration successful!</p>
            <p className="text-gray-400">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="Create a strong password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-6"
            >
              Sign Up
            </button>
          </form>
        )}
        {!success && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
