/**
 * @file BidHistoryPage.jsx
 * @description Page showing user's complete bid history with filters and statistics.
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge, Form, Alert, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaGavel, FaTrophy, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';

/**
 * @component BidHistoryPage
 * @returns {JSX.Element}
 */
const BidHistoryPage = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    won: 0,
    lost: 0,
    outbid: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchBidHistory();
  }, []);

  useEffect(() => {
    filterBids();
  }, [bids, statusFilter]);

  const fetchBidHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bids/user/history');
      setBids(response.data.bids);
      calculateStats(response.data.bids);
    } catch (error) {
      toast.error('Failed to load bid history.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (bidData) => {
    const stats = {
      total: bidData.length,
      active: bidData.filter(b => b.bidStatus === 'active').length,
      won: bidData.filter(b => b.bidStatus === 'won').length,
      lost: bidData.filter(b => b.bidStatus === 'lost').length,
      outbid: bidData.filter(b => b.bidStatus === 'outbid').length,
      totalSpent: bidData
        .filter(b => b.bidStatus === 'won')
        .reduce((sum, b) => sum + b.bidAmount, 0)
    };
    setStats(stats);
  };

  const filterBids = () => {
    if (statusFilter === 'all') {
      setFilteredBids(bids);
    } else {
      setFilteredBids(bids.filter(bid => bid.bidStatus === statusFilter));
    }
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'won':
        return 'success';
      case 'active':
      case 'winning':
        return 'primary';
      case 'outbid':
        return 'warning';
      case 'lost':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won':
        return <FaTrophy className="me-1" />;
      case 'active':
      case 'winning':
        return <FaHourglassHalf className="me-1" />;
      case 'outbid':
        return <FaGavel className="me-1" />;
      case 'lost':
        return <FaTimesCircle className="me-1" />;
      default:
        return null;
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
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-2">
          <FaGavel className="me-2" />
          My Bid History
        </h1>
        <p className="text-muted lead">Track all your bidding activity</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Total Bids</div>
              <div className="h3 mb-0">{stats.total}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Active</div>
              <div className="h3 mb-0 text-primary">{stats.active}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Won</div>
              <div className="h3 mb-0 text-success">{stats.won}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Outbid</div>
              <div className="h3 mb-0 text-warning">{stats.outbid}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Lost</div>
              <div className="h3 mb-0 text-danger">{stats.lost}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold text-muted small mb-2">Total Spent</div>
              <div className="h5 mb-0 text-success">{formatCurrency(stats.totalSpent)}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Label className="mb-2 fw-semibold">Filter by Status:</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Bids ({stats.total})</option>
                <option value="active">Active ({stats.active})</option>
                <option value="winning">Winning</option>
                <option value="won">Won ({stats.won})</option>
                <option value="outbid">Outbid ({stats.outbid})</option>
                <option value="lost">Lost ({stats.lost})</option>
              </Form.Select>
            </Col>
            <Col md={8} className="text-end">
              <small className="text-muted">
                Showing {filteredBids.length} of {bids.length} bids
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bids Table */}
      {filteredBids.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <FaGavel size={48} className="mb-3 text-muted" />
          <h4>No bids found</h4>
          <p className="mb-0">
            {statusFilter === 'all'
              ? "You haven't placed any bids yet. Start bidding on items you're interested in!"
              : `You don't have any ${statusFilter} bids.`}
          </p>
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Item</th>
                    <th>Bid Amount</th>
                    <th>Status</th>
                    <th>Bid Time</th>
                    <th>Current Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBids.map((bid) => (
                    <tr key={bid._id}>
                      <td>
                        <div className="fw-semibold">{bid.itemId?.title || 'Unknown Item'}</div>
                        <small className="text-muted">{bid.itemId?.category}</small>
                      </td>
                      <td className="fw-bold">{formatCurrency(bid.bidAmount)}</td>
                      <td>
                        <Badge bg={getBadgeVariant(bid.bidStatus)} className="px-3 py-2">
                          {getStatusIcon(bid.bidStatus)}
                          {bid.bidStatus.charAt(0).toUpperCase() + bid.bidStatus.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        <small>{formatDateTime(bid.timestamp)}</small>
                      </td>
                      <td>
                        {bid.itemId?.currentPrice ? (
                          <span className="fw-semibold">{formatCurrency(bid.itemId.currentPrice)}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {bid.itemId?._id && (
                          <Button
                            as={Link}
                            to={`/items/${bid.itemId._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View Item
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default BidHistoryPage;
