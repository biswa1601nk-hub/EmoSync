import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import axios from 'axios';
import { User, ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/login`, {
        email,
        password
      });

      if (response.data.role === 'admin') {
        if (loginType === 'user') {
           setError('These are admin credentials. Please use the Admin tab.');
           return;
        }
        localStorage.setItem('role', 'admin');
        localStorage.setItem('userName', response.data.name);
        if (response.data.userId) localStorage.setItem('userId', response.data.userId);
        navigate('/admin');
      } else {
        if (loginType === 'admin') {
           setError('These are standard user credentials. Please use the User tab.');
           return;
        }
        localStorage.setItem('role', 'user');
        localStorage.setItem('userName', response.data.name);
        if (response.data.userId) localStorage.setItem('userId', response.data.userId);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please verify your credentials.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/google-login`, {
        token: credentialResponse.credential,
      });

      if (response.data.role === 'admin') {
         localStorage.setItem('role', 'admin');
         localStorage.setItem('userName', response.data.name);
         if (response.data.userId) localStorage.setItem('userId', response.data.userId);
         navigate('/admin');
      } else {
         localStorage.setItem('role', 'user');
         localStorage.setItem('userName', response.data.name);
         if (response.data.userId) localStorage.setItem('userId', response.data.userId);
         navigate('/dashboard');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google Login Failed');
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
        
        {/* Toggle Login Type */}
        <div className="flex bg-gray-950 rounded-lg p-1 mb-6 border border-gray-800 flex-wrap">
          <button 
            onClick={() => { setLoginType('user'); setError(''); setEmail(''); setPassword(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${loginType === 'user' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <User className="w-4 h-4" /> User Login
          </button>
          <button 
            onClick={() => { setLoginType('admin'); setError(''); setEmail(''); setPassword(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${loginType === 'admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Admin Portal
          </button>
        </div>

        <h2 className="text-3xl font-medium text-white mb-6 text-center">
          {loginType === 'user' ? 'Welcome Back' : 'Secure Admin Access'}
        </h2>
        
        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {loginType === 'admin' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-black border rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 ${loginType === 'admin' ? 'border-red-900 focus:border-red-500' : 'border-gray-800 focus:border-blue-500'}`}
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
              className={`w-full bg-black border rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 ${loginType === 'admin' ? 'border-red-900 focus:border-red-500' : 'border-gray-800 focus:border-blue-500'}`}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white font-medium py-3 rounded-lg transition-colors mt-4 ${loginType === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loginType === 'user' ? 'Sign In' : 'Access Operations Center'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-full mb-4 md:mb-6">
            <div className="border-t border-gray-800 w-full absolute"></div>
            <span className="bg-gray-900 px-3 text-sm text-gray-500 relative z-10">Or continue with</span>
          </div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
          />
        </div>

        {/* Dynamic Footer section based on role */}
        <div className="mt-6">
          {loginType === 'user' && (
            <p className="text-center text-sm text-gray-500 md:flex md:justify-between">
              <span className="cursor-pointer hover:text-gray-300 block mb-2 md:mb-0">Forgot Password?</span>
              <span>
                Don't have an account?{' '}
                <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
              </span>
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Login;
