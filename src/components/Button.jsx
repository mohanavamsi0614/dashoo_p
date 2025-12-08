import React from 'react';
import Spinner from './Spinner';

export default function Button({ children, onClick, type = 'button', variant = 'primary', loading = false, className = '', ...props }) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || props.disabled}
      className={`${base} ${className} ${loading ? 'opacity-80 cursor-wait' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="-ml-1 mr-2 h-4 w-4 align-middle" />
          <span className="align-middle">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
