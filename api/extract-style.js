export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '请提供文章内容' });
  }

  const prompt = `分析以下文章的语言风格、句式特点、情感基调和典型句子示例，用简洁的语言总结：

文章内容：${text}`;

  const payload = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一个文风分析专家，擅长提取文章的语言风格特征。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.5
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || '文风提取失败' });
    }

    const data = await response.json();
    res.status(200).json({ style: data.choices[0].message.content });
  } catch (err) {
    console.error('文风提取API错误:', err);
    res.status(500).json({ error: '服务器内部错误，无法提取文风' });
  }
}