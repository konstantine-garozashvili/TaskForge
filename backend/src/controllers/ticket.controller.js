import * as ticketModel from '../models/ticket.model.js';

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketModel.createTicket({
      ...req.body,
      creatorId: req.user.id,
    });
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await ticketModel.updateTicket(req.params.id, req.body);
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    await ticketModel.deleteTicket(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const updatedTicket = await ticketModel.changeTicketStatus(req.params.id, req.body.status);

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const updatedTicket = await ticketModel.assignTicket(req.params.id, req.body.assigneeId);

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
