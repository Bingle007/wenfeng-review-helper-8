import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

// 确保模板目录存在
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

export default async function handler(req, res) {
  const { method, body } = req;
  const { templateId, template, action } = body;

  // 读取所有模板
  const getTemplates = () => {
    if (!fs.existsSync(TEMPLATES_DIR)) return [];
    const files = fs.readdirSync(TEMPLATES_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf8');
        return JSON.parse(content);
      });
  };

  switch (method) {
    case 'GET':
      const templates = getTemplates();
      res.status(200).json({ templates });
      break;
    case 'POST':
      if (action === 'add') {
        const newTemplate = {
          id: Date.now().toString(),
          name: template.name,
          content: template.content,
          createdAt: new Date().toISOString()
        };
        const filePath = path.join(TEMPLATES_DIR, `${newTemplate.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newTemplate, null, 2));
        res.status(201).json({ template: newTemplate });
      } else if (action === 'delete') {
        const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({ error: '模板不存在' });
        }
      } else if (action === 'update') {
        const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`);
        if (fs.existsSync(filePath)) {
          const existingTemplate = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const updatedTemplate = { ...existingTemplate, ...template };
          fs.writeFileSync(filePath, JSON.stringify(updatedTemplate, null, 2));
          res.status(200).json({ template: updatedTemplate });
        } else {
          res.status(404).json({ error: '模板不存在' });
        }
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}