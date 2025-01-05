import { Router } from 'express';
import { createNote, deleteNote, getNotes, updateNote } from '../controllers/noteController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Route to create a new note
router.post('/notes', authenticateJWT, createNote);

// Route to delete a note by ID
router.delete('/notes/:noteId', authenticateJWT, deleteNote);

// Route to list all notes for the authenticated user
router.get('/notes', authenticateJWT, getNotes);

// Route to update an existing note by ID
router.put('/notes/:noteId', authenticateJWT, updateNote);

export default router;
