/**
 * @file CreateListing.jsx
 * @description Form for sellers to create new auction listings.
 */

import React, { useState } from 'react';
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
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Art',
      images: '',
      startingPrice: 100,
      bidIncrement: 10,
      startTime: '',
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
  const [selectedFiles, setSelectedFiles] = useState([]);

  const selectedCategory = watch('category');

  const onSubmit = async (formData) => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    const categoryValue = formData.category === 'Other' && formData.customCategory
      ? String(formData.customCategory).trim()
      : formData.category;
    form.append('category', categoryValue);
    if (formData.startTime) form.append('startTime', formData.startTime);
    const urlList = formData.images
      ? formData.images.split(',').map((u) => u.trim()).filter(Boolean)
      : [];
    urlList.forEach((u) => form.append('images', u));
    form.append('startingPrice', String(Number(formData.startingPrice)));
    form.append('bidIncrement', String(Number(formData.bidIncrement)));
  if (formData.endTime) form.append('endTime', formData.endTime);
    form.append('condition', formData.condition);
    if (formData.reservePrice) form.append('reservePrice', String(Number(formData.reservePrice)));
    if (formData.dimensionsHeight) form.append('dimensions[height]', String(Number(formData.dimensionsHeight)));
    if (formData.dimensionsWidth) form.append('dimensions[width]', String(Number(formData.dimensionsWidth)));
    if (formData.dimensionsDepth) form.append('dimensions[depth]', String(Number(formData.dimensionsDepth)));
    if (formData.dimensionsWeight) form.append('dimensions[weight]', String(Number(formData.dimensionsWeight)));
    form.append('dimensions[unit]', formData.dimensionsUnit);

    selectedFiles.forEach((file) => form.append('images', file));

    try {
      const response = await api.post('/items', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
            {selectedCategory === 'Other' && (
              <Col md={6}>
                <Form.Group controlId="listingCustomCategory">
                  <Form.Label>Specify category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    {...register('customCategory', { required: 'Please enter a category name.' })}
                    isInvalid={Boolean(errors.customCategory)}
                  />
                  <Form.Control.Feedback type="invalid">{errors.customCategory?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}
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
                <Form.Label>Image URLs (comma separated) or Upload Images</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                  {...register('images')}
                  isInvalid={Boolean(errors.images)}
                />
                <Form.Control.Feedback type="invalid">{errors.images?.message}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2" controlId="listingImageFiles">
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []).slice(0, 5))}
                />
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
              <Form.Group controlId="listingStartTime">
                <Form.Label>Start Time (optional)</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('startTime')}
                  isInvalid={Boolean(errors.startTime)}
                />
                <Form.Control.Feedback type="invalid">{errors.startTime?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="listingEndTime">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register('endTime', {
                    required: 'End time is required.',
                    validate: (value) => {
                      const start = watch('startTime');
                      if (start && value && new Date(value) <= new Date(start)) {
                        return 'End time must be after the start time.';
                      }
                      return true;
                    }
                  })}
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
