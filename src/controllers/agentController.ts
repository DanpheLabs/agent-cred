// src/controllers/agentController.ts
import { Request, Response } from 'express';
import Agent from '../models/Agent';
import { verifySignature } from '../utils/signatureVerifier';
import { getAgentAccount, getTransactionRecord } from '../lib/solana';

// Get all agents
export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error });
  }
};

// Get agent by ID
export const getAgentById = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent', error });
  }
};

// Create new agent
export const createAgent = async (req: Request, res: Response) => {
  try {
    const { 
      agentId, 
      name, 
      hotkey, 
      coldkey, 
      dailyLimit, 
      endpoint, 
      serviceAPI, 
      paymentAPI 
    } = req.body;

    // Verify coldkey signature
    const isValid = await verifySignature(coldkey, req.body.signature);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ agentId });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    // Create new agent
    const agent = new Agent({
      agentId,
      name,
      hotkey,
      coldkey,
      dailyLimit,
      endpoint,
      serviceAPI,
      paymentAPI,
      status: 'active'
    });

    const savedAgent = await agent.save();
    res.status(201).json(savedAgent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating agent', error });
  }
};

// Update agent details
export const updateAgent = async (req: Request, res: Response) => {
  try {
    const { agentId, ...updateData } = req.body;
    
    // Verify coldkey signature
    const isValid = await verifySignature(updateData.coldkey, req.body.signature);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent', error });
  }
};

// Delete agent
export const deleteAgent = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting agent', error });
  }
};

// Toggle agent status
export const toggleAgentStatus = async (req: Request, res: Response) => {
  try {
    const { coldkey } = req.body;
    
    // Verify coldkey signature
    const isValid = await verifySignature(coldkey, req.body.signature);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Toggle status
    agent.status = agent.status === 'active' ? 'inactive' : 'active';
    agent.updatedAt = new Date();
    
    const updatedAgent = await agent.save();
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling agent status', error });
  }
};

// Update agent daily limit
export const updateAgentLimit = async (req: Request, res: Response) => {
  try {
    const { dailyLimit, coldkey } = req.body;
    
    // Verify coldkey signature
    const isValid = await verifySignature(coldkey, req.body.signature);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { 
        dailyLimit, 
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent limit', error });
  }
};