import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;  // Add password field to user model
};

let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: bcrypt.hashSync('password123', 10) },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: bcrypt.hashSync('password123', 10) }
];

// Function to get users from the "database" (mock)
export const getUsersFromDB = async (): Promise<User[]> => {
  return users;
};

// Function to add a user to the "database" (mock)
export const addUserToDB = async (user: Omit<User, 'id'>): Promise<User> => {
  const newUser: User = { id: users.length + 1, ...user, password: bcrypt.hashSync(user.password, 10) };
  users.push(newUser);
  return newUser;
};

// Function to find user by email
export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return users.find((user) => user.email === email);
};

// Function to validate user password
export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Function to generate JWT token
export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
};
