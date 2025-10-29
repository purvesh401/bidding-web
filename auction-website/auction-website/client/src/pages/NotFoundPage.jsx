/**
 * @file NotFoundPage.jsx
 * @description Generic 404 page displayed for unknown routes.
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * @component NotFoundPage
 * @returns {JSX.Element}
 */
const NotFoundPage = () => (
  <div className="text-center py-5">
    <h1 className="display-5">404</h1>
    <p className="lead">The page you are looking for could not be found.</p>
    <Button as={Link} to="/" variant="primary">
      Return Home
    </Button>
  </div>
);

export default NotFoundPage;
