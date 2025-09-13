import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [stringList, setStringList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch strings from backend on component mount
  useEffect(() => {
    fetchStrings();
  }, []);

  const fetchStrings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/strings`);
      if (!response.ok) {
        throw new Error('Failed to fetch strings');
      }
      const data = await response.json();
      setStringList(data.strings || []);
      setError('');
    } catch (err) {
      setError('Failed to load strings. Please try again.');
      console.error('Error fetching strings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter some text');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/strings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to add string');
      }

      const data = await response.json();
      setStringList(prev => [...prev, data.string]);
      setInputValue('');
      setError('');
    } catch (err) {
      setError('Failed to add string. Please try again.');
      console.error('Error adding string:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/strings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete string');
      }

      setStringList(prev => prev.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete string. Please try again.');
      console.error('Error deleting string:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>String List App</h1>
        
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter some text..."
            className="text-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !inputValue.trim()}
          >
            {loading ? 'Adding...' : 'Enter'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="string-list">
          <h2>Entered Strings:</h2>
          {loading && stringList.length === 0 ? (
            <div className="loading">Loading...</div>
          ) : stringList.length === 0 ? (
            <div className="empty-state">No strings entered yet.</div>
          ) : (
            <ul className="list">
              {stringList.map((item) => (
                <li key={item.id} className="list-item">
                  <span className="text">{item.text}</span>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="delete-button"
                    title="Delete this string"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;