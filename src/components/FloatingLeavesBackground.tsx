import React from 'react';
import { useMotion } from '../context/MotionContext';

interface FallingLeafConfig {
  id: number;
  left: string;
  className: string;
  size: number;
  opacity: number;
  color: string;
  variant: 'leaf' | 'branch';
}

const FALLING_LEAVES: FallingLeafConfig[] = [
  {
    id: 1,
    left: '6%',
    className: 'falling-leaf-1',
    size: 40,
    opacity: 0.74,
    color: '#2D6A4F',
    variant: 'branch',
  },
  {
    id: 2,
    left: '27%',
    className: 'falling-leaf-2',
    size: 34,
    opacity: 0.68,
    color: '#1B4332',
    variant: 'leaf',
  },
  {
    id: 3,
    left: '52%',
    className: 'falling-leaf-3',
    size: 42,
    opacity: 0.72,
    color: '#40916C',
    variant: 'branch',
  },
  {
    id: 4,
    left: '72%',
    className: 'falling-leaf-4',
    size: 35,
    opacity: 0.68,
    color: '#2D6A4F',
    variant: 'leaf',
  },
  {
    id: 5,
    left: '84%',
    className: 'falling-leaf-5',
    size: 38,
    opacity: 0.7,
    color: '#15803D',
    variant: 'branch',
  },
];

/**
 * Full-Viewport Continuous Falling Leaves & Botanical Sprig Branches Overlay
 *
 * - Fixed across the viewport strictly below the navbar (z-30, top-16 sm:top-18).
 * - Renders on BOTH laptop and mobile screens unless Calm Mode / prefers-reduced-motion is active.
 */
export const FloatingLeavesBackground: React.FC = () => {
  const { calmMode } = useMotion();
  if (calmMode) return null;

  return (
    <div
      className="fixed inset-x-0 top-16 sm:top-18 bottom-0 z-30 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {FALLING_LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className={`falling-leaf-lane ${leaf.className} absolute top-0 pointer-events-none will-change-transform`}
          style={{ left: leaf.left }}
        >
          <div className="falling-leaf-interactive">
            {leaf.variant === 'branch' ? (
              <svg
                width={leaf.size + 8}
                height={leaf.size + 8}
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="falling-leaf-svg"
                style={{ opacity: leaf.opacity }}
              >
                {/* Curved botanical twig stem */}
                <path
                  d="M10 48 C18 34, 28 24, 46 10"
                  stroke="#14532d"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Left leaf */}
                <path
                  className="falling-leaf-path"
                  d="M24 32 C12 28, 10 16, 18 14 C26 18, 28 26, 24 32 Z"
                  fill={leaf.color}
                />
                {/* Right leaf */}
                <path
                  className="falling-leaf-path"
                  d="M32 24 C44 24, 48 34, 40 38 C34 35, 32 29, 32 24 Z"
                  fill={leaf.color}
                />
                {/* Tip leaf */}
                <path
                  className="falling-leaf-path"
                  d="M46 10 C42 2, 52 2, 54 10 C50 14, 46 14, 46 10 Z"
                  fill="#16a34a"
                />
              </svg>
            ) : (
              <svg
                width={leaf.size}
                height={leaf.size}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="falling-leaf-svg"
                style={{ opacity: leaf.opacity }}
              >
                <path
                  className="falling-leaf-path"
                  d="M24 2C24 2 13 10 10 22C7 34 16 44 24 46C32 44 41 34 38 22C35 10 24 2 24 2Z"
                  fill={leaf.color}
                />
                <path
                  d="M24 6V44"
                  stroke="#faf8f2"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeOpacity="0.88"
                />
                <path
                  d="M24 16L16 12M24 22L13 18M24 28L15 25M24 34L17 32M24 16L32 12M24 22L35 18M24 28L33 25M24 34L31 32"
                  stroke="#faf8f2"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeOpacity="0.72"
                />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
