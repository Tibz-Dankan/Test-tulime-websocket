import "./App.css";

import { TulimeWebSocketClient } from "./components/TulimeSocketIOClient";

function App() {
  return (
    <>
      <div>
        <TulimeWebSocketClient />
      </div>
    </>
  );
}

export default App;
