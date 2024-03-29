
import React from "react";
import Timer from "./components/timer/Timer";
import TimerOnRef from "./components/timer/TimerOnRef";

const App = () => {
  const settings = null
  const onTimerCompleted = null
  return (
      <div className="App">
          <Timer
              id="timer-1"
              settings={settings}
              onComplete={onTimerCompleted}
          >
            {(h, m, s) => <span>{(new Date(0,0,0, h, m, s)).toTimeString().split(' ')[0]}</span>}
          </Timer>
          <TimerOnRef
              id="timer-2"
              settings={settings}
              onComplete={onTimerCompleted}
          >
              {(h, m, s) => <span>{(new Date(0,0,0, h, m, s)).toTimeString().split(' ')[0]}</span>}
          </TimerOnRef>
      </div>
  );
}

export default App;
