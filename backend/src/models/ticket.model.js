import pool from "../config/db.js";

export const getTickets = async () => {
  const { rows } = await pool.query(
    `
    SELECT
      t.*,

      c.id    AS creator_id,
      c.name  AS creator_name,
      c.email AS creator_email,

      a.id    AS assignee_id_user,
      a.name  AS assignee_name,
      a.email AS assignee_email

    FROM tickets t

    JOIN users c
      ON c.id = t.creator_id

    LEFT JOIN users a
      ON a.id = t.assignee_id

    ORDER BY t.created_at DESC
    `
  );

  return rows;
};


export const getTicketById = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT
      t.*,

      c.id    AS creator_id,
      c.name  AS creator_name,
      c.email AS creator_email,

      a.id    AS assignee_id_user,
      a.name  AS assignee_name,
      a.email AS assignee_email

    FROM tickets t

    JOIN users c
      ON c.id = t.creator_id

    LEFT JOIN users a
      ON a.id = t.assignee_id

    WHERE t.id = $1
    `,
    [id]
  );

  return rows[0];
};

export const createTicket = async (ticketData) => {
  const { rows } = await pool.query(
    `
    INSERT INTO tickets
    (
      title,
      description,
      priority,
      status,
      creator_id,
      assignee_id
    )

    VALUES
    (
      $1,
      $2,
      $3,
      COALESCE($4,'ouvert'),
      $5,
      $6
    )

    RETURNING *
    `,
    [
      ticketData.title,
      ticketData.description,
      ticketData.priority,
      ticketData.status,
      ticketData.creatorId,
      ticketData.assigneeId ?? null,
    ]
  );

  return rows[0];
};


export const updateTicket = async (id, ticketData) => {
  const { rows } = await pool.query(
    `
    UPDATE tickets

    SET
      title = $1,
      description = $2,
      priority = $3

    WHERE id = $4

    RETURNING *
    `,
    [
      ticketData.title,
      ticketData.description,
      ticketData.priority,
      id,
    ]
  );

  return rows[0];
};

export const deleteTicket = async (id) => {
  await pool.query(
    `
    DELETE FROM tickets
    WHERE id = $1
    `,
    [id]
  );
};


export const changeTicketStatus = async (id, status) => {

  const resolvedAt =
    status === "resolu"
      ? new Date()
      : null;

  const { rows } = await pool.query(
    `
    UPDATE tickets

    SET
      status = $1,
      resolved_at = $2

    WHERE id = $3

    RETURNING *
    `,
    [
      status,
      resolvedAt,
      id,
    ]
  );

  return rows[0];
};

export const assignTicket = async (id, assigneeId) => {
  const { rows } = await pool.query(
    `
    UPDATE tickets

    SET assignee_id = $1

    WHERE id = $2

    RETURNING *
    `,
    [assigneeId, id]
  );

  return rows[0];
};