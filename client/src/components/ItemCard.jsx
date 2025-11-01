/**
 * @file ItemCard.jsx
 * @description Card component displaying summary information for auction items.
 */

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cardVariants, priceUpdateVariants, buttonHoverVariants } from '../utils/animationVariants.js';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';

/**
 * @component ItemCard
 * @param {{ item: Record<string, any> }} props - Component props.
 * @returns {JSX.Element}
 */
const ItemCard = ({ item }) => (
  <motion.div variants={cardVariants} initial="hidden" animate="visible">
    <Card className="h-100 position-relative overflow-hidden">
      <div className="position-relative" style={{ height: '240px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={item.images?.[0] || 'https://via.placeholder.com/600x400?text=Antique+Item'}
          alt={`${item.title} preview`}
          style={{ height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          className="card-image-hover"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg="primary" className="shadow-sm">
            {item.category}
          </Badge>
        </div>
        {item.status === 'active' && (
          <div className="position-absolute top-0 start-0 m-2">
            <Badge bg="danger" className="shadow-sm">
              Live
            </Badge>
          </div>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold mb-2" style={{ minHeight: '3rem' }}>{item.title}</Card.Title>
        <Card.Text className="flex-grow-1 text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          {item.description.slice(0, 100)}...
        </Card.Text>
        <motion.div variants={priceUpdateVariants} initial="initial" animate="animate" className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="price-display-small">{formatCurrency(item.currentPrice)}</span>
            </div>
            <Badge bg="info" className="ms-2 fs-6 px-2 py-2">
              {item.totalBids} {item.totalBids === 1 ? 'bid' : 'bids'}
            </Badge>
          </div>
        </motion.div>
        <div className="mb-3">
            <small className="text-muted d-flex align-items-center">
            Ends {formatDateTime(item.endTime)}
          </small>
        </div>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 pt-0">
        <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
          <Button as={Link} to={`/items/${item._id}`} variant="primary" className="w-100 fw-semibold">
            View Auction
          </Button>
        </motion.div>
      </Card.Footer>
    </Card>
  </motion.div>
);

export default ItemCard;
