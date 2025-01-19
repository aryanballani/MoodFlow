import React from 'react';
import '../styles/card.css';

const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>{children}</div>
  );

export default Card;