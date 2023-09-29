interface CircularLoadingBar {
  percent: number;
}

const CircularLoadingBar = ({ percent }: CircularLoadingBar) => {
  const radius = 5;
  const circumference = 2 * Math.PI * radius;

  return (
    <div>
        <svg className="w-4 h-4">
          <circle
            className="text-gray-300"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="10"
            cy="10"
          />
          <circle
            className="text-brandDark"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percent / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="10"
            cy="10"
          />
        </svg>
    </div>
  );
};

export default CircularLoadingBar;