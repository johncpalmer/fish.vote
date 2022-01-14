// Import state helpers
import vechain from "@state/vechain"
import governance from "@state/governance";
import assets from "@state/assets";
import tokenInfo from "@state/tokenInfo";

// Export state wrapper
export default function StateProvider({ children }) {
  return (
    <vechain.Provider>
      <tokenInfo.Provider>
         <governance.Provider>
          <assets.Provider>
                {children}
          </assets.Provider>
        </governance.Provider>
      </tokenInfo.Provider>
    </vechain.Provider>
  );
}
