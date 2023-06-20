<script lang="ts">
	import Chart, { type ChartItem } from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';
	import { getPositiveGradient } from '$lib/utils/chart.js';

	export let chartData: any;

	let chart = null;
	function updateChart() {
		chart.data.labels = chartData.map(
			(
				record: {
					date: any;
				} // if precedent record has different year sho
			) => record.date
		);
		chart.data.datasets[0].data = chartData.map(
			(record: { balanceAtRecord: any }) => record.balanceAtRecord
		);
		chart.update();
	}

	afterUpdate(() => {
		console.log('after update');
		updateChart();
	});

	onMount(() => {
		const ctx = document.getElementById('chart') as ChartItem;
		chart = new Chart(ctx, {
			//Type of the chart
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Balance',
						borderWidth: 3,
						//cubicInterpolationMode: 'monotone',
						fill: {
							target: 'origin',
							above: 'rgba(66, 153, 225, 0.2)',
							below: 'rgba(239, 68, 68, 0.2)'
						},
						borderColor: function (context) {
							const chart = context.chart;
							const { ctx, chartArea } = chart;

							if (!chartArea) {
								// This case happens on initial chart load
								return;
							}
							return getPositiveGradient(ctx, chartArea);
						}
					}
				]
			},
			//options for the chart
			options: {
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 3,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'month',
							tooltipFormat: 'dd MMM yyyy'
						},
						grid: {
							display: false
						}
					},
					y: {
						display: false
					}
				}
			}
		});
	});
</script>

<canvas id="chart" />
