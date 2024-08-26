import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-900">
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
    <form onSubmit={handleSubmit}>
      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="flex justify-center">
        <Button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Log In
        </Button>
      </div>
    </form>
    <p className="mt-4 text-center text-gray-600">
      Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
    </p>
  </div>
</div>

  );
};

export default Login;
