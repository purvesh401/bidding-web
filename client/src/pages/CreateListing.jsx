/**
 * @file CreateListing.jsx
 * @description Form for sellers to create new auction listings.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component CreateListing
 * @returns {JSX.Element}
 */
const CreateListing = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Art',
      images: '',
      startingPrice: 100,
      bidIncrement: 10,
      endTime: '',
      condition: 'Excellent',
      reservePrice: '',
      dimensionsHeight: '',
      dimensionsWidth: '',
      dimensionsDepth: '',
      dimensionsWeight: '',
      dimensionsUnit: 'inches'
    }
  });

  /**
   * @function onSubmit
   * @description Handles listing creation form submission.
   * @param {Record<string, string>} formData - Raw form values captured by react-hook-form.
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      images: formData.images.split(',').map((url) => url.trim()).filter(Boolean),
      startingPrice: Number(formData.startingPrice),
      bidIncrement: Number(formData.bidIncrement),
      endTime: formData.endTime,
      condition: formData.condition,
      reservePrice: formData.reservePrice ? Number(formData.reservePrice) : undefined,
      dimensions: {
        height: formData.dimensionsHeight ? Number(formData.dimensionsHeight) : undefined,
        width: formData.dimensionsWidth ? Number(formData.dimensionsWidth) : undefined,
        depth: formData.dimensionsDepth ? Number(formData.dimensionsDepth) : undefined,
        weight: formData.dimensionsWeight ? Number(formData.dimensionsWeight) : undefined,
        unit: formData.dimensionsUnit
      }
    };

    try {
      const response = await api.post('/items', payload);
      toast.success('Auction listing created successfully.');
      navigate(`/items/${response.data.item._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to create listing.';
      toast.error(message);
    }
  };

  return (
    <Card>
      <Card.Header>Create New Auction Listing</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="listingTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Victorian Oak Rocking Chair"
                  {...register('title', { required: 'Title is required.' })}
                  isInvalid={Boolean(errors.title)}
                />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select {...register('category')}>
                  <option value="Furniture">Furniture</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Art">Art</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Vintage Electronics">Vintage Electronics</option>
                  <option value="Antique Books">Antique Books</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Watches">Watches</option>
                  <option value="Sculptures">Sculptures</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Musical Instruments">Musical Instruments</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="listingDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Provide an in-depth description highlighting provenance, condition, and notable features."
                  {...register('description', { required: 'Description is required.' })}
                  isInvalid={Boolean(errors.description)}
                />
                <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="listingImages">
                <Form.Label>Image URLs (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                  {...register('images', { required: 'At least one image URL is required.' })}
                  isInvalid={Boolean(errors.images)}
                />
                <Form.Control.Feedback type="invalid">{errors.images?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingStartingPrice">
                <Form.Label>Starting Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  step={1}
                  {...register('startingPrice', { required: 'Starting price is required.' })}
                  isInvalid={Boolean(errors.startingPrice)}
                />
                <Form.Control.Feedback type="invalid">{errors.startingPrice?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingBidIncrement">
                <Form.Label>Bid Increment ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  step={1}
                  {...register('bidIncrement', { required: 'Bid increment is required.' })}
                  isInvalid={Boolean(errors.bidIncrement)}
                />
                <Form.Control.Feedback type="invalid">{errors.bidIncrement?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingEndTime">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('endTime', { required: 'End time is required.' })}
                  isInvalid={Boolean(errors.endTime)}
                />
                <Form.Control.Feedback type="invalid">{errors.endTime?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingCondition">
                <Form.Label>Condition</Form.Label>
                <Form.Select {...register('condition')}>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingReservePrice">
                <Form.Label>Reserve Price (optional)</Form.Label>
                <Form.Control type="number" min={0} step={1} {...register('reservePrice')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="listingDimensionsUnit">
                <Form.Label>Dimensions Unit</Form.Label>
                <Form.Select {...register('dimensionsUnit')}>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="feet">Feet</option>
                  <option value="meters">Meters</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="listingHeight">
                <Form.Label>Height</Form.Label>
                <Form.Control type="number" min={0} step="0.01" {...register('dimensionsHeight')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="listingWidth">
                <Form.Label>Width</Form.Label>
                <Form.Control type="number" min={0} step="0.01" {...register('dimensionsWidth')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="listingDepth">
                <Form.Label>Depth</Form.Label>
                <Form.Control type="number" min={0} step="0.01" {...register('dimensionsDepth')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="listingWeight">
                <Form.Label>Weight</Form.Label>
                <Form.Control type="number" min={0} step="0.01" {...register('dimensionsWeight')} />
              </Form.Group>
            </Col>
            <Col xs={12} className="text-end">
              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Create Listing'}
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateListing;
