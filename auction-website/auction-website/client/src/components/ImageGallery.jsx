/**
 * @file ImageGallery.jsx
 * @description Simple Bootstrap carousel that renders item images.
 */

import React from 'react';
import { Carousel, Image } from 'react-bootstrap';

/**
 * @component ImageGallery
 * @param {{ images: string[], title: string }} props - Component props.
 * @returns {JSX.Element}
 */
const ImageGallery = ({ images = [], title }) => {
  if (!images.length) {
    return <p className="text-muted">No images available for this item.</p>;
  }

  return (
    <Carousel variant="dark">
      {images.map((imageUrl, index) => (
        <Carousel.Item key={imageUrl}>
          <Image
            src={imageUrl}
            alt={`${title} preview ${index + 1}`}
            className="w-100"
            style={{ maxHeight: '420px', objectFit: 'cover' }}
            rounded
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageGallery;
