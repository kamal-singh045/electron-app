import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

interface HelloResponse {
  success: boolean
  message: string
  data?: {
    message: string
    timestamp: string
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [response, setResponse] = useState<HelloResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callBackendHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<HelloResponse>('http://localhost:3001/api/hello')
      setResponse(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch from backend')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Express</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={callBackendHello} disabled={loading}>
          {loading ? 'Loading...' : 'Call Backend API'}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green', borderRadius: '5px' }}>
          <h3>✅ Backend Response:</h3>
          <p><strong>Message:</strong> {response.message}</p>
          {response.data && (
            <>
              <p><strong>Data Message:</strong> {response.data.message}</p>
              <p><strong>Timestamp:</strong> {response.data.timestamp}</p>
            </>
          )}
        </div>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
