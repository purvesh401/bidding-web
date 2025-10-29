/**
 * @file BidHistoryList.jsx
 * @description List component rendering bid history entries with animations.
 */

import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { listVariants, listItemVariants } from '../utils/animationVariants.js';
import { formatCurrency, formatDateTime } from '../utils/formatters.js';

/**
 * @component BidHistoryList
 * @param {{ bids: Array<Record<string, any>> }} props - Component props.
 * @returns {JSX.Element}
 */
const BidHistoryList = ({ bids }) => {
  if (!bids.length) {
    return <p className="text-muted">No bids have been placed yet.</p>;
  }

  return (
    <motion.div variants={listVariants} initial="hidden" animate="visible">
      <ListGroup>
        {bids.map((bid) => (
          <motion.div key={bid._id} variants={listItemVariants}>
            <ListGroup.Item className="d-flex justify-content-between align-items-center bid-history-item">
              <div>
                <strong>{bid.bidderId?.username || 'Anonymous Bidder'}</strong>
                <div className="text-muted small">{formatDateTime(bid.timestamp)}</div>
              </div>
              <span>{formatCurrency(bid.bidAmount)}</span>
            </ListGroup.Item>
          </motion.div>
        ))}
      </ListGroup>
    </motion.div>
  );
};

export default BidHistoryList;
