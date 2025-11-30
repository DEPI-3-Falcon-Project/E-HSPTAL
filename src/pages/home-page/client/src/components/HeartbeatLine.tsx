import React from 'react';
import './HeartbeatLine.css';

interface HeartbeatLineProps {
  className?: string;
  color?: string;
  width?: string;
  height?: string;
}

const HeartbeatLine: React.FC<HeartbeatLineProps> = ({ 
  className = '', 
  color = '#ef4444',
  width = '100%',
  height = '60px'
}) => {
  return (
    <div className={`heartbeat-container ${className}`} style={{ width, height }}>
      <svg 
        className="heartbeat-line" 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 100" 
        preserveAspectRatio="none"
      >
        <path
          className="heartbeat-path"
          d="M0,50 L80,50 L90,30 L100,70 L110,15 L120,85 L130,50 L180,50 L190,35 L200,65 L210,20 L220,80 L230,50 L280,50 L290,40 L300,60 L310,25 L320,75 L330,50 L400,50 L410,30 L420,70 L430,10 L440,90 L450,50 L520,50 L530,35 L540,65 L550,20 L560,80 L570,50 L650,50 L660,40 L670,60 L680,25 L690,75 L700,50 L800,50"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* خط النبضة المتحرك */}
        <path
          className="heartbeat-pulse"
          d="M0,50 L80,50 L90,30 L100,70 L110,15 L120,85 L130,50 L180,50 L190,35 L200,65 L210,20 L220,80 L230,50 L280,50 L290,40 L300,60 L310,25 L320,75 L330,50 L400,50 L410,30 L420,70 L430,10 L440,90 L450,50 L520,50 L530,35 L540,65 L550,20 L560,80 L570,50 L650,50 L660,40 L670,60 L680,25 L690,75 L700,50 L800,50"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        
        {/* نقطة متحركة */}
        <circle
          className="heartbeat-dot"
          r="4"
          fill={color}
          opacity="0.9"
        >
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href="#heartbeat-path"/>
          </animateMotion>
        </circle>
        
        {/* تعريف المسار للنقطة المتحركة */}
        <defs>
          <path 
            id="heartbeat-path" 
            d="M0,50 L80,50 L90,30 L100,70 L110,15 L120,85 L130,50 L180,50 L190,35 L200,65 L210,20 L220,80 L230,50 L280,50 L290,40 L300,60 L310,25 L320,75 L330,50 L400,50 L410,30 L420,70 L430,10 L440,90 L450,50 L520,50 L530,35 L540,65 L550,20 L560,80 L570,50 L650,50 L660,40 L670,60 L680,25 L690,75 L700,50 L800,50"
          />
        </defs>
      </svg>
      
      {/* خطوط شبكية خفيفة في الخلفية */}
      <div className="heartbeat-grid"></div>
    </div>
  );
};

export default HeartbeatLine;
