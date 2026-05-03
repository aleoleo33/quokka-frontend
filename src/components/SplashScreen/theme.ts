export const SplashTheme = {
  colors: {
    background: '#FDFBF7',
    primary: '#A97458',
    text: '#333333',
    shadow: 'rgba(169, 116, 88, 0.3)',
  },
  animation: {
    easing: {
      smoothOut: [0.33, 1, 0.68, 1],
      springBounce: {
        damping: 14,
        stiffness: 90,
        mass: 0.8,
      },
    },
    durations: {
      fadeIn: 800,
      zoom: 2500,
      morph: 1000,
      textReveal: 1000,
      hold: 1800,
    },
  },
};
