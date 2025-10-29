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
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={item.images?.[0] || 'https://via.placeholder.com/600x400?text=Antique+Item'}
        alt={`${item.title} preview`}
        style={{ height: '220px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{item.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{item.category}</Card.Subtitle>
        <Card.Text className="flex-grow-1">
          {item.description.slice(0, 120)}...
        </Card.Text>
        <motion.div variants={priceUpdateVariants} initial="initial" animate="animate" className="mb-2">
          <span className="price-display">{formatCurrency(item.currentPrice)}</span>
          <Badge bg="secondary" className="ms-2">
            {item.totalBids} bids
          </Badge>
        </motion.div>
        <small className="text-muted">Ends {formatDateTime(item.endTime)}</small>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0">
        <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
          <Button as={Link} to={`/items/${item._id}`} variant="primary" className="w-100">
            View Auction
          </Button>
        </motion.div>
      </Card.Footer>
    </Card>
  </motion.div>
);

export default ItemCard;
