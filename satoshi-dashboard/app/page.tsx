import AccountDashboard from '../components/AccountDashboard';
import BotStatusCard from '../components/BotStatusCard';
import TradingHistory from '../components/TradingHistory';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <AccountDashboard />
        <BotStatusCard />
        <div id="history">
          <TradingHistory />
        </div>
      </div>
    </div>
  );
}
