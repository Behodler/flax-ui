declare module '*.png';
declare module '*.jpg';  // Add other image formats as needed
declare module '*.svg';

declare module '*.mp3' {
    const src: string;
    export default src;
  }