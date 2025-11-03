/**
 * @file WatchlistPage.jsx
 * @description User's watchlist/favorites page showing saved auction items.
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaHeart, FaTrash } from 'react-icons/fa';
import api from '../services/api.js';
import ItemCard from '../components/ItemCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * @component WatchlistPage
 * @returns {JSX.Element}
 */
const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/watchlist');
      setWatchlist(response.data.watchlist);
    } catch (error) {
      toast.error('Failed to load watchlist.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (itemId) => {
    try {
      await api.delete(`/watchlist/${itemId}`);
      setWatchlist(watchlist.filter(item => item._id !== itemId));
      toast.success('Item removed from watchlist.');
    } catch (error) {
      toast.error('Failed to remove item from watchlist.');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-6 fw-bold mb-2">
            <FaHeart className="me-2 text-danger" />
            My Watchlist
          </h1>
          <p className="text-muted lead">Track your favorite auction items</p>
        </div>
        <Badge bg="primary" className="fs-6 px-3 py-2">
          {watchlist.length} {watchlist.length === 1 ? 'Item' : 'Items'}
        </Badge>
      </div>

      {watchlist.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <FaHeart size={48} className="mb-3 text-muted" />
          <h4>Your watchlist is empty</h4>
          <p className="mb-0">Start adding items you're interested in to keep track of them!</p>
        </Alert>
      ) : (
        <Row className="g-4">
          {watchlist.map((item) => (
            <Col key={item._id} xs={12} md={6} lg={4}>
              <div className="position-relative">
                <ItemCard item={item} />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoveFromWatchlist(item._id)}
                  style={{ zIndex: 10 }}
                >
                  <FaTrash />
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WatchlistPage;
