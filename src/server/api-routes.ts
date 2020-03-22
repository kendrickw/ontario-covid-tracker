import express from 'express';

import ontarioCa from './controllers/ontario-ca';

const api = express.Router();

// Add additional API controllers below
api.use('/ontario-ca', ontarioCa);

export default api;
