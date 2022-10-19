import { toast } from 'react-toastify';

import ErrorToast from "@components/ErrorToast";
import SuccessToast from "@components/SuccessToast";
import PendingToast from "@components/PendingToast";

const setTransaction = async (txResponse, provider) => {
	return new Promise(async (resolve, reject) => {
		const toastID = toast.loading(<PendingToast tx={txResponse} />);
		const txVisitor = provider.thor.transaction(txResponse.txid);
		let txReceipt = null;
		const ticker = provider.thor.ticker();

		while(!txReceipt) {
			await ticker.next();
			txReceipt = await txVisitor.getReceipt();
		}

		if (!txReceipt.reverted) {
			toast.update(toastID, {
				render: (
					<SuccessToast
						tx={txReceipt}
						action="Claimed VEX"
					/>
				),
				type: "success",
				isLoading: false,
				autoClose: 5000
			});

			resolve();
		}
		// Handle failed tx
		else {
			toast.update(toastID, {
				render: <ErrorToast />,
				type: "error",
				isLoading: false,
				autoClose: 5000
			});

			reject();
		}
	});
}

export default setTransaction;
