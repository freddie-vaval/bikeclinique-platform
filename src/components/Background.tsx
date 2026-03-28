'use client'

import { ReactNode } from 'react'

interface BackgroundProps {
  children: ReactNode
  variant?: 'default' | 'grid' | 'dots' | 'lines'
}

export default function Background({ children, variant = 'default' }: BackgroundProps) {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]" />
      
      {/* Grid pattern */}
      {variant === 'grid' && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(42,42,42,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(42,42,42,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      )}
      
      {/* Dots pattern */}
      {variant === 'dots' && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,49,49,0.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      )}
      
      {/* Lines pattern */}
      {variant === 'lines' && (
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #FF3131 2px,
              #FF3131 4px
            )`
          }}
        />
      )}
      
      {/* Glowing orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF3131] rounded-full blur-[250px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#39FF14] rounded-full blur-[180px] opacity-8 pointer-events-none" />
      
      {/* Center line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF3131] to-transparent opacity-20" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Pattern component for cards
export function CardPattern({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF3131] opacity-50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF3131] opacity-50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF3131] opacity-50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF3131] opacity-50" />
      
      {/* Diagonal stripe pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #FF3131 10px,
            #FF3131 11px
          )`
        }}
      />
      
      {children}
    </div>
  )
}

// Animated border component
export function AnimatedBorder({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'linear-gradient(90deg, transparent, #FF3131, transparent)',
          backgroundSize: '200% 100%',
          animation: 'border-dance 2s linear infinite'
        }}
      />
      <div className="relative bg-[#141414]">
        {children}
      </div>
    </div>
  )
}
