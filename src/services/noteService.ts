import Note from '../models/Note';

// Service function to create a new note
export const addNoteToDB = async (userId: string, title: string, content: string) => {
  const newNote = new Note({
    title,
    content,
    user: userId,
  });

  await newNote.save();
  return newNote;
};

// Service function to get all notes for a user
export const FindNotesByUser = async (userId: string) => {
  const notes = await Note.find({ user: userId });
  return notes;
};

// Service function to delete a note
export const deleteNoteFromDB = async (userId: string, noteId: string) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new Error('Note not found');
  }

  if (note.user.toString() !== userId) {
    throw new Error('Unauthorized to delete this note');
  }

  await note.deleteOne();
  return note;
};

// Service function to update an existing note
export const updateUserNote = async (userId: string, noteId: string, title: string, content: string) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new Error('Note not found');
  }

  if (note.user.toString() !== userId) {
    throw new Error('Unauthorized to update this note');
  }

  // Update the note with the new title and content
  note.title = title || note.title;
  note.content = content || note.content;

  await note.save();
  return note;
};
