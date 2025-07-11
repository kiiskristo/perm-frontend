import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LastSyncCardProps {
  asOfDate: string;
}

export function LastSyncCard({ asOfDate }: LastSyncCardProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  // Format date and time for Last Sync
  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    return { date: formattedDate, time: formattedTime };
  };

  // Check if we should be spinning (after 10 PM ET until we get today's data)
  const shouldSpin = () => {
    // Get current time in ET
    const nowET = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    const etDate = new Date(nowET);
    const etHour = etDate.getHours();
    
    // Get today's date in ET timezone in YYYY-MM-DD format
    const todayET = new Date().toLocaleDateString("en-US", {timeZone: "America/New_York"});
    const etDateParts = new Date(todayET);
    const todayStringET = `${etDateParts.getFullYear()}-${String(etDateParts.getMonth() + 1).padStart(2, '0')}-${String(etDateParts.getDate()).padStart(2, '0')}`;
    
    // Check if last sync is from today (ET)
    const lastSyncDate = asOfDate.split('T')[0]; // Get just the date part
    const hasLatestData = lastSyncDate === todayStringET;
    
    // Debug logging
    console.log('Sync Debug:', {
      etHour,
      todayStringET,
      lastSyncDate,
      hasLatestData,
      shouldSpin: etHour >= 22 && !hasLatestData
    });
    
    // Spin if it's after 10 PM ET and we don't have today's data yet
    return etHour >= 22 && !hasLatestData;
  };

  // Update spinning state
  useEffect(() => {
    const updateSpinning = () => {
      setIsSpinning(shouldSpin());
    };

    // Update immediately
    updateSpinning();

    // Update every minute to check if we should start/stop spinning
    const interval = setInterval(updateSpinning, 60000);

    return () => clearInterval(interval);
  }, [asOfDate]);

  const { date, time } = formatLastSync(asOfDate);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Last Sync</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold dark:text-white">{date}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {time}
          </p>
        </div>
        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <RefreshCw 
            className={`h-6 w-6 text-purple-600 dark:text-purple-400 ${
              isSpinning ? 'animate-spin' : ''
            }`} 
          />
        </div>
      </div>
    </div>
  );
} 