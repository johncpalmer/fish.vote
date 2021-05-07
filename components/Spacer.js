// Simple spacer that adds height between elements
export default function Spacer({ height }) {
  // Setup styling
  const heightStyles = {
    // Apply px height
    height: `${height}px`,
  };

  // Return applied spacer
  return <div style={heightStyles} />;
}
