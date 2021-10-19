import matrix from 'matrix-js-sdk';

declare global {
  interface Window {
    matrixcs: typeof matrix    
  }
}
