interface DashboardProps {
  totalFunctions: number;
  currentSpeed: number;
  maxBlockLength: number;
}

const Dashboard = ({ totalFunctions, currentSpeed, maxBlockLength }: DashboardProps) => {
  return (
    <div className="dashboard">
      <h3>Hacker Performance Dashboard</h3>
      <div className="metric">
        <span className="metric-label">Total Functions Hacked:</span>
        <span className="metric-value">{Math.max(totalFunctions - 1, 0)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Speed:</span>
        <span className="metric-value">{'🔥'.repeat(Math.min(currentSpeed, 10))}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Complexity:</span>
        <span className="metric-value">{'💀'.repeat(Math.min(maxBlockLength, 10))}</span>
      </div>
    </div>
  );
};

export default Dashboard;
