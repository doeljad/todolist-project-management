'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Task } from '@prisma/client';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Props {
  tasks: Task[];
  type?: 'bar' | 'pie';
}

export default function TaskStatusChart({ tasks, type = 'pie' }: Props) {
  const counts = {
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  const data = {
    labels: ['Todo', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Jumlah Task',
        data: [counts.TODO, counts.IN_PROGRESS, counts.DONE],
        backgroundColor: ['#facc15', '#3b82f6', '#10b981'],
        borderWidth: 1,
      },
    ],
  };
const options = {
  plugins: {
    legend: { labels: { color: 'white' } },
  },
  scales: {
    x: { ticks: { color: 'white' } },
    y: { ticks: { color: 'white' } },
  },
};

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
  <div className="w-full max-w-xs mx-auto">
     {type === 'bar' ? <Bar data={data} options={options} />
 : <Pie data={data} />}
  </div>
  <div>
    {/* Tambahkan ringkasan jumlah task per status */}
    <ul className="text-sm space-y-1 text-gray-300">
      <li>Todo: {counts.TODO}</li>
      <li>In Progress: {counts.IN_PROGRESS}</li>
      <li>Done: {counts.DONE}</li>
    </ul>
  </div>
</div>
  );
}
