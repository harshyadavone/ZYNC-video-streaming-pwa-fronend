const ZyncLogo = ({ width = 100, height = 40 }) => {
  const primaryColor = 'hsl(142.1, 76.2%, 36.3%)';

  return (
    <svg width={width} height={height} viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
      {/* Z */}
      <path d="M10 10 L25 10 L10 30 L25 30" stroke={primaryColor} strokeWidth="3" fill="none" />
      
      {/* Y */}
      <path d="M35 10 L42.5 20 L50 10 M42.5 20 L42.5 30" stroke={primaryColor} strokeWidth="3" fill="none" />
      
      {/* N */}
      <path d="M60 30 V10 L75 30 V10" stroke={primaryColor} strokeWidth="3" fill="none" />
      
      {/* C */}
      <path d="M95 20 A10 10 0 0 1 85 30 A10 10 0 0 1 85 10" stroke={primaryColor} strokeWidth="3" fill="none" />
    </svg>
  );
};

export default ZyncLogo;