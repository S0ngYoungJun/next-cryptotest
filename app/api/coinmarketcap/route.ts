import Binance from 'binance-api-node'

export async function GET() {
  try {
    const response = await fetch('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': '707cad12-a207-4a72-b76e-45fd5706672a',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json({ data })
  } catch (error) {
    console.error(error);
    return Response.json({ error })
  }
}

