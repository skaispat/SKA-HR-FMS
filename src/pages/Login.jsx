import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 glass-effect p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">HR FMS</h2>
          <p className="mt-2 text-sm text-white opacity-80">
            Human Resource & File Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white opacity-60" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white border-opacity-30 placeholder-white placeholder-opacity-60 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white bg-opacity-10"
                  placeholder="Username"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white opacity-60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white border-opacity-30 placeholder-white placeholder-opacity-60 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white bg-opacity-10"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
            >
              Sign in
            </button>
          </div>

          <div className="text-sm text-center text-white opacity-80">
            <p>Default Credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>Employee: user / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;