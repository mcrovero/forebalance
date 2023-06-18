let width: number, height: number, gradient: { addColorStop: (arg0: number, arg1: any) => void };
export function getPositiveGradient(
	ctx: {
		createLinearGradient: (
			arg0: number,
			arg1: any,
			arg2: number,
			arg3: any
		) => { addColorStop: (arg0: number, arg1: any) => void };
	},
	chartArea: { right: number; left: number; bottom: number; top: number }
) {
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

		gradient.addColorStop(0, '#be18b9');
		//gradient.addColorStop(0.5, 'rgba(255, 99, 132, 0.15)');
		gradient.addColorStop(1, '#00b3ff');
	}

	return gradient;
}

export function getNegativeGradient(
	ctx: {
		createLinearGradient: (
			arg0: number,
			arg1: any,
			arg2: number,
			arg3: any
		) => { addColorStop: (arg0: number, arg1: any) => void };
	},
	chartArea: { right: number; left: number; bottom: number; top: number }
) {
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

		gradient.addColorStop(0, '#00b3ff');
		gradient.addColorStop(1, '#be18b9');
	}

	return gradient;
}
