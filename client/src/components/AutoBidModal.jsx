/**
 * @file AutoBidModal.jsx
 * @description Modal component for setting up auto-bidding on an auction item.
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRobot } from 'react-icons/fa';
import api from '../services/api.js';
import { formatCurrency } from '../utils/formatters.js';

/**
 * @component AutoBidModal
 * @param {object} props
 * @param {boolean} props.show - Whether the modal is visible.
 * @param {function} props.onHide - Callback to close the modal.
 * @param {object} props.item - The auction item object.
 * @returns {JSX.Element}
 */
const AutoBidModal = ({ show, onHide, item }) => {
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAutoBid, setExistingAutoBid] = useState(null);

  const minimumBid = item?.currentPrice + item?.bidIncrement || 0;

  useEffect(() => {
    if (show && item?._id) {
      fetchExistingAutoBid();
    }
  }, [show, item]);

  const fetchExistingAutoBid = async () => {
    try {
      const response = await api.get(`/auto-bids/item/${item._id}`);
      if (response.data.autoBid && response.data.autoBid.isActive) {
        setExistingAutoBid(response.data.autoBid);
        setMaxBidAmount(response.data.autoBid.maxBidAmount.toString());
      }
    } catch (error) {
      console.error('Error fetching auto-bid:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numericMaxBid = Number(maxBidAmount);
    if (!Number.isFinite(numericMaxBid) || numericMaxBid < minimumBid) {
      toast.error(`Maximum bid must be at least ${formatCurrency(minimumBid)}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auto-bids/set', {
        itemId: item._id,
        maxBidAmount: numericMaxBid
      });
      
      toast.success('Auto-bid set successfully!');
      onHide();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set auto-bid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!existingAutoBid) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/auto-bids/cancel/${item._id}`);
      toast.success('Auto-bid cancelled.');
      setExistingAutoBid(null);
      setMaxBidAmount('');
      onHide();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel auto-bid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaRobot className="me-2" />
          Auto-Bid Setup
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info" className="small">
          <strong>How Auto-Bidding Works:</strong>
          <ul className="mb-0 mt-2">
            <li>Set your maximum bid amount</li>
            <li>System automatically bids on your behalf</li>
            <li>Bids increment only when necessary</li>
            <li>Stops when max amount is reached</li>
          </ul>
        </Alert>

        {existingAutoBid && (
          <Alert variant="success">
            <strong>Active Auto-Bid:</strong> {formatCurrency(existingAutoBid.maxBidAmount)}
            <br />
            <small>Current auto-bid: {formatCurrency(existingAutoBid.currentAutoBidAmount || 0)}</small>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Maximum Bid Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                step="0.01"
                min={minimumBid}
                placeholder={minimumBid.toFixed(2)}
                value={maxBidAmount}
                onChange={(e) => setMaxBidAmount(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Minimum: {formatCurrency(minimumBid)}
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-grow-1"
            >
              {existingAutoBid ? 'Update Auto-Bid' : 'Enable Auto-Bid'}
            </Button>
            
            {existingAutoBid && (
              <Button
                type="button"
                variant="outline-danger"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel Auto-Bid
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AutoBidModal;
