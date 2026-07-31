/**
 * API controller - test endpoint handlers.
 * Used to validate the frontend <-> backend connection (issue #13).
 */
export const getApiInfo = (req, res) => {
  res.json({
    message: 'TaskForge API is running 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};
