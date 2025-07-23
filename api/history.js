import fs from 'fs';
import path from 'path';

const HISTORY_DIR = path.join(process.cwd(), 'history');

// 确保历史记录目录存在
if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        // 读取所有历史记录文件
        const files = fs.readdirSync(HISTORY_DIR);
        const history = files
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const content = fs.readFileSync(path.join(HISTORY_DIR, file), 'utf8');
            return JSON.parse(content);
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json({ history });
      } catch (err) {
        console.error('读取历史记录失败:', err);
        res.status(500).json({ error: '无法读取历史记录' });
      }
      break;

    case 'POST':
      try {
        const { article, style, review, template } = body;

        if (!article || !review) {
          return res.status(400).json({ error: '文章内容和点评结果不能为空' });
        }

        // 创建历史记录对象
        const historyItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          article: article.substring(0, 100) + '...', // 存储文章摘要
          style,
          review,
          template: template?.name || '默认模板'
        };

        // 保存到文件
        const filePath = path.join(HISTORY_DIR, `${historyItem.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(historyItem, null, 2));

        res.status(201).json({ success: true, historyItem });
      } catch (err) {
        console.error('保存历史记录失败:', err);
        res.status(500).json({ error: '无法保存历史记录' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}