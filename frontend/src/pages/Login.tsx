import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
        
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
