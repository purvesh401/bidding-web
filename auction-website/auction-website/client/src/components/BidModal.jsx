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
        <Modal.Title>Place Your Bid</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="bidAmount">
          <Form.Label>Bid Amount (minimum {formatCurrency(minimumBidDisplay)})</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min={minimumBidDisplay}
            value={bidAmount}
            onChange={(event) => onBidAmountChange(event.target.value)}
            required
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Place Bid'}
          </Button>
        </motion.div>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default BidModal;
