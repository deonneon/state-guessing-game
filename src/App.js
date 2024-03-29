import React, { useState, useEffect } from "react";
import "./App.css";
import MapChart from "./MapChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

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
  const [scores, setScores] = useState([]);
  const [easyMode, setEasyMode] = useState(false);
  const [reveal, setReveal] = useState(false);

  const [difficulty, setDifficulty] = useState("Normal");
  const [revealClicked, setRevealClicked] = useState(false);
  const iconColor = timeLeft < 600 ? "red" : "black";
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  function clearLocalStorage() {
    localStorage.clear();
    console.log("Local Storage cleared.");
    setScores([]); // Reset the scores state to an empty array
  }

  const setFullHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    setFullHeight();
    window.addEventListener("resize", setFullHeight);
    window.addEventListener("orientationchange", setFullHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", setFullHeight);
      window.removeEventListener("orientationchange", setFullHeight);
    };
  }, []);

  const handleInputFocus = () => {
    setKeyboardVisible(true);
  };

  const handleInputBlur = () => {
    setKeyboardVisible(false);
  };

  const handleReveal = () => {
    if (!revealClicked) {
      setReveal(true);
      setRevealClicked(true);
    }
  };

  const handleChange = (event) => {
    setGuess(event.target.value);
    if (!isRunning && event.target.value !== "") {
      setIsRunning(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedGuess = guess.trim();
    if (
      states
        .map((state) => state.toLowerCase())
        .includes(trimmedGuess.toLowerCase())
    ) {
      if (
        !guessedStates
          .map((state) => state.toLowerCase())
          .includes(trimmedGuess.toLowerCase())
      ) {
        const correctState = states.find(
          (state) => state.toLowerCase() === trimmedGuess.toLowerCase()
        );
        const newGuessedStates = [...guessedStates, correctState];
        setGuessedStates(newGuessedStates);
        setMessage("");

        if (newGuessedStates.length === 50) {
          setIsRunning(false);
          setMessage("Congratulations! You have guessed all states!");
          const newScore = {
            time: formatTime(600 - timeLeft),
            states: newGuessedStates.length,
            difficulty: difficulty,
          };
          setScores([...scores, newScore]);
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
        // Using a functional update for 'setScores'
        setScores([
          ...scores,
          {
            time: formatTime(600 - timeLeft),
            states: guessedStates.length,
            difficulty: difficulty, // Add difficulty level to the score object
          },
        ]);
      }
    }
    return () => clearTimeout(id);
  }, [timeLeft, isRunning, guessedStates.length, scores, difficulty]);

  const updateScores = () => {
    const newScores = [
      ...scores,
      {
        time: formatTime(600 - timeLeft),
        states: guessedStates.length,
        difficulty: difficulty,
      },
    ];
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
  };

  useEffect(() => {
    const loadedScores = JSON.parse(localStorage.getItem("scores")) || [];
    setScores(loadedScores);
  }, []);

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setMessage("");
      updateScores();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(600);
    setGuessedStates([]);
    setGuess("");
    setMessage("");
    setReveal(false);
    setRevealClicked(false);
  };

  return (
    <div className="App">
      <div
        className={`main-column ${
          keyboardVisible ? "main-column-adjusted" : ""
        }`}
      >
        <div className="app-map">
          <MapChart
            guessedStates={guessedStates.map(
              (state) => stateAbbreviations[state]
            )}
            easyMode={easyMode}
            reveal={reveal}
          />
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(guessedStates.length / 50) * 100}%` }}
            ></div>
            <div className="text-container">
              <p>{50 - guessedStates.length} states left</p>
            </div>
          </div>
          {!keyboardVisible && (
            <div className="game-description">
              State Sprint: Are you ready to put your US geography skills to the
              test? In this high-states race against time, your goal is to list
              as many states as possible within the given time limit.{" "}
            </div>
          )}
          {!keyboardVisible && (
            <div className="toggle-difficulty">
              <button
                className={difficulty === "Easy" ? "active" : ""}
                onClick={() => {
                  setDifficulty("Easy");
                  setEasyMode(true);
                }}
              >
                Easy
              </button>
              <button
                className={difficulty === "Normal" ? "active" : ""}
                onClick={() => {
                  setDifficulty("Normal");
                  setEasyMode(false);
                }}
              >
                Normal
              </button>
              <button
                className={difficulty === "Hard" ? "active" : ""}
                onClick={() => {
                  setDifficulty("Hard");
                  setEasyMode(false);
                }}
              >
                Hard
              </button>
            </div>
          )}
          <p className="status-message">{message}</p>
        </div>
        <div
          className={`app-body ${
            keyboardVisible ? "hide-content-keyboard" : ""
          } ${difficulty === "Hard" ? "center-content" : ""}`}
        >
          <div
            className={`app-content ${
              difficulty === "Hard" ? "hide-content" : ""
            }`}
          >
            <div className="guessed-states">
              {states.map((state, index) => {
                const isGuessed = guessedStates.includes(state);
                const displayText = reveal || isGuessed ? state : null;
                const displayBlanks =
                  !reveal && !isGuessed ? "_________" : null;
                const displayColor = reveal && !isGuessed ? "red" : "black";
                const blankColor = "lightgray";

                return (
                  <p key={index} style={{ color: displayColor }}>
                    {displayText}
                    <span style={{ color: blankColor }}>{displayBlanks}</span>
                  </p>
                );
              })}
            </div>
          </div>
          {scores.length > 0 && (
            <div
              className={`score-panel ${
                difficulty === "Hard" ? "half-width" : ""
              }`}
            >
              <h3>Records</h3>
              <div className="score-labels">
                <p>Time</p>
                <p># Guessed</p>
              </div>
              {scores
                .filter((score) => score.difficulty === difficulty)
                .map((score, index) => (
                  <div key={index} className="score-labels">
                    <span>{score.time}</span>
                    <span>{score.states}</span>
                  </div>
                ))}
              <button onClick={clearLocalStorage} className="clear-button">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="input-panel">
        <form className="form-quiz" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={guess}
              placeholder="Enter a state to start"
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
          </div>

          <div className="form2">
            <div>
              <input type="submit" value="Submit" />
              {isRunning && (
                <button type="button" onClick={handleStop}>
                  Stop
                </button>
              )}

              {(isRunning || revealClicked) && (
                <button type="button" onClick={handleReset}>
                  Reset
                </button>
              )}
              {!revealClicked && (
                <button type="button" onClick={handleReveal}>
                  Reveal
                </button>
              )}
            </div>
            <div className="time-container">
              <FontAwesomeIcon icon={faClock} style={{ color: iconColor }} />
              <span> </span>
              {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
