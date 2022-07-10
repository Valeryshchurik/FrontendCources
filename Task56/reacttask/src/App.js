
import React, {useRef, useState} from "react";
import Timer from "./components/timer/Timer";
import TimerOnRef from "./components/timer/TimerOnRef";
import SearchInput from "./components/search_input/SearchInput";


const SearchInputModes = {Immediate: 1, AfterPause:2, ByEnter: 3}

const App = () => {
  const settings = null
  const onTimerCompleted = null
  const [searchQuery, setSearchQuery] = useState('')
  const strings = ['123', 'abrpetr', 'abracadabra']
  const stringsToRender = useRef(strings)

  function filterStrings(strValue){
      stringsToRender.current.filter(
          string => {
              return (
                  string.toLowerCase().includes(strValue.toLowerCase())
              );
          }
      );
  }

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
          <SearchInput
              placeholder="Search"
              mode={SearchInputModes.Immediate}
              onSearch={filterStrings}
          />
          <ul>{stringsToRender.current.map((string) =><li>{string}</li>)}</ul>
      </div>
  );
}

export default App;
