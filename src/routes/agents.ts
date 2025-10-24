// src/routes/agents.ts
import express from 'express';
import { 
  getAllAgents, 
  getAgentById, 
  createAgent, 
  updateAgent, 
  deleteAgent,
  toggleAgentStatus,
  updateAgentLimit
} from '../controllers/agentController';
import { verifySignature } from '../utils/signatureVerifier';

const router = express.Router();

// Get all agents
router.get('/', getAllAgents);

// Get agent by ID
router.get('/:id', getAgentById);

// Create new agent (requires coldkey signature verification)
router.post('/', verifySignature, createAgent);

// Update agent details
router.put('/:id', verifySignature, updateAgent);

// Delete agent
router.delete('/:id', verifySignature, deleteAgent);

// Toggle agent status
router.patch('/:id/toggle-status', verifySignature, toggleAgentStatus);

// Update agent daily limit
router.patch('/:id/update-limit', verifySignature, updateAgentLimit);

export { router as agentRoutes };