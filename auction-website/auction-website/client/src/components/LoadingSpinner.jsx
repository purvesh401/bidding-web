/**
 * @file LoadingSpinner.jsx
 * @description Lightweight spinner component used across the UI for loading states.
 */

import React from 'react';

/**
 * @component LoadingSpinner
 * @returns {JSX.Element}
 */
const LoadingSpinner = () => (
  <div className="loading-spinner" role="status" aria-label="Loading content" />
);

export default LoadingSpinner;
