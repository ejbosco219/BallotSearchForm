import type { Voter } from '@/types/voter';

export interface SearchParams {
  firstName?: { value: string; match: 'starts' | 'within' | 'ends' };
  lastName?: { value: string; match: 'starts' | 'within' | 'ends' };
  streetNumber?: string;
  streetName?: { value: string; match: 'starts' | 'within' | 'ends' };
}

export async function searchVoters(params: SearchParams): Promise<Voter[]> {
  const response = await fetch('/api/voters/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to search voters');
  }

  return response.json();
}
