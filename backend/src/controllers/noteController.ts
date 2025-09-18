import { Request, Response } from 'express';
import Note from '../models/Note';
import Tenant from '../models/Tenant';

export const createNote = async (req: any, res: Response) => {
  const { title, content } = req.body;
  const { tenantId, userId } = req.user;
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
  if (tenant.plan === 'free') {
    const noteCount = await Note.countDocuments({ tenantId });
    if (noteCount >= 3) {
      return res.status(403).json({ message: 'Free plan limit reached' });
    }
  }
  const note = await Note.create({ title, content, tenantId, userId });
  res.status(201).json(note);
};

export const getNotes = async (req: any, res: Response) => {
  const { tenantId } = req.user;
  const notes = await Note.find({ tenantId });
  res.json(notes);
};

export const getNoteById = async (req: any, res: Response) => {
  const { tenantId } = req.user;
  const note = await Note.findOne({ _id: req.params.id, tenantId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

export const updateNote = async (req: any, res: Response) => {
  const { tenantId } = req.user;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

export const deleteNote = async (req: any, res: Response) => {
  const { tenantId } = req.user;
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
};
