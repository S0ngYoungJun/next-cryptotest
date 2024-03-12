"use client"
import React, { useState, useEffect, useRef } from 'react';
import ChartComponent from './binance/chartcomponent';
import styles from './binance/binance.module.scss';
import AudioPlayer from '@/components/AudioPlayer';


interface PriceInfo {
  symbol: string;
  price: string;
  timestamp: Date;
}

const BTCPriceTracker = () => {
  const [prices, setPrices] = useState<PriceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceIncreasedCount, setPriceIncreasedCount] = useState(0);
  const [priceDecreasedCount, setPriceDecreasedCount] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // State to store audio element
  const [logMessage, setLogMessage] = useState<string>("");
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        if (!response.ok) {
          throw new Error('Failed to fetch price');
        }
        const data = await response.json();
        const newPriceInfo: PriceInfo = { symbol: data.symbol, price: data.price, timestamp: new Date() };
        setPrices(prevPrices => [...prevPrices, newPriceInfo]);
        // 이전 가격과 비교하여 상승/하락 횟수 증가
        if (prevPriceRef.current !== null) {
          const prevPrice = prevPriceRef.current;
          const currentPrice = parseFloat(data.price);
          if (currentPrice > prevPrice) {
            setPriceIncreasedCount(prevCount => prevCount + 1);
            setPriceDecreasedCount(0); // Reset decrease count
          } else if (currentPrice < prevPrice) {
            setPriceDecreasedCount(prevCount => prevCount + 1);
            setPriceIncreasedCount(0); // Reset increase count
          }
        }
        prevPriceRef.current = parseFloat(data.price); // 현재 가격을 이전 가격으로 업데이트
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 가격 상승/하락 횟수가 3번일 때 노래 재생
    if (priceIncreasedCount === 3) {
      playSongForPriceIncrease();
      // 횟수 초기화
      setPriceIncreasedCount(0);
    }
    if (priceDecreasedCount === 3) {
      playSongForPriceDecrease();
      // 횟수 초기화
      setPriceDecreasedCount(0);
    }
  }, [priceIncreasedCount, priceDecreasedCount]);

   
  const playSongForPriceIncrease = () => {
    // 가격이 3번 오를 때 실행할 노래 재생 로직 추가
    setLogMessage('추세상승중! 신나는음악.');
    // 실제 음악 파일을 재생하는 코드 추가
    const audio = new Audio("/audio/awaken.mp3");
    audio.play();
  };

  const playSongForPriceDecrease = () => {
    // 가격이 3번 내릴 때 실행할 노래 재생 로직 추가
    setLogMessage('추세하락중! 우울한음악');
    // 실제 음악 파일을 재생하는 코드 추가
    const audio = new Audio("/audio/lofi-study.mp3");
    audio.play();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.root}>
      <h1>BTCUSDT Price Tracker</h1>
      <div className={styles.chart}><ChartComponent prices={prices} /></div>
      <div className={styles.font}>{logMessage}</div>
      <div>노래A <AudioPlayer src="/audio/awaken.mp3"/></div>
      <div>노래B <AudioPlayer src="/audio/midnight-138704.mp3" /></div>
    </div>
  );
};

export default BTCPriceTracker;
