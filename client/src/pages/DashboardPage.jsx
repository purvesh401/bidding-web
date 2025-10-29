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
      <h1 className="h3 mb-4">Welcome back, {authUser.username}</h1>
      <Row className="g-4">
        <Col lg={4}>
          <Card>
            <Card.Header>Account Overview</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {authUser.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Role:</strong> <Badge bg="primary">{authUser.role}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Login:</strong> {authUser.lastLogin ? formatDateTime(authUser.lastLogin) : 'Not recorded'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card>
            <Card.Header>Live Auctions</Card.Header>
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
                <div className="text-muted">No active auctions at the moment.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {['seller', 'both'].includes(authUser.role) && (
        <Card className="mt-4">
          <Card.Header>My Listings</Card.Header>
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
              <div className="text-muted">You have not created any listings yet.</div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
