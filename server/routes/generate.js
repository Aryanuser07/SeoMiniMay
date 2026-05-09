const express = require('express');
const router = express.Router();
const { generateAll } = require('../services/llmService');
const { saveProject, saveOutputs } = require('../services/dbService');

// POST /api/generate
router.post('/', async (req, res, next) => {
  try {
    const { businessName, category, location, description, targetAudience } = req.body;

    // Validation
    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ error: 'Business name is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Business category is required' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const businessData = {
      businessName: businessName.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description?.trim() || '',
      targetAudience: targetAudience?.trim() || ''
    };

    console.log(`[GENERATE] Starting generation for: ${businessData.businessName} (${businessData.category}, ${businessData.location})`);

    // Run 3-step LLM chain
    const outputs = await generateAll(businessData);

    // Save to database
    const projectId = saveProject(businessData);
    saveOutputs(projectId, outputs);

    console.log(`[GENERATE] Saved project ID: ${projectId}`);

    res.json({
      success: true,
      project: { id: projectId, ...businessData },
      outputs
    });
  } catch (err) {
    console.error('[GENERATE ERROR]', err);
    next(err);
  }
});

module.exports = router;
