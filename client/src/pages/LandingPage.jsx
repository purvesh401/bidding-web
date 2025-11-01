/**
 * @file LandingPage.jsx
 * @description Landing page with hero section and call-to-action for the auction platform.
 */

import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component LandingPage
 * @returns {JSX.Element}
 */
const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="display-3 fw-bold mb-4">Welcome to Antique Auction</h1>
            <p className="lead text-muted mb-5" style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>
              Discover rare antiques and collectibles. Bid in real-time on unique items from around the world.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Button as={Link} to="/auctions" size="lg" variant="primary" className="px-5 py-3">
                  Browse Auctions
                </Button>
              </motion.div>
              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Button as={Link} to="/register" size="lg" variant="outline-primary" className="px-5 py-3">
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Why Choose Us?</h2>
          <Row className="g-4">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-100 border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <div className="mb-3" style={{ fontSize: '3rem' }}>⚡</div>
                    <Card.Title className="fw-bold mb-3">Real-Time Bidding</Card.Title>
                    <Card.Text className="text-muted">
                      Experience live auction action with instant updates. See bids as they happen and never miss an opportunity.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-100 border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🔒</div>
                    <Card.Title className="fw-bold mb-3">Secure & Safe</Card.Title>
                    <Card.Text className="text-muted">
                      Your transactions and personal information are protected with industry-standard security measures.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="h-100 border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🎨</div>
                    <Card.Title className="fw-bold mb-3">Curated Collection</Card.Title>
                    <Card.Text className="text-muted">
                      Browse through carefully selected antiques, art, and collectibles from verified sellers worldwide.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ background: 'var(--bs-light)' }}>
        <Container>
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <Row className="g-4 align-items-center">
            <Col md={3} className="text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  1
                </div>
              </div>
              <h5 className="fw-bold">Sign Up</h5>
              <p className="text-muted">Create your free account in seconds</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  2
                </div>
              </div>
              <h5 className="fw-bold">Browse</h5>
              <p className="text-muted">Explore active auctions and find your favorites</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  3
                </div>
              </div>
              <h5 className="fw-bold">Bid</h5>
              <p className="text-muted">Place bids and compete in real-time</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  4
                </div>
              </div>
              <h5 className="fw-bold">Win</h5>
              <p className="text-muted">Win auctions and claim your treasures</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="fw-bold mb-4">Ready to Start Bidding?</h2>
            <p className="lead text-muted mb-4">Join thousands of collectors and find your next treasure today.</p>
            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap" className="d-inline-block">
              <Button as={Link} to="/auctions" size="lg" variant="primary" className="px-5 py-3">
                Explore Auctions Now
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
