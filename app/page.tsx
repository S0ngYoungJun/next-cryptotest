"use client"
import React, { useState, useEffect } from 'react';
interface Coin {
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
    };
  };
}

const HomePage = () => {
  const [data, setData] = useState<Coin[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/coinmarketcap');
        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        const jsonData = await response.json();
        console.log(jsonData.data.data)
        const filteredData = jsonData.data.data.find((coin : any) => coin.id === 2781);
        console.log(filteredData)
      if (filteredData) {
        setData([filteredData]); // 배열 형태로 유지하고 싶다면 이렇게 할 수 있습니다.
        // 또는 필요에 따라 setData(filteredData); 단일 객체로 저장
      } else {
        throw new Error('Data not found');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  return (
    <div>
      <h1>Cryptocurrency Listings</h1>
      
    </div>
  );
  }
export default HomePage;