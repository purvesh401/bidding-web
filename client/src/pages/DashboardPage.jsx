/**
 * @file DashboardPage.jsx
 * @description Personalized dashboard showing user profile details and relevant auctions.
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth.js';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';

/**
 * @component DashboardPage
 * @returns {JSX.Element}
 */
const DashboardPage = () => {
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    /**
     * @function fetchItems
     * @description Retrieves auction items to drive dashboard summaries.
     * @returns {Promise<void>}
     */
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data.items);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const myListings = items.filter((item) => item.sellerId?._id === authUser._id);
  const activeAuctions = items.filter((item) => item.status === 'active');

  return (
    <div>
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-2">👋 Welcome back, {authUser.username}!</h1>
        <p className="text-muted lead">Here's your auction dashboard</p>
      </div>
      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="fw-bold">📊 Account Overview</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">📧 Email:</span>
                  <span className="text-muted">{authUser.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">🕐 Last Login:</span>
                  <span className="text-muted small">{authUser.lastLogin ? formatDateTime(authUser.lastLogin) : 'Not recorded'}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="fw-bold">🔥 Live Auctions</Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="d-flex justify-content-center py-3">
                  <LoadingSpinner />
                </div>
              ) : activeAuctions.length ? (
                <ListGroup>
                  {activeAuctions.map((item) => (
                    <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link to={`/items/${item._id}`}>{item.title}</Link>
                        <div className="text-muted small">Ends {formatDateTime(item.endTime)}</div>
                      </div>
                      <div className="text-end">
                        <div>{formatCurrency(item.currentPrice)}</div>
                        <div className="text-muted small">{item.totalBids} bids</div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🔥</div>
                  <p className="text-muted mb-0">No active auctions at the moment.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4 border-0 shadow-sm">
        <Card.Header className="fw-bold">📦 My Listings</Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="d-flex justify-content-center py-3">
              <LoadingSpinner />
            </div>
          ) : myListings.length ? (
            <ListGroup>
              {myListings.map((item) => (
                <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <Link to={`/items/${item._id}`}>{item.title}</Link>
                    <div className="text-muted small">Status: {item.status}</div>
                  </div>
                  <div className="text-end">
                    <div>{formatCurrency(item.currentPrice)}</div>
                    <div className="text-muted small">{item.totalBids} bids</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p className="text-muted mb-0">You have not created any listings yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardPage;
