/**
 * @file ItemDetailPage.jsx
 * @description Displays a detailed view of a single auction item with real-time bidding.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  ListGroup,
  Alert
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuth.js';
import { useSocket } from '../context/SocketContext.jsx';
import CountdownTimer from '../components/CountdownTimer.jsx';
import BidModal from '../components/BidModal.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import BidHistoryList from '../components/BidHistoryList.jsx';
import api from '../services/api.js';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';
import { priceUpdateVariants, buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component ItemDetailPage
 * @returns {JSX.Element}
 */
const ItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const { socket, isConnected } = useSocket();

  const [auctionItem, setAuctionItem] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!itemId) {
      toast.error('Invalid item identifier.');
      navigate('/');
      return;
    }

    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/items/${itemId}`);
        setAuctionItem(response.data.item);
        setBidHistory(response.data.recentBids);
        setBidAmountInput(
          String(response.data.item.currentPrice + response.data.item.bidIncrement)
        );
      } catch (error) {
        const message = error.response?.data?.message || 'Unable to load auction details.';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId, navigate]);

  useEffect(() => {
    if (!socket || !isConnected || !itemId) {
      return;
    }

    socket.emit('join-auction-room', itemId);

    const handleNewBidPlaced = (payload) => {
      setAuctionItem((previous) =>
        previous
          ? {
              ...previous,
              currentPrice: payload.newPrice,
              totalBids: payload.totalBids,
              bidIncrement: payload.bidIncrement,
              highestBidder: {
                _id: payload.bidderId,
                username: payload.bidderUsername
              },
              updatedAt: payload.timestamp
            }
          : previous
      );

      setBidHistory((previousHistory) => [
        {
          _id: payload.bidId,
          bidderId: { username: payload.bidderUsername },
          bidAmount: payload.newPrice,
          timestamp: payload.timestamp
        },
        ...previousHistory
      ]);

      if (authUser?.username !== payload.bidderUsername) {
        toast.info(`New bid placed by ${payload.bidderUsername}: ${formatCurrency(payload.newPrice)}`);
      }

  setBidAmountInput(String(payload.newPrice + payload.bidIncrement));
    };

    const handleAuctionEnded = (payload) => {
      setAuctionItem((previous) =>
        previous
          ? {
              ...previous,
              status: 'ended',
              isAuctionOver: true,
              winnerId: payload.winnerId,
              currentPrice: payload.finalPrice
            }
          : previous
      );
      toast.success('This auction has ended.');
    };

    socket.on('new-bid-placed', handleNewBidPlaced);
    socket.on('auction-ended', handleAuctionEnded);

    return () => {
      socket.off('new-bid-placed', handleNewBidPlaced);
      socket.off('auction-ended', handleAuctionEnded);
      socket.emit('leave-auction-room', itemId);
    };
  }, [socket, isConnected, itemId, authUser, auctionItem?.bidIncrement]);

  const minimumBid = useMemo(() => {
    if (!auctionItem) {
      return 0;
    }
    return auctionItem.currentPrice + auctionItem.bidIncrement;
  }, [auctionItem]);

  /**
   * @function handlePlaceBidClick
   * @description Opens the bid modal or redirects the user to login if unauthenticated.
   * @returns {void}
   */
  const handlePlaceBidClick = () => {
    if (!authUser) {
      toast.error('Please log in to place a bid.');
      navigate('/login');
      return;
    }

    setShowBidModal(true);
  };

  /**
   * @function handleBidSubmission
   * @description Submits the bid to the backend API and handles optimistic UI updates.
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   * @returns {Promise<void>}
   */
  const handleBidSubmission = async (event) => {
    event.preventDefault();
    if (!auctionItem) {
      toast.error('Auction item not loaded yet.');
      return;
    }

    const parsedBidAmount = Number(bidAmountInput);

    if (Number.isNaN(parsedBidAmount) || parsedBidAmount < minimumBid) {
      toast.error(`Minimum bid is ${formatCurrency(minimumBid)}.`);
      return;
    }

    try {
      setIsSubmittingBid(true);
      await api.post('/bids', {
        itemId,
        bidAmount: parsedBidAmount
      });
      toast.success('Bid submitted successfully.');
      setShowBidModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to place bid.';
      toast.error(message);
      if (error.response?.status === 400) {
        setBidAmountInput(String(minimumBid));
      }
    } finally {
      setIsSubmittingBid(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (errorMessage || !auctionItem) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{errorMessage || 'Auction item not found.'}</Alert>
      </Container>
    );
  }

  const isSeller = authUser && auctionItem.sellerId?._id === authUser._id;
  const hasAuctionEnded = auctionItem.isAuctionOver || auctionItem.status === 'ended';

  return (
    <Container>
      <Row className="g-4">
        <Col lg={7}>
          <ImageGallery images={auctionItem.images} title={auctionItem.title} />
        </Col>
        <Col lg={5}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <Card.Title>{auctionItem.title}</Card.Title>
                  <Badge bg="secondary" className="me-2">
                    {auctionItem.category}
                  </Badge>
                  <Badge bg="info">{auctionItem.condition}</Badge>
                </div>
                {hasAuctionEnded && <Badge bg="dark">Auction Ended</Badge>}
              </div>

              <Card.Text>{auctionItem.description}</Card.Text>

              <motion.div variants={priceUpdateVariants} initial="initial" animate="animate" className="mb-3">
                <h2 className="price-display">{formatCurrency(auctionItem.currentPrice)}</h2>
                <div className="text-muted small">Current Price</div>
              </motion.div>

              <div className="mb-3">
                <strong>Total Bids:</strong> {auctionItem.totalBids}
              </div>

              <div className="mb-3">
                <strong>Bid Increment:</strong> {formatCurrency(auctionItem.bidIncrement)}
              </div>

              <div className="mb-3">
                <CountdownTimer endTime={auctionItem.endTime} onAuctionEnd={() => toast.info('Auction ended.')} />
              </div>

              {!hasAuctionEnded && !isSeller && (
                <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                  <Button className="w-100" onClick={handlePlaceBidClick}>
                    Place a Bid
                  </Button>
                </motion.div>
              )}

              {isSeller && (
                <Alert variant="info" className="mt-3">
                  Sellers cannot place bids on their own items.
                </Alert>
              )}

              {hasAuctionEnded && auctionItem.winnerId && (
                <Alert variant="success" className="mt-3">
                  Auction won by bidder ID {auctionItem.winnerId} at {formatCurrency(auctionItem.currentPrice)}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col lg={7}>
          <Card>
            <Card.Header>Bid History</Card.Header>
            <Card.Body>
              <BidHistoryList bids={bidHistory} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card>
            <Card.Header>Item Details</Card.Header>
            <Card.Body>
              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <th scope="row">Seller</th>
                    <td>{auctionItem.sellerId?.username || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Starting Price</th>
                    <td>{formatCurrency(auctionItem.startingPrice)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Reserve Price</th>
                    <td>{auctionItem.reservePrice ? formatCurrency(auctionItem.reservePrice) : 'Not Set'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Start Time</th>
                    <td>{formatDateTime(auctionItem.startTime)}</td>
                  </tr>
                  <tr>
                    <th scope="row">End Time</th>
                    <td>{formatDateTime(auctionItem.endTime)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Views</th>
                    <td>{auctionItem.viewCount}</td>
                  </tr>
                </tbody>
              </Table>

              {auctionItem.dimensions && (
                <ListGroup className="mt-3">
                  <ListGroup.Item className="fw-semibold">Dimensions</ListGroup.Item>
                  <ListGroup.Item>
                    Height: {auctionItem.dimensions.height ?? '—'} {auctionItem.dimensions.unit}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Width: {auctionItem.dimensions.width ?? '—'} {auctionItem.dimensions.unit}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Depth: {auctionItem.dimensions.depth ?? '—'} {auctionItem.dimensions.unit}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Weight: {auctionItem.dimensions.weight ?? '—'} {auctionItem.dimensions.unit}
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <BidModal
        show={showBidModal}
        onHide={() => setShowBidModal(false)}
        bidAmount={bidAmountInput}
        onBidAmountChange={setBidAmountInput}
        onSubmit={handleBidSubmission}
        minimumBidDisplay={minimumBid}
        isSubmitting={isSubmittingBid}
      />
    </Container>
  );
};

export default ItemDetailPage;
