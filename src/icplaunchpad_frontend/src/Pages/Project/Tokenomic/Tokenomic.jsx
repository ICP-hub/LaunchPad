import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Tokenomic = () => {
  const data = {
    labels: ["Presale", "Liquidity", "Locked", "Unlocked"],
    datasets: [
      {
        label: "Tokenomics Distribution",
        data: [50, 40, 50, 40], // Adjust the values according to your distribution
        backgroundColor: ["#F3B3A7", "#CACCF5", "#3E3E3E", "#FFFFFF"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true, // Ensures chart adapts to the container
    maintainAspectRatio: true, // Maintains the aspect ratio for responsiveness
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 16, // Increase legend font size
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // Increase tooltip font size
        },
        titleFont: {
          size: 16, // Increase tooltip title font size
        },
      },
    },
  };

  return (
    <div className="mt-8 w-full flex flex-col items-center">
      <div className="w-full max-w-[500px] max-h-[500px] p-4">
        {/* Responsive container for the chart */}
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default Tokenomic;
