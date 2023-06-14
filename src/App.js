import React, { useState, useEffect } from 'react';
import './App.css';
import MapChart from "./MapChart";


const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
].sort();

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${formattedSeconds}`;
}

function App() {
  const [guess, setGuess] = useState('');
  const [guessedStates, setGuessedStates] = useState([]);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [scores, setScores] = useState([]);

  const handleChange = (event) => {
    setGuess(event.target.value);
    if (!isRunning && event.target.value !== '') {
      setIsRunning(true);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (states.map(state => state.toLowerCase()).includes(guess.toLowerCase())) {
      if (!guessedStates.map(state => state.toLowerCase()).includes(guess.toLowerCase())) {
        const correctState = states.find(state => state.toLowerCase() === guess.toLowerCase());
        setGuessedStates([...guessedStates, correctState]);
        setMessage('');
        if (guessedStates.length + 1 === 50) {
          setIsRunning(false);
          setMessage('Congratulations! You have guessed all states!');
          setScores([...scores, { time: formatTime(600 - timeLeft), states: guessedStates.length + 1 }]);
        }
      } else {
        setMessage('This state has already been guessed');
      }
    } else {
      setMessage('Invalid state name');
    }
    setGuess('');
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      setTimerId(id);
    } else if (!isRunning && timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    setScores([...scores, { time: formatTime(600 - timeLeft), states: guessedStates.length }]);
  }

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(600);
    setGuessedStates([]);
    setGuess('');
    setMessage('');
    setScores([...scores, { time: formatTime(600 - timeLeft), states: guessedStates.length }]);
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      setTimerId(id);
    } else if (!isRunning && timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setMessage('Time is over!');
      setScores([...scores, { time: formatTime(600 - timeLeft), states: guessedStates.length }]);
    }
  }, [timeLeft, isRunning]);
  

  return (
    <div>
      <div className="app-map">
        <MapChart />
      </div>
      <div className="app-body">
        <div className="app-content">
          <div className="input-panel">
            <form onSubmit={handleSubmit}>
              <input type="text" value={guess} onChange={handleChange} />
              <input type="submit" value="Submit" />
              <button onClick={handleStop}>Stop</button>
              <button onClick={handleReset}>Reset</button>
            </form>
            <div>
              Time left: {Math.floor(timeLeft / 60)}:{('0' + timeLeft % 60).slice(-2)}
            </div>
            </div>
            <p className="status-message">{message}</p>
            <div className="guessed-states">
              {states.map((state, index) => (
                  <p key={index}>{guessedStates.includes(state) ? state : '_________'}</p>
              ))}
          </div>
          <p>{50 - guessedStates.length} states left</p>
        </div>
        <div className="score-panel">
          <h2>Previous Scores</h2>
          <div className="score-labels">
            <p>Time Spent</p>
            <p>States Guessed</p>
          </div>
          {scores.map((score, index) => (
            <div key={index} className="score-labels">
              <span>{score.time}</span>
              <span>{score.states}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;