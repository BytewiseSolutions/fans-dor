export interface Nominee {
  nomineeId: string;
  playerName: string;
  clubName: string;
  category: string;
  description: string;
  votes: number;
  status: 'active' | 'inactive' | 'pending';
  photo?: string;
}
