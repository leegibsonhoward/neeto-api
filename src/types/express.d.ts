// src/types/express.d.ts
import { User } from '../models/userModel'; // Import your User model if necessary
declare global {
  namespace Express {
    interface Request {
      user?: User; // `user` can be undefined, but this should be safe in authenticated routes
    }
  }
}
