// Import state helpers
import vechain from "@state/vechain";
import governance from "@state/governance";
import assets from "@state/assets";
import tokenInfo from "@state/tokenInfo";
import pairInfo from "@state/pairInfo";

// Export state wrapper
export default function StateProvider({ children }) {
  return (
    <vechain.Provider>
      <tokenInfo.Provider>
        <pairInfo.Provider>
          <governance.Provider>
            <assets.Provider>{children}</assets.Provider>
          </governance.Provider>
        </pairInfo.Provider>
      </tokenInfo.Provider>
    </vechain.Provider>
  );
}
