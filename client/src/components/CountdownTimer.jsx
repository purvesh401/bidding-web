/**
 * @file CountdownTimer.jsx
 * @description Displays a live countdown until a target end time. Emits a callback when the
 * countdown finishes and updates styling to reflect urgency.
 */

import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

/**
 * @typedef CountdownState
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 * @property {boolean} isExpired
 */

/**
 * @component CountdownTimer
 * @param {{ endTime: string|Date, onAuctionEnd?: () => void }} props - Component props.
 * @returns {JSX.Element}
 */
const CountdownTimer = ({ endTime, onAuctionEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const target = new Date(endTime).getTime();
      const diffInMs = target - now;

      if (diffInMs <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onAuctionEnd?.();
        return;
      }

      const seconds = Math.floor((diffInMs / 1000) % 60);
      const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      setTimeRemaining({ days, hours, minutes, seconds, isExpired: false });
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [endTime, onAuctionEnd]);

  const formatTimeDisplay = () => {
    const { days, hours, minutes, seconds, isExpired } = timeRemaining;

    if (isExpired) {
      return 'Auction Ended';
    }

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  };

  const getBadgeVariant = () => {
    const { days, hours, minutes, isExpired } = timeRemaining;

    if (isExpired) {
      return 'secondary';
    }

    if (days === 0 && hours === 0 && minutes < 60) {
      return 'danger';
    }

    if (days === 0 && hours < 6) {
      return 'warning';
    }

    return 'success';
  };

  const shouldPulse = () => {
    const { days, hours, minutes, isExpired } = timeRemaining;
    return !isExpired && days === 0 && hours === 0 && minutes < 10;
  };

  return (
    <motion.div animate={shouldPulse() ? { scale: [1, 1.03, 1] } : undefined} transition={{ repeat: Infinity, duration: 1.2 }}>
      <Badge bg={getBadgeVariant()} className={shouldPulse() ? 'countdown-urgent' : ''} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
        {formatTimeDisplay()}
      </Badge>
    </motion.div>
  );
};

export default CountdownTimer;
