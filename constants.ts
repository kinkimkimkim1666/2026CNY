import { Winner } from './types';

// Default dummy data to show before any upload
export const INITIAL_WINNERS: Winner[] = [
  { id: '1', day: 1, name: 'Chan Tai Man', phone: '91234567' },
  { id: '2', day: 1, name: 'Alice Wong', phone: '67891234' },
  { id: '3', day: 1, name: 'Peter Lee', phone: '55556666' },
  { id: '4', day: 2, name: 'Waiting for draw...', phone: '********' },
];

export const TOTAL_DAYS = 5;

// Color palette constants for reference
export const COLORS = {
  red: '#7f1d1d',
  gold: '#fbbf24',
  cream: '#fef3c7',
};