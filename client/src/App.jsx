/**
 * @file App.jsx
 * @description Root React component defining application layout and routes.
 */

import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage.jsx';
import AuctionsPage from './pages/AuctionsPage.jsx';
import ItemDetailPage from './pages/ItemDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateListing from './pages/CreateListing.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthContext } from './hooks/useAuth.js';
import { pageTransitionVariants } from './utils/animationVariants.js';

/**
 * @description Application shell containing navigation and animated route transitions.
 * Routes are defined to demonstrate authentication and seller-specific functionality.
 * The instructor can easily add or modify routes during a live session.
 */
const App = () => {
  const { authUser, logout } = useAuthContext();
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            Antique Auction
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="align-items-center gap-2">
              <Nav.Link as={Link} to="/" className="fw-semibold">Home</Nav.Link>
              <Nav.Link as={Link} to="/auctions" className="fw-semibold">Auctions</Nav.Link>
              {authUser && (
                <>
                  <Nav.Link as={Link} to="/dashboard" className="fw-semibold">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/create-listing" className="fw-semibold">Create Listing</Nav.Link>
                  <Nav.Link as={Link} to="/profile" className="fw-semibold">Profile</Nav.Link>
                </>
              )}
              {authUser ? (
                <Button variant="outline-danger" onClick={logout} size="sm" className="ms-2">
                  Logout
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button as={Link} to="/login" variant="primary" size="sm">
                    Login
                  </Button>
                  <Button as={Link} to="/register" variant="secondary" size="sm">
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 py-4">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={(
                <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                  <LandingPage />
                </motion.div>
              )}
            />
            <Route
              path="/auctions"
              element={(
                <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                  <AuctionsPage />
                </motion.div>
              )}
            />
            <Route
              path="/login"
              element={authUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={authUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
            />
            <Route
              path="/items/:itemId"
              element={(
                <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                  <ItemDetailPage />
                </motion.div>
              )}
            />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                    <DashboardPage />
                  </motion.div>
                </ProtectedRoute>
              )}
            />
            <Route
              path="/create-listing"
              element={(
                <ProtectedRoute>
                  <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                    <CreateListing />
                  </motion.div>
                </ProtectedRoute>
              )}
            />
            <Route
              path="/profile"
              element={(
                <ProtectedRoute>
                  <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                    <ProfilePage />
                  </motion.div>
                </ProtectedRoute>
              )}
            />
            <Route
              path="*"
              element={(
                <motion.div variants={pageTransitionVariants} initial="hidden" animate="visible" exit="exit">
                  <NotFoundPage />
                </motion.div>
              )}
            />
          </Routes>
        </AnimatePresence>
      </Container>

      <footer className="bg-light py-3 mt-auto border-top">
        <Container className="text-center text-muted small">
          &copy; {new Date().getFullYear()} Antique Auction Platform. All rights reserved.
        </Container>
      </footer>
    </div>
  );
};

export default App;
