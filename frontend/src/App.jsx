import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReviewPanel from './ReviewPanel.jsx'
import axios from 'axios'

const DEFAULT_CODE = `console.log("Hello World");`

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'java', label: 'Java', icon: 'JV' },
  { value: 'cpp', label: 'C++', icon: 'C+' },
  { value: 'go', label: 'Go', icon: 'GO' },
  { value: 'rust', label: 'Rust', icon: 'RS' },
]

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState('output') // 'output' | 'review'

  const editorRef = useRef(null)

  function handleEditorMount(editor) {
    editorRef.current = editor
  }

  async function handleReview() {
    if (!code.trim()) return
    setStatus('loading')
    setReview(null)
    setActiveTab('review')
    try {
      const res = await axios.post('/api/review', { code, language })
      setReview(res.data.review)
      setStatus('idle')
    } catch (err) {
      setErrorMsg("Review failed")
      setStatus('error')
    }
  }

  async function handleRun() {
    if (!code.trim()) return
    setActiveTab('output')
    try {
      const res = await axios.post('/api/run', { code, language })
      setOutput(res.data.output)
    } catch (err) {
      setOutput("Error running code")
    }
  }

  const currentLang = LANGUAGES.find(l => l.value === language)

  return (
    <div className="app-root">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">CodeAI</span>
            <span className="logo-bracket">/&gt;</span>
          </div>
          <span className="logo-sub">Intelligent Code Editor</span>
        </div>

        <div className="topbar-center">
          <div className="window-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="file-name">
            {`main.${language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'go' ? 'go' : 'rs'}`}
          </span>
        </div>

        <div className="topbar-right">
          <div className="status-indicator">
            <span className="status-dot" />
            <span className="status-text">Connected</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="lang-selector-wrap">
            <span className="lang-badge">{currentLang?.icon}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="btn btn-run" onClick={handleRun}>
            <span className="btn-icon">▶</span>
            <span>Run</span>
          </button>
          <button className="btn btn-review" onClick={handleReview}>
            <span className="btn-icon">✦</span>
            <span>AI Review</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Editor Section */}
        <div className="editor-section">
          <div className="section-header">
            <span className="section-label">
              <span className="section-icon">◈</span> Editor
            </span>
            <span className="line-count">{code.split('\n').length} lines</span>
          </div>
          <div className="editor-wrap">
            <Editor
              width="100%"
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(val) => {
                setCode(val || "")
                setOutput("")
              }}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                lineHeight: 1.7,
                padding: { top: 16, bottom: 16 },
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Tabs */}
          <div className="panel-tabs">
            <button
              className={`panel-tab ${activeTab === 'output' ? 'active' : ''}`}
              onClick={() => setActiveTab('output')}
            >
              <span className="tab-icon">⬡</span> Output
            </button>
            <button
              className={`panel-tab ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              <span className="tab-icon">✦</span> AI Review
              {status === 'loading' && <span className="tab-loading" />}
            </button>
          </div>

          {/* Output Tab */}
          {activeTab === 'output' && (
            <div className="output-panel">
              <div className="output-header">
                <span className="output-label">$ stdout</span>
                {output && (
                  <button
                    className="clear-btn"
                    onClick={() => setOutput("")}
                  >
                    clear
                  </button>
                )}
              </div>
              <pre className="output-content">
                {output
                  ? output
                  : <span className="output-placeholder">
                      <span className="cursor-blink">▍</span> Run your code to see output...
                    </span>
                }
              </pre>
            </div>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <div className="review-panel-wrap">
              <ReviewPanel
                review={review}
                status={status}
                errorMsg={errorMsg}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>Powered by <span className="footer-accent">Groq AI</span></span>
        <span className="footer-sep">·</span>
        <span>Monaco Editor</span>
        <span className="footer-sep">·</span>
        <span className="footer-accent">{currentLang?.label}</span>
      </footer>
    </div>
  )
}