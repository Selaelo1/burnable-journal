// src/Journal.js
import React, { useState, useEffect } from 'react';
import './Journal.css';
import { Button } from 'react-bootstrap';
import fireGif from './Fire GIF - Fire - Discover & Share GIFs.gif'; // Adjust the path as needed

const greetings = {
  morning: "Good morning, mama! 🌞 Ready to embrace the day?",
  afternoon: "Good afternoon, my love! 🌼 How's your day going?",
  evening: "Good evening, baby! 🌙 Hope you’re winding down nicely.",
};

const feelingsMessages = {
  happy: "I'm so glad to hear you're feeling happy! Keep spreading that joy!",
  sad: "It’s okay to feel sad sometimes. Remember, I’m here for you.",
  stressed: "Take a deep breath. You’re doing amazing.",
  excited: "Yay! That’s fantastic! Let’s celebrate!",
  frustrated: "I get it—frustration can be tough. Let’s find a way to release that energy.",
};

const feelingsColors = {
  happy: '#ffe0a1',    
  sad: '#a3c1f3',      
  stressed: '#ffccbc', 
  excited: '#c8e6c9',  
  frustrated: '#ef9a9a' 
};

const Journal = () => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [feeling, setFeeling] = useState(() => JSON.parse(localStorage.getItem('feeling')) || '');
  const [message, setMessage] = useState('');
  const [entry, setEntry] = useState(() => JSON.parse(localStorage.getItem('entry')) || '');
  const [savedEntries, setSavedEntries] = useState(() => JSON.parse(localStorage.getItem('journalEntries')) || []);
  const [image, setImage] = useState(() => JSON.parse(localStorage.getItem('image')) || '');
  const [burnt, setBurnt] = useState(() => JSON.parse(localStorage.getItem('burnt')) || false);
  const [showEntries, setShowEntries] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fireAnimation, setFireAnimation] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    const saved = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setSavedEntries(saved);
  }, []);

  useEffect(() => {
    if (feeling) {
      document.body.style.backgroundColor = feelingsColors[feeling];
    }
    localStorage.setItem('feeling', JSON.stringify(feeling));
    localStorage.setItem('entry', JSON.stringify(entry));
    localStorage.setItem('image', JSON.stringify(image));
    localStorage.setItem('burnt', JSON.stringify(burnt));
  }, [feeling, entry, image, burnt]);

  const handleFeelingChange = (event) => {
    const selectedFeeling = event.target.value;
    setFeeling(selectedFeeling);
    setMessage(feelingsMessages[selectedFeeling]);
  };

  const handleEntryChange = (event) => {
    setEntry(event.target.value);
    setErrorMessage('');
  };

  const handleSaveEntry = () => {
    if (!entry) {
      setErrorMessage('Please write something before saving.');
      return;
    }

    const date = new Date().toLocaleString();
    const newEntry = { feeling: feeling || null, text: entry, image, date };
    const updatedEntries = [...savedEntries, newEntry];
    setSavedEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setEntry('');
    setImage('');
    setFeeling('');
    setMessage('');
  };

  const handleBurn = () => {
    if (!entry) {
      setErrorMessage('Please write something before burning.');
      return;
    }

    setFireAnimation(true);
    setBurnt(true);
    localStorage.setItem('burnt', JSON.stringify(true));
    setEntry('');
    setFeeling('');
    setImage('');
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = savedEntries.filter((_, i) => i !== index);
    setSavedEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const handleDeleteImage = () => {
    setImage('');
  };

  const handleGoHome = () => {
    setBurnt(false);
    setShowEntries(false);
    setFireAnimation(false);
    setFeeling('');
    setEntry('');
    setImage('');
    setMessage('');
    setErrorMessage('');
    localStorage.removeItem('feeling');
    localStorage.removeItem('image');
    localStorage.removeItem('burnt');
  };

  return (
    <div className="journal" style={{ padding: '20px', borderRadius: '15px', transition: 'background-color 0.5s ease', position: 'relative' }}>
      {fireAnimation && <img src={fireGif} alt="Fire Animation" className="fire-animation" />}
      {burnt ? (
        <div className="fire-message">
          <h2>Your entry has been burned. 🕊️</h2>
          <p>Now that you've burned this entry, I hope you feel lighter. You are loved dearly! ❤️</p>
          <p>If you want a hug, let me know. I will always be there for you. 🤗</p>
          <Button variant="primary" onClick={handleGoHome} style={{ marginTop: '10px' }}>
            Back to Home 🏠
          </Button>
        </div>
      ) : (
        <>
          <h1>{greetings[timeOfDay]}</h1>
          <div>
            <div className="form-group">
              <label>How are you feeling?</label>
              <select className="form-control" value={feeling} onChange={handleFeelingChange}>
                <option value="">Select your feeling</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="stressed">Stressed</option>
                <option value="excited">Excited</option>
                <option value="frustrated">Frustrated</option>
              </select>
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="form-group">
              <label>Write down what you're feeling:</label>
              <textarea
                className="form-control"
                rows="4"
                value={entry}
                onChange={handleEntryChange}
                placeholder="Express your thoughts here..."
              />
            </div>
            {image && (
              <div className="form-group">
                <img src={image} alt="Journal visual" style={{ width: '100%', marginTop: '10px' }} />
                <Button variant="danger" onClick={handleDeleteImage} style={{ marginTop: '10px' }}>
                  Delete Image ❌
                </Button>
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={handleSaveEntry} style={{ marginRight: '10px' }}>
                Save Entry 💾
              </button>
              <button className="btn btn-danger" onClick={handleBurn} style={{ marginRight: '10px' }}>
                Burn This Page 🔥
              </button>
              <Button variant="outline-secondary" onClick={() => setShowEntries(!showEntries)}>
                {showEntries ? 'Hide Entries' : 'Show Entries'} 📖
              </Button>
            </div>
            {showEntries && (
              <div style={{ marginTop: '20px' }}>
                <h3>Saved Entries:</h3>
                {savedEntries.length === 0 ? (
                  <p>No entries saved yet.</p>
                ) : (
                  <ul className="list-group">
                    {savedEntries.map((entry, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {entry.feeling && <strong>Feeling:</strong>} {entry.feeling && entry.feeling} <br />
                          <strong>Entry:</strong> {entry.text} <br />
                          <strong>Date:</strong> {entry.date} <br />
                          {entry.image && <img src={entry.image} alt="Entry visual" style={{ width: '50px', marginTop: '5px' }} />}
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEntry(index)}>
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Journal;
