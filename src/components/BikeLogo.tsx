export default function BikeLogo({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#FF3131" />
      
      {/* Bike frame - geometric */}
      <g stroke="#000" strokeWidth="4" fill="none" strokeLinecap="square" strokeLinejoin="miter">
        {/* Rear wheel */}
        <circle cx="25" cy="70" r="18" />
        
        {/* Front wheel */}
        <circle cx="75" cy="70" r="18" />
        
        {/* Frame - diamond shape */}
        <path d="M25 70 L45 35 L75 70 L55 35 Z" />
        
        {/* Seat tube */}
        <line x1="45" y1="35" x2="40" y2="20" />
        
        {/* Handlebar */}
        <line x1="65" y1="25" x2="75" y2="25" />
        
        {/* Fork */}
        <line x1="75" y1="70" x2="65" y2="25" />
        
        {/* Crank */}
        <circle cx="50" cy="60" r="5" fill="#000" stroke="none" />
        <line x1="50" y1="60" x2="40" y2="20" strokeWidth="3" />
        
        {/* Seat */}
        <line x1="35" y1="20" x2="45" y2="20" strokeWidth="5" />
      </g>
      
      {/* Accent glow */}
      {animated && (
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="none" 
          stroke="#FF3131" 
          strokeWidth="2"
          opacity="0.5"
          style={{
            animation: 'pulse-glow 2s ease-in-out infinite',
            transformOrigin: 'center'
          }}
        />
      )}
    </svg>
  )
}
