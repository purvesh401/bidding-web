/**
 * @file BidModal.jsx
 * @description Reusable modal that captures bid amounts from the user.
 */

import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '../utils/animationVariants.js';
import { formatCurrency } from '../utils/formatters.js';

/**
 * @component BidModal
 * @param {{
 *  show: boolean,
 *  onHide: () => void,
 *  bidAmount: string,
 *  onBidAmountChange: (value: string) => void,
 *  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
 *  minimumBidDisplay: number,
 *  isSubmitting: boolean
 * }} props - Component props.
 * @returns {JSX.Element}
 */
const BidModal = ({
  show,
  onHide,
  bidAmount,
  onBidAmountChange,
  onSubmit,
  minimumBidDisplay,
  isSubmitting
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Form onSubmit={onSubmit}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">💰 Place Your Bid</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
          <div className="text-muted small mb-1">Minimum Bid Required</div>
          <div className="fw-bold fs-4" style={{ color: 'var(--success-color)' }}>
            {formatCurrency(minimumBidDisplay)}
          </div>
        </div>
        <Form.Group controlId="bidAmount">
          <Form.Label className="fw-semibold">Your Bid Amount</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min={minimumBidDisplay}
            value={bidAmount}
            onChange={(event) => onBidAmountChange(event.target.value)}
            required
            className="form-control-lg"
            placeholder={formatCurrency(minimumBidDisplay)}
          />
          <Form.Text className="text-muted">
            💡 You must bid at least {formatCurrency(minimumBidDisplay)} or higher
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="fw-bold">
            {isSubmitting ? '⏳ Submitting…' : '✅ Place Bid'}
          </Button>
        </motion.div>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default BidModal;
