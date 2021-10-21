/**
 * Helper function to map given number to a ProposalState
 * @param {string} input value returned by GovernorAlpha::state()
 * @returns {string} string of proposal status
 */
function toProposalState (input) {
	switch(input) {
		case '0':
			return "Pending";
		case '1':
			return "Active";
		case '2':
			return "Canceled";
		case '3':
			return "Defeated";
		case '4':
			return "Succeeded"
		case '5': 
			return "Queued";
		case '6':
			return "Expired"
		case '7':
			return "Executed";
		default:
			console.error("Unrecognized proposal state");
	}
}

export default toProposalState;