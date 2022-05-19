import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import axios from "axios";
import { MAINNET, VEX_CONSTANTS } from "@utils/constants";

function usePairInfo() {
  const [pairs, setPairs] = useState({});

  useEffect(async () => {
    const result = (await axios.get("https://api.vexchange.io/v1/pairs")).data;
    setPairs(result);
  }, []);

  return {
    pairs,
  };
}

// Create unstated-next container
const pairInfo = createContainer(usePairInfo);
export default pairInfo;
