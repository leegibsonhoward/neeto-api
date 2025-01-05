import { Request, Response } from 'express';
import {addNoteToDB, FindNotesByUser, deleteNoteFromDB, updateUserNote} from '../services/noteService';

// Controller to create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming user id is attached to the request via middleware

    const newNote = await addNoteToDB(userId, title, content);
    return res.status(201).json(newNote);
  } catch (err: unknown) {  // Explicitly specify the type of err as 'unknown'
    if (err instanceof Error) { // Check if 'err' is an instance of Error
      return res.status(500).json({ message: 'Error creating note', error: err.message });
    } else {
      // In case the error is not an instance of Error, handle it safely
      return res.status(500).json({ message: 'An unexpected error occurred', error: 'Unknown error' });
    }
  }
};

// Controller to delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id; // User from the authenticated session

    const deletedNote = await deleteNoteFromDB(userId, noteId);
    return res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
  } catch (err: unknown) {  // Explicitly specify the type of err as 'unknown'
    if (err instanceof Error) { // Check if 'err' is an instance of Error
      return res.status(500).json({ message: 'Error deleting note', error: err.message });
    } else {
      // In case the error is not an instance of Error, handle it safely
      return res.status(500).json({ message: 'An unexpected error occurred', error: 'Unknown error' });
    }
  }
};

// Controller to list all notes for the authenticated user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // User from the authenticated session

    const notes = await FindNotesByUser(userId);
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }

    return res.status(200).json(notes);
  } catch (err: unknown) {  // Explicitly specify the type of err as 'unknown'
    if (err instanceof Error) { // Check if 'err' is an instance of Error
      return res.status(500).json({ message: 'Error fetching notes', error: err.message });
    } else {
      // In case the error is not an instance of Error, handle it safely
      return res.status(500).json({ message: 'An unexpected error occurred', error: 'Unknown error' });
    }
  }
};

// Controller to update an existing note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.noteId;
    const { title, content } = req.body;
    const userId = req.user.id; // User from the authenticated session

    const updatedNote = await updateUserNote(userId, noteId, title, content);
    return res.status(200).json(updatedNote);
  } catch (err: unknown) {  // Explicitly specify the type of err as 'unknown'
    if (err instanceof Error) { // Check if 'err' is an instance of Error
      return res.status(500).json({ message: 'Error editing note', error: err.message });
    } else {
      // In case the error is not an instance of Error, handle it safely
      return res.status(500).json({ message: 'An unexpected error occurred', error: 'Unknown error' });
    }
  }
};
