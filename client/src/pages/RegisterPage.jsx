/**
 * @file RegisterPage.jsx
 * @description Registration form for creating new user accounts.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuthContext } from '../hooks/useAuth.js';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component RegisterPage
 * @returns {JSX.Element}
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { username: '', email: '', password: '' }
  });

  /**
   * @function onSubmit
   * @description Sends registration payload to the backend and logs the user in on success.
   * @param {{ username: string, email: string, password: string }} data - Form values.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card className="w-100 border-0 shadow-lg" style={{ maxWidth: '480px' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">✨ Create an Account</h2>
            <p className="text-muted">Join our auction platform today</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="registerUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="AntiqueCollector"
                {...register('username', {
                  required: 'Username is required.',
                  minLength: { value: 3, message: 'Minimum length is 3 characters.' }
                })}
                isInvalid={Boolean(errors.username)}
              />
              <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required.' })}
                isInvalid={Boolean(errors.email)}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Choose a secure password"
                {...register('password', {
                  required: 'Password is required.',
                  minLength: { value: 8, message: 'Minimum length is 8 characters.' }
                })}
                isInvalid={Boolean(errors.password)}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
              <Button type="submit" className="w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Register'}
              </Button>
            </motion.div>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account? <Link to="/login">Login here</Link>.
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage;
