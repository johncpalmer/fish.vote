<img src="https://vote.vexchange.io/vectors/logo-mobile.svg" alt="Vote.vexchange logo" width="50" />

# Vote.vexchange

Vote.vexchange is an app where anyone can create Crowd Proposals on VEX governance. When a proposal gains 10 million delegate votes, it is converted to a formal VEX governance proposal that is voted on by the VEX community.

## Run locally

Update environment variables after copying file:

```bash
# Copy env file
cp .env.sample .env.local
```

Install dependencies:

```bash
npm install
```

Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Engineering Notes

### Governance actions
Currently, the list/set of governance actions users can do are defined in `utils/constants.js`. As time goes along and the DAO has to take on the responsibility to govern more scope, we have to expand these actions accordingly. 

### Argument types for smart contract calls 
When forking from fish.vote, the two supported types for calling smart contracts (via the timelock proxy) are `address` and `uint256`. At the time of writing, the functions we support only need these two types, so there is no need to support more types yet. However, in the future, to expand type support, we need to modify `generateBytesByType` in `governance.js`. 

### Transferring `value` for proposal actions
The current set of actions we support now do not require any value transfer (i.e. transferring VET). To support queuing, proposing, and executing such transaction in the future, we need to refactor: 
1. `utils/constants.js` to add an object into the `values` array for the value amount
2. `createProposal` to accept an array of values instead of the ones filled with `0` now.   
3. `create.js` to render show field to take in user input for value amount

Note: the `execute` governance function is `payable` so any actions that require VET would have to be 'paid' when this function is called. 
