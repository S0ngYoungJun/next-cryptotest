"use client"
import React, { useState, useEffect } from 'react'
import ChartComponent from './chartcomponent';
import styles from './binance.module.scss'
// 가격 정보를 저장할 객체의 인터페이스 정의
interface PriceInfo {
  symbol: string;
  price: string;
  timestamp: Date;
}

const BTCPriceTracker = () => {
  const [prices, setPrices] = useState<PriceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // BTCUSDT 가격 정보를 가져오는 함수
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        if (!response.ok) {
          throw new Error('Failed to fetch price');
        }
        const data = await response.json();
        // 현재 시간과 함께 가격 정보 추가
        const newPriceInfo: PriceInfo = { symbol: data.symbol, price: data.price, timestamp: new Date() };
        // 상태 업데이트 시 불변성 유지
        setPrices(prevPrices => [...prevPrices, newPriceInfo]);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice(); // 컴포넌트 마운트 시 최초 호출
    const interval = setInterval(fetchPrice,30000); // 1분마다 fetchPrice 함수 반복 호출

    // 컴포넌트 언마운트 시 setInterval 정리
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>BTCUSDT Price Tracker</h1>
      <div className={styles.chart}><ChartComponent prices={prices} /></div>
      <ul>
        {prices.map((priceInfo, index) => (
          <li key={index}>
            {priceInfo.symbol}: ${priceInfo.price} at {priceInfo.timestamp.toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BTCPriceTracker;