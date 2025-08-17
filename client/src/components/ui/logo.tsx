import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  logoOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', logoOnly = false }) => {
  const sizes = {
    sm: { icon: 20, text: 16 },
    md: { icon: 28, text: 18 },
    lg: { icon: 32, text: 20 }
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Teal circle with network node */}
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 32 32" 
        className="flex-shrink-0"
        aria-label="Nodal logo icon"
      >
        {/* Teal background circle */}
        <circle 
          cx="16" 
          cy="16" 
          r="16" 
          fill="currentColor" 
          className="text-primary"
        />
        
        {/* Central node (white) */}
        <circle 
          cx="16" 
          cy="16" 
          r="3" 
          fill="white"
        />
        
        {/* Four connecting nodes (white) */}
        <circle 
          cx="16" 
          cy="8" 
          r="2" 
          fill="white"
        />
        <circle 
          cx="24" 
          cy="16" 
          r="2" 
          fill="white"
        />
        <circle 
          cx="16" 
          cy="24" 
          r="2" 
          fill="white"
        />
        <circle 
          cx="8" 
          cy="16" 
          r="2" 
          fill="white"
        />
        
        {/* Connection lines (white) */}
        <line 
          x1="16" 
          y1="10" 
          x2="16" 
          y2="14" 
          stroke="white" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line 
          x1="18" 
          y1="16" 
          x2="22" 
          y2="16" 
          stroke="white" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line 
          x1="16" 
          y1="18" 
          x2="16" 
          y2="22" 
          stroke="white" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line 
          x1="14" 
          y1="16" 
          x2="10" 
          y2="16" 
          stroke="white" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Wordmark - only show if not logoOnly */}
      {!logoOnly && (
        <span className="font-display font-semibold text-ink text-lg">
          Nodal
        </span>
      )}
    </div>
  );
};
