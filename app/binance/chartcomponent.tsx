import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
// 차트 데이터와 옵션 설정

interface PriceInfo {
  timestamp: Date;
  price: string;
}

interface ChartComponentProps {
  prices: PriceInfo[];
}


const options = {
  scales: {
    x: {
      type: 'timeseries',
      time: {
        unit: 'minute',
        // 'tooltipFormat'은 'time' 객체 내부가 아닌 'displayFormats' 객체 내부에 위치해야 합니다.
        displayFormats: {
          minute: 'yyyy-MM-dd HH:mm'
        }
      },
      title: {
        display: true,
        text: 'Time'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Price (USD)'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

const ChartComponent = ({ prices }: ChartComponentProps) => {
  // 차트 데이터 구성
  const data = {
    datasets: [{
      label: 'BTCUSDT Price',
      data: prices.map(price=> ({
        x: price.timestamp.toLocaleTimeString(),
        y: price.price
      })),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={data} />;
};

export default ChartComponent;