import { toast } from "react-toastify";
import { API_BASE } from "./api";

const API_URL = `${API_BASE}/tickets`;

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ==========================
// CREATE
// ==========================

export const createTicket = async (ticketData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: ticketData.status ?? "ouvert",
      creatorId: ticketData.creatorId,
      assigneeId: ticketData.assigneeId ?? null,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la création");
  }

  toast.success("Ticket créé avec succès");

  return data;
};

// ==========================
// GET ALL
// ==========================

export const getAllTickets = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du chargement");
  }

  return data;
};

// ==========================
// GET ONE
// ==========================

export const getTicketById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ticket introuvable");
  }

  return data;
};

// ==========================
// UPDATE
// ==========================

export const updateTicket = async (id, ticketData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: ticketData.status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la modification");
  }

  toast.success("Ticket modifié");

  return data;
};

// ==========================
// DELETE
// ==========================

export const deleteTicket = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erreur lors de la suppression");
  }

  toast.success("Ticket supprimé");
};

// ==========================
// CHANGE STATUS
// ==========================

export const changeTicketStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du changement de statut");
  }

  toast.success("Statut mis à jour");

  return data;
};

// ==========================
// ASSIGN TICKET
// ==========================

export const assignTicket = async (id, assigneeId) => {
  const response = await fetch(`${API_URL}/${id}/assign`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      assigneeId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'assignation");
  }

  toast.success("Ticket assigné");

  return data;
};