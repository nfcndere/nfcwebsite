import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - replace with database query once connected
  const matches = [
    {
      id: '1',
      homeTeam: {
        name: 'Ngaoundéré FC',
        logo: 'https://res.cloudinary.com/u9588m3i/image/upload/v1/nfc-logo.png',
      },
      awayTeam: {
        name: 'Canon Yaoundé',
        logo: 'https://res.cloudinary.com/u9588m3i/image/upload/v1/canon-logo.png',
      },
      matchDate: '2026-10-10T14:00:00Z',
      competition: 'Ligue 1',
      status: 'upcoming',
    },
  ];

  return NextResponse.json(matches);
}
