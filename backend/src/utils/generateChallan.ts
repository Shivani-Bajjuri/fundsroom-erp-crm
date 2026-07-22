const padSequence = (value: number) => String(value).padStart(4, "0");

export const generateChallanNumber = (lastChallanNumber?: string | null) => {
	const today = new Date();
	const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");

	if (!lastChallanNumber) {
		return `CHL-${datePart}-0001`;
	}

	const match = lastChallanNumber.match(/^CHL-(\d{8})-(\d{4})$/);

	if (!match) {
		return `CHL-${datePart}-0001`;
	}

	const [, lastDatePart, lastSequence] = match;

	if (lastDatePart !== datePart) {
		return `CHL-${datePart}-0001`;
	}

	return `CHL-${datePart}-${padSequence(Number(lastSequence) + 1)}`;
};
