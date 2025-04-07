import { Component, createEffect, onCleanup } from "solid-js";
import ChartJS from "chart.js/auto";

interface ChartProps {
  type: "bar" | "line";
  data: any;
}

const Chart: Component<ChartProps> = (props) => {
  let chartRef: HTMLCanvasElement | undefined;
  let chartInstance: ChartJS | undefined;

  createEffect(() => {
    if (chartRef) {
      if (!props.data || props.data.labels.length === 0 || props.data.datasets.length === 0) {
        console.error("No hay datos válidos para renderizar el gráfico");
        return;
      }
      
      chartInstance = new ChartJS(chartRef, {
        type: props.type,
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    onCleanup(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });
  });

  return <canvas ref={el => chartRef = el} />;
};

export default Chart;