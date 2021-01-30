import React, { useState } from "react";
import wheel from './wheel.svg';
import ReactPlayer from 'react-player/file'

async function getMap({timestamp}) {
  const url = (
    `http://192.168.0.110:8000/map/${timestamp}`
  )
  const response = await fetch(url)
  const coords = await response.json()
  return coords.longitude.map((e, i) => {
    return `${e},${coords.latitude[i]}`
  }).join(" ")
}

function App({timestamp}) {
  const [telemetry, setTelemetry] = useState({});
  const getMetrics = async (progress) => {
    const url = (
      `http://192.168.0.110:8000/telemetry/${timestamp}/`
      + `${Math.floor(progress.playedSeconds * 1000)}`
    )
    const response = await fetch(url)
    const telemetry = await response.json()
    setTelemetry(telemetry)
  }


  return (
    <div className="App">
      <header className="App-header">
        AX Viewer<br/>
        <a href='static/plot-2021-01-17-11_15_03.png' target='_blank'>
          Fit plot
        </a>
      </header>
      <ReactPlayer
        url='static/laps-2021-01-17-11_15_03.mp4'
        controls={true}
        playsinline={true}
        progressInterval={50}
        onProgress={getMetrics}
      /><br/>
    {telemetry["Speed (MPH)"]} MPH <></>
    <img
      src={wheel}
      width="40"
      style={{transform: `rotate(${telemetry["Steering Angle (deg)"]}deg)`}}
      alt="Steering Angle"
    /><br/>
    <label for="throttle">Throttle: </label><progress
        id="throttle"
        value={telemetry["Throttle Position (%)"]}
        max="100">
      telemetry["Throttle Position (%)"]%
    </progress>
    <label for="brake">Brake: </label><progress
        id="brake"
        value={telemetry["Brake Pressure (bar)"]}
        min="1"
        max="20">
      telemetry["Brake Pressure (bar)"]%
    </progress><br/><br/>
    </div>
  );
}
    // <svg>
    //   <polyline
    //       points={await getMap(timestamp)}
    //       stroke="red"
    //       strokeWidth="3"
    //       fill="none" />
    // </svg>

export default App;
