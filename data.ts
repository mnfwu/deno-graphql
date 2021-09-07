export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export const users: Array<User> = [
  { id: 1, firstName: 'Matthew', lastName: 'W' },
  { id: 2, firstName: 'Tina', lastName: 'S' },
];
