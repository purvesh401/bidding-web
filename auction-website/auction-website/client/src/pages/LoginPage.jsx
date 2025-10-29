/**
 * @file LoginPage.jsx
 * @description User login form with client-side validation.
 */

import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
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
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card className="w-100" style={{ maxWidth: '420px' }}>
        <Card.Body>
          <Card.Title className="mb-3 text-center">Login to Continue</Card.Title>
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
              <Button type="submit" className="w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in…' : 'Login'}
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Need an account? <Link to="/register">Register here</Link>.
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
