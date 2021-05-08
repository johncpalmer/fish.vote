// Import state helpers
import eth from "@state/eth";
import governance from "@state/governance";

// Export state wrapper
export default function StateProvider({ children }) {
  return (
    <eth.Provider>
      <governance.Provider>{children}</governance.Provider>
    </eth.Provider>
  );
}
