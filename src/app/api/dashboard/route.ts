import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the days parameter from the URL
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  
  // Generate mock data based on days
  const dashboardData = {
    daily_volume: Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        volume: Math.floor(Math.random() * 50) + 50,
      };
    }),
    weekly_averages: [
      { day: 'Mon', average: Math.floor(Math.random() * 20) + 110 },
      { day: 'Tue', average: Math.floor(Math.random() * 20) + 100 },
      { day: 'Wed', average: Math.floor(Math.random() * 20) + 120 },
      { day: 'Thu', average: Math.floor(Math.random() * 20) + 115 },
      { day: 'Fri', average: Math.floor(Math.random() * 20) + 125 },
    ],
    weekly_volumes: Array.from({ length: 8 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 * (8 - i - 1)));
      const week = `W${i + 1}`;
      return {
        week,
        volume: Math.floor(Math.random() * 200) + 300,
      };
    }),
    monthly_volumes: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (6 - i - 1));
      const month = date.toLocaleString('default', { month: 'short' });
      return {
        month,
        volume: Math.floor(Math.random() * 500) + 1000,
      };
    }),
    metrics: {
      new_cases: Math.floor(Math.random() * 100) + 400,
      new_cases_change: Math.floor(Math.random() * 10) - 5,
      processed_cases: Math.floor(Math.random() * 100) + 350,
      processed_cases_change: Math.floor(Math.random() * 10) + 2,
      current_backlog: Math.floor(Math.random() * 500) + 2000,
    },
  };
  
  return NextResponse.json(dashboardData);
} 