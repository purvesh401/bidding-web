/**
 * @file ProfilePage.jsx
 * @description User profile page where users can view and edit their account information.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuthContext } from '../hooks/useAuth.js';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { buttonHoverVariants } from '../utils/animationVariants.js';
import { formatDateTime } from '../utils/formatters.js';

/**
 * @component ProfilePage
 * @returns {JSX.Element}
 */
const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      username: authUser?.username || '',
      email: authUser?.email || '',
      phoneNumber: authUser?.phoneNumber || '',
      street: authUser?.address?.street || '',
      city: authUser?.address?.city || '',
      state: authUser?.address?.state || '',
      zipCode: authUser?.address?.zipCode || '',
      country: authUser?.address?.country || '',
      profileImage: authUser?.profileImage || ''
    }
  });

  useEffect(() => {
    if (authUser) {
      reset({
        username: authUser.username || '',
        email: authUser.email || '',
        phoneNumber: authUser.phoneNumber || '',
        street: authUser.address?.street || '',
        city: authUser.address?.city || '',
        state: authUser.address?.state || '',
        zipCode: authUser.address?.zipCode || '',
        country: authUser.address?.country || '',
        profileImage: authUser.profileImage || ''
      });
    }
  }, [authUser, reset]);

  /**
   * @function onSubmit
   * @description Submits the profile update form.
   * @param {Object} data - Form data.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      
      const address = {
        street: data.street || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        country: data.country || null
      };

      const updateData = {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        address: Object.values(address).some(v => v) ? address : null,
        profileImage: data.profileImage || null
      };

      const response = await api.put('/auth/profile', updateData);
      
      setAuthUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!authUser) {
    return (
      <Alert variant="warning">
        Please log in to view your profile.
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-2">My Profile</h1>
        <p className="text-muted lead">Manage your account information and preferences</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                {authUser.profileImage ? (
                  <img
                    src={authUser.profileImage}
                    alt={authUser.username}
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: '150px',
                      height: '150px',
                      background: 'var(--primary-gradient)',
                      fontSize: '4rem',
                      color: 'white'
                    }}
                  >
                    {authUser.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h3 className="fw-bold mb-1">{authUser.username}</h3>
              <p className="text-muted mb-2">{authUser.email}</p>
              <div className="text-muted small">
                <div>Member since: {formatDateTime(authUser.createdAt)}</div>
                {authUser.lastLogin && (
                  <div className="mt-1">Last login: {formatDateTime(authUser.lastLogin)}</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="fw-bold">Edit Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileUsername">
                      <Form.Label className="fw-semibold">Username</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('username', {
                          required: 'Username is required.',
                          minLength: { value: 3, message: 'Minimum length is 3 characters.' }
                        })}
                        isInvalid={Boolean(errors.username)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileEmail">
                      <Form.Label className="fw-semibold">Email</Form.Label>
                      <Form.Control
                        type="email"
                        {...register('email', {
                          required: 'Email is required.',
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Please provide a valid email address.'
                          }
                        })}
                        isInvalid={Boolean(errors.email)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="profilePhoneNumber">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+1 234 567 8900"
                    {...register('phoneNumber')}
                  />
                  <Form.Text className="text-muted">
                    Optional: Add your phone number for account verification
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="profileImage">
                  <Form.Label className="fw-semibold">Profile Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...register('profileImage')}
                  />
                  <Form.Text className="text-muted">
                    Optional: Add a URL to your profile image
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">Address Information</h5>

                <Form.Group className="mb-3" controlId="profileStreet">
                  <Form.Label className="fw-semibold">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123 Main Street"
                    {...register('street')}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileCity">
                      <Form.Label className="fw-semibold">City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="New York"
                        {...register('city')}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileState">
                      <Form.Label className="fw-semibold">State/Province</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="NY"
                        {...register('state')}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileZipCode">
                      <Form.Label className="fw-semibold">Zip/Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="10001"
                        {...register('zipCode')}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="profileCountry">
                      <Form.Label className="fw-semibold">Country</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="United States"
                        {...register('country')}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                    disabled={isSaving}
                  >
                    Reset
                  </Button>
                  <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </motion.div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;

