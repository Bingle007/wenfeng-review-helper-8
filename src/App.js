import React, { useState, useEffect } from "react";

export default function App() {
  const [article, setArticle] = useState("");
  const [result, setResult] = useState("");
  const [styleList, setStyleList] = useState([]);
  const [currentStyle, setCurrentStyle] = useState(null);
  const [customStyle, setCustomStyle] = useState({ name: "", language: "", syntax: "", tone: "" });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("styles");
    if (saved) {
      const styles = JSON.parse(saved);
      setStyleList(styles);
      setCurrentStyle(styles[0] || null);
    }
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveStyle = () => {
    const updated = [...styleList, customStyle];
    setStyleList(updated);
    setCurrentStyle(customStyle);
    setCustomStyle({ name: "", language: "", syntax: "", tone: "" });
    localStorage.setItem("styles", JSON.stringify(updated));
  };

  const generate = async () => {
    if (!currentStyle) return alert("请先选择或添加一个点评风格！");
    setLoading(true);
    const res = await fetch("/api/generate-review-handler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article,
        stylePrompt: `语言风格：${currentStyle.language}；句式特点：${currentStyle.syntax}；情感基调：${currentStyle.tone}`
      })
    });
    const data = await res.json();
    setResult(data.result);
    const updated = [{ time: new Date().toLocaleString(), style: currentStyle.name, text: article, result: data.result }, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 960, margin: "auto", padding: 24 }}>
      <h1 style={{ color: '#0f172a' }}>📝 文风点评助手 Pro</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h3>✏️ 输入文章</h3>
          <textarea rows={8} value={article} onChange={(e) => setArticle(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ flex: 1 }}>
          <h3>🎨 选择点评风格</h3>
          <select value={currentStyle?.name || ""} onChange={(e) => {
            const s = styleList.find(x => x.name === e.target.value);
            setCurrentStyle(s);
          }} style={{ width: "100%", padding: 6 }}>
            {styleList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>

          <h4 style={{ marginTop: 12 }}>➕ 添加新风格</h4>
          <input placeholder="风格名" value={customStyle.name} onChange={e => setCustomStyle({ ...customStyle, name: e.target.value })} style={{ width: "100%", marginBottom: 4 }} />
          <input placeholder="语言风格" value={customStyle.language} onChange={e => setCustomStyle({ ...customStyle, language: e.target.value })} style={{ width: "100%", marginBottom: 4 }} />
          <input placeholder="句式特点" value={customStyle.syntax} onChange={e => setCustomStyle({ ...customStyle, syntax: e.target.value })} style={{ width: "100%", marginBottom: 4 }} />
          <input placeholder="情感基调" value={customStyle.tone} onChange={e => setCustomStyle({ ...customStyle, tone: e.target.value })} style={{ width: "100%", marginBottom: 4 }} />
          <button onClick={saveStyle}>保存风格</button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={generate} disabled={loading} style={{ padding: "8px 16px", background: "#0ea5e9", color: "#fff", border: "none" }}>
          {loading ? "生成中..." : "✅ 生成点评"}
        </button>
      </div>

      {result && (
        <div style={{ background: "#f1f5f9", marginTop: 24, padding: 16, whiteSpace: "pre-wrap" }}>
          <h3>点评结果</h3>
          <div>{result}</div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>📜 历史记录（最近10条）</h3>
          {history.map((h, i) => (
            <details key={i} style={{ marginBottom: 8 }}>
              <summary>{h.time} - {h.style}</summary>
              <div style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>
                <strong>输入：</strong>{h.text}
                <br />
                <strong>点评：</strong>{h.result}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
