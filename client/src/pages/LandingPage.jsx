/**
 * @file LandingPage.jsx
 * @description Modern landing page with Lottie animations, neumorphism, and glassmorphism design
 */

import React, { useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaBolt, FaShieldAlt, FaPalette, FaHammer, FaChartLine, FaCrown, FaRocket, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { buttonHoverVariants } from '../utils/animationVariants.js';

/**
 * @component LandingPage
 * @returns {JSX.Element}
 */
const LandingPage = () => {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  // Lottie animation data (using online CDN URLs as placeholders)
  const auctionAnimation = {
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/4db68bbd-31f4-4ca5-be51-81fb07ead3c0/jQpGDbrtLj.json'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div>
      {/* Hero Section with Glassmorphism */}
      <section className="py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          background: 'var(--background-gradient)',
          zIndex: -1
        }} />
        
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-5 mb-lg-0"
              >
                <div className="glass-card p-5">
                  <motion.h1 
                    className="display-2 fw-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Discover Rare Treasures
                  </motion.h1>
                  <motion.p 
                    className="lead mb-4" 
                    style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Join the most sophisticated antique auction platform. Bid in real-time on unique collectibles from verified sellers worldwide.
                  </motion.p>
                  
                  <motion.div 
                    className="d-flex gap-3 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        as={Link} 
                        to="/auctions" 
                        size="lg" 
                        className="btn-primary btn-micro px-5 py-3 glow-on-hover"
                      >
                        <FaRocket className="me-2" />
                        Browse Auctions
                      </Button>
                    </motion.div>
                    <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        as={Link} 
                        to="/register" 
                        size="lg" 
                        className="neu-button px-5 py-3"
                      >
                        Get Started Free
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Stats Row */}
                  <Row className="mt-5 g-4">
                    <Col xs={4}>
                      <div className="text-center">
                        <h3 className="text-gradient fw-bold mb-0">10K+</h3>
                        <small className="text-muted">Active Users</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="text-center">
                        <h3 className="text-gradient fw-bold mb-0">500+</h3>
                        <small className="text-muted">Daily Auctions</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="text-center">
                        <h3 className="text-gradient fw-bold mb-0">$2M+</h3>
                        <small className="text-muted">Items Sold</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="float-animation"
              >
                <div className="position-relative">
                  {/* Placeholder for Lottie - using icon as fallback */}
                  <div className="text-center p-5 neu-card">
                    <FaHammer style={{ fontSize: '15rem', opacity: 0.3 }} className="text-gradient" />
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section with Neumorphism */}
      <section className="py-5" ref={featuresRef}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-4 fw-bold mb-3">Why Choose Our Platform?</h2>
            <p className="lead text-muted">Experience the future of online auctions with cutting-edge technology</p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            <Row className="g-4">
              <Col md={4}>
                <motion.div variants={itemVariants}>
                  <div className="neu-card text-center h-100 interactive-scale">
                    <div className="mb-4">
                      <div className="d-inline-flex align-items-center justify-content-center" 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          background: 'var(--primary-gradient)'
                        }}>
                        <FaBolt style={{ fontSize: '2.5rem', color: 'var(--text-inverse)' }} />
                      </div>
                    </div>
                    <h4 className="fw-bold mb-3">Lightning Fast</h4>
                    <p className="text-muted">
                      Experience real-time bidding with instant updates. Never miss a bid with our websocket technology.
                    </p>
                  </div>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div variants={itemVariants}>
                  <div className="neu-card text-center h-100 interactive-scale">
                    <div className="mb-4">
                      <div className="d-inline-flex align-items-center justify-content-center" 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          background: 'var(--success-gradient)'
                        }}>
                        <FaShieldAlt style={{ fontSize: '2.5rem', color: 'var(--text-inverse)' }} />
                      </div>
                    </div>
                    <h4 className="fw-bold mb-3">Secure & Trusted</h4>
                    <p className="text-muted">
                      Bank-level encryption protects your data. Every seller is verified for authenticity and reliability.
                    </p>
                  </div>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div variants={itemVariants}>
                  <div className="neu-card text-center h-100 interactive-scale">
                    <div className="mb-4">
                      <div className="d-inline-flex align-items-center justify-content-center" 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          background: 'var(--warning-gradient)'
                        }}>
                        <FaPalette style={{ fontSize: '2.5rem', color: 'var(--text-inverse)' }} />
                      </div>
                    </div>
                    <h4 className="fw-bold mb-3">Premium Selection</h4>
                    <p className="text-muted">
                      Curated collection of rare antiques, fine art, and exclusive collectibles from around the world.
                    </p>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* How It Works Section with Cards */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-4 fw-bold mb-3">How It Works</h2>
            <p className="lead text-muted">Get started in 4 simple steps</p>
          </motion.div>
          
          <Row className="g-4">
            {[
              { num: 1, icon: FaUsers, title: 'Sign Up', desc: 'Create your free account in under 30 seconds. No credit card required.' },
              { num: 2, icon: FaChartLine, title: 'Explore', desc: 'Browse thousands of live auctions. Use filters to find exactly what you want.' },
              { num: 3, icon: FaHammer, title: 'Place Bids', desc: 'Bid in real-time with our intuitive interface. Set auto-bids to never miss out.' },
              { num: 4, icon: FaCrown, title: 'Win & Collect', desc: 'Win your auction and receive your treasures. Secure payment and shipping.' }
            ].map((step, idx) => (
              <Col md={6} lg={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="glass-card text-center h-100 ripple">
                    <div className="mb-3">
                      <div 
                        className="d-inline-flex align-items-center justify-content-center position-relative" 
                        style={{ 
                          width: '70px', 
                          height: '70px', 
                          borderRadius: '50%',
                          background: 'var(--primary-gradient)',
                          boxShadow: 'var(--neu-flat)'
                        }}
                      >
                        <step.icon style={{ fontSize: '2rem', color: 'var(--text-inverse)' }} />
                        <div 
                          className="position-absolute top-0 end-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-color)' }}
                        >
                          {step.num}
                        </div>
                      </div>
                    </div>
                    <h5 className="fw-bold mb-2">{step.title}</h5>
                    <p className="text-muted small">{step.desc}</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-5" ref={statsRef}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={statsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="neu-card p-5">
                  <h2 className="display-5 fw-bold mb-4">Built for Collectors, By Collectors</h2>
                  <p className="lead text-muted mb-4">
                    We understand the passion behind collecting. That's why we've created the ultimate platform for auction enthusiasts.
                  </p>
                  
                  <div className="mb-3 d-flex align-items-start">
                    <FaCheckCircle className="text-gradient me-3 mt-1" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <h5 className="fw-bold mb-1">Verified Authenticity</h5>
                      <p className="text-muted mb-0">Every item is authenticated by experts</p>
                    </div>
                  </div>
                  
                  <div className="mb-3 d-flex align-items-start">
                    <FaCheckCircle className="text-gradient me-3 mt-1" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <h5 className="fw-bold mb-1">Global Marketplace</h5>
                      <p className="text-muted mb-0">Connect with collectors from 100+ countries</p>
                    </div>
                  </div>
                  
                  <div className="mb-3 d-flex align-items-start">
                    <FaCheckCircle className="text-gradient me-3 mt-1" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <h5 className="fw-bold mb-1">24/7 Support</h5>
                      <p className="text-muted mb-0">Expert assistance whenever you need it</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={statsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Row className="g-4">
                  {[
                    { value: '98%', label: 'Customer Satisfaction', color: 'var(--success-gradient)' },
                    { value: '24/7', label: 'Live Auctions', color: 'var(--primary-gradient)' },
                    { value: '150+', label: 'Countries Served', color: 'var(--warning-gradient)' },
                    { value: '100K+', label: 'Items Sold Monthly', color: 'var(--danger-gradient)' }
                  ].map((stat, idx) => (
                    <Col xs={6} key={idx}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                      >
                        <div className="glass-card text-center p-4 interactive-scale">
                          <h2 className="fw-bold mb-2" style={{ 
                            background: stat.color,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '3rem'
                          }}>
                            {stat.value}
                          </h2>
                          <p className="text-muted mb-0 small fw-semibold">{stat.label}</p>
                        </div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="neu-card text-center p-5" style={{ 
              background: 'var(--primary-gradient)',
              color: 'var(--text-inverse)'
            }}>
              <motion.h2 
                className="display-4 fw-bold mb-4"
                style={{ color: 'var(--text-inverse)' }}
              >
                Ready to Start Your Collection?
              </motion.h2>
              <p className="lead mb-4" style={{ color: 'var(--text-inverse)', opacity: 0.9, fontSize: '1.3rem' }}>
                Join thousands of collectors who have already discovered their treasures
              </p>
              <motion.div 
                variants={buttonHoverVariants} 
                whileHover="hover" 
                whileTap="tap"
                className="d-inline-block"
              >
                <Button 
                  as={Link} 
                  to="/auctions" 
                  size="lg" 
                  variant="light"
                  className="px-5 py-3 btn-micro"
                  style={{ fontWeight: 700 }}
                >
                  <FaRocket className="me-2" />
                  Explore Live Auctions
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
