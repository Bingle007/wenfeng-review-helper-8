import React, { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('')
  const [review, setReview] = useState('')

  const extractStyle = async () => {
    try {
      const res = await axios.post('/api/extract-style', { text })
      setStyle(res.data.style)
    } catch (err) {
      alert('提取失败，请检查后端接口')
    }
  }

  const generateReview = async () => {
    try {
      const res = await axios.post('/api/generate-review-handler', {
        article: text,  // 将text重命名为article以匹配后端参数
        stylePrompt: style  // 将style重命名为stylePrompt以匹配后端参数
      });
      setReview(res.data.result);  // 将res.data.review改为res.data.result以匹配后端响应
    } catch (err) {
      console.error('生成点评失败:', err);  // 添加详细错误日志
      alert('生成失败: ' + (err as Error).message);  // 显示具体错误信息
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>文风点评助手</h1>
      <textarea
        placeholder="粘贴文章内容或链接"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', minHeight: '200px', padding: '10px', fontSize: '16px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      <div>
        <button onClick={extractStyle} style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>提取文风</button>
        <button onClick={generateReview} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>生成点评</button>
      </div>
      {style && (
        <div>
          <h3>提取的文风</h3>
          <pre>{style}</pre>
        </div>
      )}
      {review && (
        <div>
          <h3>点评内容</h3>
          <pre>{review}</pre>
        </div>
      )}
    </div>
  )
}
