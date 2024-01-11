import React, { useState, useEffect } from "react";
import "./App.css";
import MapChart from "./MapChart";

const stateAbbreviations = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
].sort();

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${formattedSeconds}`;
}

function App() {
  const [guess, setGuess] = useState("");
  const [guessedStates, setGuessedStates] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [scores, setScores] = useState([]);
  const [easyMode, setEasyMode] = useState(false);
  const [reveal, setReveal] = useState(false);

  const handleReveal = () => {
    setReveal(true);
  };

  const handleEasyModeToggle = () => {
    setEasyMode(!easyMode);
  };

  const handleChange = (event) => {
    setGuess(event.target.value);
    if (!isRunning && event.target.value !== "") {
      setIsRunning(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      states.map((state) => state.toLowerCase()).includes(guess.toLowerCase())
    ) {
      if (
        !guessedStates
          .map((state) => state.toLowerCase())
          .includes(guess.toLowerCase())
      ) {
        const correctState = states.find(
          (state) => state.toLowerCase() === guess.toLowerCase()
        );
        setGuessedStates([...guessedStates, correctState]);
        setMessage("");
        if (guessedStates.length + 1 === 50) {
          setIsRunning(false);
          setMessage("Congratulations! You have guessed all states!");
          setScores([
            ...scores,
            {
              time: formatTime(600 - timeLeft),
              states: guessedStates.length + 1,
            },
          ]);
        }
      } else {
        setMessage("This state has already been guessed");
      }
    } else {
      setMessage("Invalid state name");
    }
    setGuess("");
  };

  useEffect(() => {
    let id;
    if (isRunning && timeLeft > 0) {
      id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 || !isRunning) {
      clearTimeout(id);
      setIsRunning(false);
      if (timeLeft === 0) {
        setMessage("Time is over!");
        setScores([
          ...scores,
          { time: formatTime(600 - timeLeft), states: guessedStates.length },
        ]);
      }
    }
    return () => clearTimeout(id);
  }, [timeLeft, isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    setMessage("");
    setScores([
      ...scores,
      { time: formatTime(600 - timeLeft), states: guessedStates.length },
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(600);
    setGuessedStates([]);
    setGuess("");
    setMessage("");
    setGuessedStates([]);
    setScores([
      ...scores,
      { time: formatTime(600 - timeLeft), states: guessedStates.length },
    ]);
  };

  return (
    <div className="App">
      <div className="app-map">
        <MapChart
          guessedStates={guessedStates.map(
            (state) => stateAbbreviations[state]
          )}
          easyMode={easyMode}
          reveal={reveal}
        />
      </div>
      <div className="app-body">
        <div className="app-content">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(guessedStates.length / 50) * 100}%` }}
            ></div>
          </div>
          <div className="game-description">
            State Sprint: Are you ready to put your US geography skills to the
            test? In this high-states race against time, your goal is to list as
            many states as possible within the given time limit.{" "}
          </div>
          <div className="input-panel">
            <form className="form-quiz" onSubmit={handleSubmit}>
              <input type="text" value={guess} onChange={handleChange} />
              <input type="submit" value="Submit" />
              <button type="button" onClick={handleStop}>
                Stop
              </button>
              <button type="button" onClick={handleReset}>
                Reset
              </button>
              <button onClick={handleReveal}>Reveal</button>
            </form>
            <div>
              Time left: {Math.floor(timeLeft / 60)}:
              {("0" + (timeLeft % 60)).slice(-2)}
            </div>
          </div>
          <div className="toggle-easy">
            <label>
              <input
                type="checkbox"
                checked={easyMode}
                onChange={handleEasyModeToggle}
              />
              Easy Mode
            </label>
          </div>
          <p className="status-message">{message}</p>
          <div className="guessed-states">
            {states.map((state, index) => {
              const isGuessed = guessedStates.includes(state);
              const displayText = reveal
                ? state
                : isGuessed
                ? state
                : "_________";
              const displayColor = reveal && !isGuessed ? "red" : "black";

              return (
                <p key={index} style={{ color: displayColor }}>
                  {displayText}
                </p>
              );
            })}
          </div>
          <p>{50 - guessedStates.length} states left</p>
        </div>
        <div className="score-panel">
          <h3>Previous Scores</h3>
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
