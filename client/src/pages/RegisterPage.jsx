/**
 * @file RegisterPage.jsx
 * @description Registration form for creating new user accounts with enhanced fields.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaArrowRight, FaArrowLeft, FaCheckCircle, FaImage } from 'react-icons/fa';
import { useAuthContext } from '../hooks/useAuth.js';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component RegisterPage
 * @returns {JSX.Element}
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      profileImage: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  /**
   * @function handleNext
   * @description Validates current step fields and moves to next step.
   */
  const handleNext = async () => {
    const step1Fields = ['username', 'email', 'password'];
    const isValid = await trigger(step1Fields);
    if (isValid) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * @function handlePrevious
   * @description Returns to previous step.
   */
  const handlePrevious = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * @function onSubmit
   * @description Sends registration payload to the backend and logs the user in on success.
   * @param {Object} data - Form values.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      profileImage: data.profileImage || null,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country
      }
    };
    
    const result = await registerUser(payload);
    if (result.success) {
      toast.success('🎉 Account created successfully! Welcome aboard!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100"
        style={{ maxWidth: '700px' }}
      >
        <div className="glass-card p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">✨ Create an Account</h2>
            <p className="text-muted">Join our auction platform in 2 easy steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className={`fw-semibold ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                <FaUser className="me-1" /> Account Details
              </small>
              <small className={`fw-semibold ${currentStep === 2 ? 'text-primary' : 'text-muted'}`}>
                <FaMapMarkerAlt className="me-1" /> Contact Info
              </small>
            </div>
            <ProgressBar 
              now={currentStep === 1 ? 50 : 100} 
              variant={currentStep === 2 ? "success" : "primary"}
              style={{ height: '6px' }}
            />
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Account Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h5 className="fw-bold text-primary mb-3">
                      <FaUser className="me-2" />
                      Step 1: Account Details
                    </h5>
                  </div>

                  <Form.Group className="mb-3" controlId="registerUsername">
                    <Form.Label className="fw-semibold">
                      Username <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="AntiqueCollector"
                      className="py-2"
                      {...register('username', {
                        required: 'Username is required.',
                        minLength: { value: 3, message: 'Minimum length is 3 characters.' }
                      })}
                      isInvalid={Boolean(errors.username)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label className="fw-semibold">
                      Email address <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      className="py-2"
                      {...register('email', {
                        required: 'Email is required.',
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: 'Please provide a valid email address.'
                        }
                      })}
                      isInvalid={Boolean(errors.email)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="registerPassword">
                    <Form.Label className="fw-semibold">
                      Password <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Choose a secure password (min 8 characters)"
                      className="py-2"
                      {...register('password', {
                        required: 'Password is required.',
                        minLength: { value: 8, message: 'Minimum length is 8 characters.' }
                      })}
                      isInvalid={Boolean(errors.password)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="text-end">
                    <motion.div 
                      variants={buttonHoverVariants} 
                      whileHover="hover" 
                      whileTap="tap"
                      className="d-inline-block"
                    >
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        className="px-5"
                      >
                        Continue <FaArrowRight className="ms-2" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Contact & Address Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h5 className="fw-bold text-success mb-3">
                      <FaMapMarkerAlt className="me-2" />
                      Step 2: Contact & Address
                    </h5>
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerPhoneNumber">
                        <Form.Label className="fw-semibold">
                          Mobile Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="+1 234 567 8900"
                          className="py-2"
                          {...register('phoneNumber', {
                            required: 'Mobile number is required.',
                            pattern: {
                              value: /^\+?[\d\s\-\(\)]+$/,
                              message: 'Please provide a valid phone number.'
                            }
                          })}
                          isInvalid={Boolean(errors.phoneNumber)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerProfileImage">
                        <Form.Label className="fw-semibold">
                          <FaImage className="me-1" /> Profile Image URL
                        </Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="py-2"
                          {...register('profileImage')}
                        />
                        <Form.Text className="text-muted">
                          Optional: Add your profile picture
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <h6 className="fw-bold mb-3">Address Details <span className="text-danger">*</span></h6>

                  <Form.Group className="mb-3" controlId="registerStreet">
                    <Form.Label className="fw-semibold">
                      Street Address <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="123 Main Street, Apt 4B"
                      className="py-2"
                      {...register('street', {
                        required: 'Street address is required.'
                      })}
                      isInvalid={Boolean(errors.street)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.street?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerCity">
                        <Form.Label className="fw-semibold">
                          City <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="New York"
                          className="py-2"
                          {...register('city', {
                            required: 'City is required.'
                          })}
                          isInvalid={Boolean(errors.city)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerState">
                        <Form.Label className="fw-semibold">
                          State/Province <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="NY"
                          className="py-2"
                          {...register('state', {
                            required: 'State/Province is required.'
                          })}
                          isInvalid={Boolean(errors.state)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerZipCode">
                        <Form.Label className="fw-semibold">
                          Zip/Postal Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="10001"
                          className="py-2"
                          {...register('zipCode', {
                            required: 'Zip/Postal code is required.'
                          })}
                          isInvalid={Boolean(errors.zipCode)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.zipCode?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerCountry">
                        <Form.Label className="fw-semibold">
                          Country <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="United States"
                          className="py-2"
                          {...register('country', {
                            required: 'Country is required.'
                          })}
                          isInvalid={Boolean(errors.country)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.country?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="outline-secondary" 
                      size="lg"
                      onClick={handlePrevious}
                      className="px-4"
                    >
                      <FaArrowLeft className="me-2" /> Back
                    </Button>

                    <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        type="submit" 
                        variant="success" 
                        size="lg"
                        disabled={isSubmitting}
                        className="px-5"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="me-2" /> Register
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>

          <div className="text-center mt-4">
            <small className="text-muted">
              Already have an account? <Link to="/login" className="fw-semibold">Login here</Link>
            </small>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
