// Import state helpers
import eth from "@state/eth";

// Export state wrapper
export default function StateProvider({ children }) {
  return <eth.Provider>{children}</eth.Provider>;
}
