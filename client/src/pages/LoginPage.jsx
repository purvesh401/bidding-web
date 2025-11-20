/**
 * @file LoginPage.jsx
 * @description User login form with client-side validation.
 */

import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuthContext } from '../hooks/useAuth.js';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component LoginPage
 * @returns {JSX.Element}
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { email: '', password: '' } });

  /**
   * @function onSubmit
   * @description Submits login credentials to the authentication service.
   * @param {{ email: string, password: string }} data - Form values captured by react-hook-form.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back! Logged in successfully.');
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100"
        style={{ maxWidth: '450px' }}
      >
        <div className="glass-card p-5">
          <div className="text-center mb-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mb-3"
            >
              <div className="d-inline-flex align-items-center justify-content-center" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  boxShadow: 'var(--neu-flat)'
                }}>
                <span style={{ fontSize: '2.5rem' }}>🔐</span>
              </div>
            </motion.div>
            <h2 className="fw-bold mb-2 text-gradient">Welcome Back!</h2>
            <p className="text-muted">Login to continue your auction journey</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required.' })}
                isInvalid={Boolean(errors.email)}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required.' })}
                isInvalid={Boolean(errors.password)}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
              <Button 
                type="submit" 
                className="w-100 btn-micro ripple" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? '🔄 Logging in…' : '🚀 Login'}
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-4">
            <div className="neu-card-pressed p-3 rounded">
              <small className="text-muted mb-0">
                Need an account? <Link to="/register" className="text-decoration-none fw-semibold text-gradient">Register here →</Link>
              </small>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
