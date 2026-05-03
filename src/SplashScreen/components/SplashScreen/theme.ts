export const SplashTheme = {
  colors: {
    background: '#FDFBF7', // Soft beige
    primary: '#A97458', // Warm brown
    text: '#333333',
    shadow: 'rgba(169, 116, 88, 0.3)',
  },
  animation: {
    // Apple-style smooth cubic beziers
    easing: {
      smoothOut: [0.25, 0.1, 0.25, 1],
      springBounce: {
        damping: 12,
        stiffness: 100,
        mass: 0.5,
      },
    },
    durations: {
      fadeIn: 600,
      zoom: 1200,
      morph: 800,
      textReveal: 800,
      hold: 1500,
    },
  },
};
