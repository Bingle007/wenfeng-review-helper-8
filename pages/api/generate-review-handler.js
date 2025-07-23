export default async function handler(req, res) {
  const { article, stylePrompt } = req.body;
  if (!article || !stylePrompt) {
    return res.status(400).json({ error: '文章和文风提示不能为空' });
  }

  const prompt = `请模仿以下文风，对一篇文章生成“见、感、思、行”四段点评，每段不超过100字：
风格提示：${stylePrompt}
文章内容：${article}`;

  const payload = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一个文风模仿点评专家。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
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
      return res.status(response.status).json({ error: errorData.error || '点评生成失败' });
    }

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "调用失败" });
  }
}
