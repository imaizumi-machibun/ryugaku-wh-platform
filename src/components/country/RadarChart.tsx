'use client';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Props = {
  labels: string[];
  values: number[];
  label?: string;
  maxValue?: number;
};

export default function RadarChart({ labels, values, label = '評価', maxValue = 5 }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 1,
          display: false,
        },
        pointLabels: {
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="max-w-sm mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
