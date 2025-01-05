import { Request, Response } from 'express';
import { getUsersFromDB, addUserToDB, findUserByEmail, validatePassword, generateToken } from '../services/userService';

// Handle GET request to fetch users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersFromDB();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Handle POST request to create a new user (register)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = await addUserToDB({ name, email, password });
    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

// Handle POST request to login a user and get a JWT token
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};
