import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - replace with database query once connected
  const standings = [
    {
      teamName: 'Ngaoundéré FC',
      rank: 2,
      points: 44,
      played: 21,
      won: 13,
      drawn: 5,
      lost: 3,
      logo: 'https://res.cloudinary.com/u9588m3i/image/upload/v1/nfc-logo.png',
    },
    {
      teamName: 'Canon Yaoundé',
      rank: 1,
      points: 47,
      played: 21,
      won: 14,
      drawn: 5,
      lost: 2,
      logo: 'https://res.cloudinary.com/u9588m3i/image/upload/v1/canon-logo.png',
    },
    {
      teamName: 'Cotonsport',
      rank: 3,
      points: 41,
      played: 21,
      won: 12,
      drawn: 5,
      lost: 4,
      logo: 'https://res.cloudinary.com/u9588m3i/image/upload/v1/cotonsport-logo.png',
    },
  ];

  return NextResponse.json(standings);
}
