import React from 'react';

export default function Spinner({ size = 5, className = '' }) {
  const sz = `${size}rem`;
  return (
    <svg
      className={`animate-spin inline-block ${className}`}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
    </svg>
  );
}
