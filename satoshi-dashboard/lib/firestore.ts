import { db } from './firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export interface BotSignals {
  bb_1h_lower_touch: boolean;
  bb_1h_upper_touch: boolean;
  bb_4h_lower_touch: boolean;
  bb_4h_upper_touch: boolean;
  bearish_div_1h: boolean;
  bearish_div_4h: boolean;
  bullish_div_1h: boolean;
  bullish_div_4h: boolean;
  ema_1h: number;
  ema_4h: number;
  ema_4h_trend_bullish: boolean;
  price_1h: number;
  price_4h: number;
  rsi_1h: number;
  rsi_1h_overbought: boolean;
  rsi_1h_oversold: boolean;
  rsi_4h: number;
  rsi_4h_overbought: boolean;
  rsi_4h_oversold: boolean;
  rsi_4h_pullback: boolean;
}

export interface BotStatusData {
  action: string;
  buy_score: number;
  price: number;
  qty: number;
  sell_score: number;
  message: string;
  timestamp: string;
  type: string;
  signals: BotSignals;
}

export interface BotStatus {
  data: Omit<BotStatusData, 'timestamp'>;
  timestamp: string;
  type: string;
}

export async function getLatestBotStatus(): Promise<BotStatusData | null> {
  try {
    const botStatusRef = collection(db, 'bot_status');
    const q = query(botStatusRef, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const docData = querySnapshot.docs[0].data() as BotStatus;
    return {
      ...docData.data,
      timestamp: docData.timestamp,
      type: docData.type,
    };
  } catch (error) {
    console.error('Error getting latest bot status:', error);
    return null;
  }
}

export async function getRecentBotStatuses(count: number = 10): Promise<BotStatusData[]> {
  try {
    const botStatusRef = collection(db, 'bot_status');
    const q = query(botStatusRef, orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const docData = doc.data() as BotStatus;
      return {
        ...docData.data,
        timestamp: docData.timestamp,
        type: docData.type,
      };
    });
  } catch (error) {
    console.error('Error getting recent bot statuses:', error);
    return [];
  }
}
