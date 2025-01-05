import request from 'supertest';
import app from '../src/app'; // Assume your Express app is exported from `app.ts`
import User from '../src/models/User'; // Assuming you have a User model
import Note from '../src/models/Note'; // Assuming you have a Note model

// Sample user credentials
const userCredentials = {
  email: 'user@example.com',
  password: 'securepassword123',
  name: 'Test User',
};

// Sample note data
const sampleNote = {
  title: 'Sample Note',
  content: 'This is the content of the sample note.',
};

let token: string; // JWT token for authenticated requests
let noteId: string; // Store the ID of a note after it's created

describe('Note Routes', () => {
    let server: any;
  
    beforeAll(async () => {
      // Register a user first (you may need to implement this endpoint for testing)
        server = app.listen();
      await request(app).post('/api/users/register').send({
        email: userCredentials.email,
        password: userCredentials.password,
        name: userCredentials.name,
      });
    
      // Login the user to get the JWT token
      const response = await request(app)
        .post('/api/users/login')
        .send(userCredentials);
    
      token = response.body.token; // Store the JWT token
    });
    
    afterAll(async () => {
      // Clean up test data if needed (e.g., delete test user, notes, etc.)
      await User.deleteOne({ email: userCredentials.email });
      await Note.deleteOne({ _id: noteId });
      server.close();
    });
    
  it('should create a new note', async () => {
    const response = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleNote);

    expect(response.status).toBe(201);
    expect(response.body.note).toHaveProperty('title', sampleNote.title);
    expect(response.body.note).toHaveProperty('content', sampleNote.content);

    // Save the noteId for future tests
    noteId = response.body.note.id;
  });

  it('should get all notes for the authenticated user', async () => {
    const response = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('content');
  });

  it('should update a note if the user is authenticated and owns the note', async () => {
    const updatedNote = {
      title: 'Updated Note Title',
      content: 'This is the updated content of the note.',
    };

    const response = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedNote);

    expect(response.status).toBe(200);
    expect(response.body.note).toHaveProperty('title', updatedNote.title);
    expect(response.body.note).toHaveProperty('content', updatedNote.content);
  });

  it('should delete a note if the user is authenticated and owns the note', async () => {
    const response = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Note deleted successfully');
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
      .post('/api/notes')
      .send(sampleNote);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });

  it('should return 404 if trying to update or delete a note that does not belong to the user', async () => {
    // Create a new note for a different user (simulating unauthorized access)
    const response1 = await request(app)
      .post('/api/users/register')
      .send({
        email: 'otheruser@example.com',
        password: 'password123',
        name: 'Other User',
      });

    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'otheruser@example.com',
        password: 'password123',
      });

    const otherUserToken = loginResponse.body.token;

    const noteResponse = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send(sampleNote);

    const otherUserNoteId = noteResponse.body.note._id;

    // Try deleting the note as the first user
    const deleteResponse = await request(app)
      .delete(`/api/notes/${otherUserNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toHaveProperty('message', 'Note not found or you do not own the note');
  });
});
