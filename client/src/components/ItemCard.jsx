/**
 * @file ItemCard.jsx
 * @description Card component with 3D tilt and parallax effects for auction items.
 */

import React, { useState } from 'react';
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
const ItemCard = ({ item }) => {
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setImagePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setImagePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div 
      variants={cardVariants} 
      initial="hidden" 
      animate="visible"
      className="h-100"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="h-100 position-relative overflow-hidden neu-card card-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="position-relative parallax-container" 
          style={{ height: '240px', overflow: 'hidden' }}
        >
          <motion.div
            animate={{
              x: imagePosition.x,
              y: imagePosition.y,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            style={{ height: '120%', width: '120%', marginLeft: '-10%', marginTop: '-10%' }}
          >
            <Card.Img
              variant="top"
              src={item.images?.[0] || 'https://via.placeholder.com/600x400?text=Antique+Item'}
              alt={`${item.title} preview`}
              style={{ 
                height: '100%', 
                width: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              className="card-image-hover"
            />
          </motion.div>
            
            <div className="position-absolute top-0 end-0 m-2">
              <Badge className="shadow-neu px-3 py-2">
                {item.category}
              </Badge>
            </div>
            {item.status === 'active' && (
              <div className="position-absolute top-0 start-0 m-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Badge bg="danger" className="shadow-neu px-3 py-2">
                    🔴 Live
                  </Badge>
                </motion.div>
              </div>
            )}
          </div>
          
          <Card.Body className="d-flex flex-column">
            <Card.Title className="fw-bold mb-2 text-gradient" style={{ minHeight: '3rem' }}>
              {item.title}
            </Card.Title>
            <Card.Text className="flex-grow-1 text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              {item.description.slice(0, 100)}...
            </Card.Text>
            
            <motion.div 
              variants={priceUpdateVariants} 
              initial="initial" 
              animate="animate" 
              className="mb-3"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted d-block mb-1">Current Bid</small>
                  <span className="price-display-small">{formatCurrency(item.currentPrice)}</span>
                </div>
                <Badge className="ms-2 fs-6 px-3 py-2 shadow-neu interactive-scale">
                  {item.totalBids} {item.totalBids === 1 ? 'bid' : 'bids'}
                </Badge>
              </div>
            </motion.div>
            
            <div className="mb-3">
              <small className="text-muted d-flex align-items-center">
                ⏰ Ends {formatDateTime(item.endTime)}
              </small>
            </div>
          </Card.Body>
          
          <Card.Footer className="bg-transparent border-0 pt-0 pb-3 px-3">
            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
              <Button 
                as={Link} 
                to={`/items/${item._id}`} 
                variant="primary" 
                className="w-100 fw-semibold btn-micro ripple"
              >
                View Auction Details
          </Button>
        </motion.div>
      </Card.Footer>
    </Card>
    </motion.div>
  );
};

export default ItemCard;