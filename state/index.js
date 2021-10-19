// Import state helpers
import vechain from "@state/vechain"
import governance from "@state/governance";

// Export state wrapper
export default function StateProvider({ children }) {
  return (
    <vechain.Provider>
      <governance.Provider>{children}</governance.Provider>
    </vechain.Provider>
  );
}
