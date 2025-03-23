import { keyframes } from '@mantine/styles';

/** Fade in from 0 → 1 opacity and move upwards by {amount} */
export const fadeUp = (amount = 10) => keyframes`
  from {
    opacity: 0;
    transform: translateY(${amount}px);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

/** Fade out from 1 → 0 opacity and move downwards by {amount} */
export const fadeDown = (amount = 10) => keyframes`
  from {
    opacity: 0;
    transform: translateY(-${amount}px);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

/** Fade in from 0 → 1 opacity and move leftwards by {amount} */
export const fadeRight = (amount = 10) => keyframes`
  from {
    opacity: 0;
    transform: translateX(${amount}px);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

/** Fade in from 0 → 1 opacity and move rightwards by {amount} */
export const fadeLeft = (amount = 10) => keyframes`
  from {
    opacity: 0;
    transform: translateX(-${amount}px);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

/** Fade in from 0 → {opacity} */
export const fadeIn = (opacity = 1) => keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: ${opacity};
  }
`;

/** Fade out from 1 → {opacity} */
export const fadeOut = (opacity = 0) => keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: ${opacity};
  }
`;
