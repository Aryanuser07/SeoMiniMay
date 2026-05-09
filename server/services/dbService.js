const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/localseo.db.json');
const dbDir = path.dirname(DB_PATH);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Simple JSON-based persistence (no native build tools needed)
let data = { projects: [], outputs: [], nextProjectId: 1, nextOutputId: 1 };

if (fs.existsSync(DB_PATH)) {
  try {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    console.log('[DB] Loaded', data.projects.length, 'projects from disk');
  } catch {
    console.log('[DB] Fresh database');
  }
}

function persist() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function saveProject(input) {
  const project = {
    id: data.nextProjectId++,
    business_name: input.businessName,
    category: input.category,
    location: input.location,
    description: input.description || '',
    target_audience: input.targetAudience || '',
    created_at: new Date().toISOString()
  };
  data.projects.push(project);
  persist();
  console.log('[DB] Saved project ID:', project.id);
  return project.id;
}

function saveOutputs(projectId, outputs) {
  const output = {
    id: data.nextOutputId++,
    project_id: projectId,
    keywords: JSON.stringify(outputs.keywords),
    gmb_post: outputs.gmbPost,
    seo_description: outputs.seoDescription,
    created_at: new Date().toISOString()
  };
  data.outputs.push(output);
  persist();
  return output.id;
}

function formatProject(project, output) {
  return {
    id: project.id,
    businessName: project.business_name,
    category: project.category,
    location: project.location,
    description: project.description,
    targetAudience: project.target_audience,
    createdAt: project.created_at,
    outputs: output ? {
      keywords: JSON.parse(output.keywords),
      gmbPost: output.gmb_post,
      seoDescription: output.seo_description
    } : null
  };
}

function getAllProjects() {
  return [...data.projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(project => {
      const output = data.outputs.find(o => o.project_id === project.id);
      return formatProject(project, output);
    });
}

function getProjectById(id) {
  const project = data.projects.find(p => p.id === id);
  if (!project) return null;
  const output = data.outputs.find(o => o.project_id === id);
  return formatProject(project, output);
}

console.log('[DB] JSON database ready at', DB_PATH);

module.exports = { saveProject, saveOutputs, getAllProjects, getProjectById };
