import React, { Component } from "react";
import wheel from './wheel.svg';
import ReactPlayer from 'react-player/file'
import api_url from "./Config"

class TelemetryHelper extends Component {
  constructor() {
    super();
    this.state = { available_timestamps: [], timestamp: "2021-01-17-11_15_03" }
  }

  async componentDidMount() {
    await fetch(`${api_url}/telemetry`)
      .then(res => res.json())
      .then(json => this.setState({ available_timestamps: json.data }));
  }

  render() {
    const handleChange = e => {
      this.setState({ timestamp: e.target.selectedOptions[0].text })
    };
    const refreshTimestamps = async () => {
      await fetch(`${api_url}/telemetry`)
        .then(res => res.json())
        .then(json => this.setState({ available_timestamps: json.data }));
    }

    if (this.state.available_timestamps.length > 0) {
      return (
        <div className="TelemetryHelper">
          <label htmlFor="timestamp">Run timestamp:
            <select
              name="timestamp"
              id="timestamp"
              value={this.state.timestamp}
              onChange={handleChange}>
              {this.state.available_timestamps.map((ts) => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>
          </label>
          <button onClick={refreshTimestamps}>Check for new videos</button>

          <Telemetry timestamp={this.state.timestamp} key={this.state.timestamp} />
        </div>
      )
    } else {
      return (
        <div className="TelemetryHelper">
          No videos found or waiting for the api. Wait a few seconds and try refreshing.
        </div>
      )
    }
  }
}

class Telemetry extends Component {
  constructor({timestamp}) {
    super();
    this.timestamp = timestamp;
    this.state = { telemetry: {}, coords: {'latitude': [], 'longitude': []} };
    this.videoCallback = async (progress) => {
      const url = (
        `${api_url}/telemetry/${this.timestamp}/`
        + `${Math.floor(progress.playedSeconds * 1000)}`
      )
      const response = await fetch(url)
      const new_telemetry = await response.json()
      this.setState({telemetry: new_telemetry})
    }
  }

  async componentDidMount() {
    await fetch(`${api_url}/map/${this.timestamp}`)
      .then(res => res.json())
      .then(json => this.setState({ coords: json }));
  }

  render() {
    const mapPoints = this.state.coords.longitude.map((e, i) => {
      return `${e},${this.state.coords.latitude[i]}`
    }).join(" ")

    return (
      <div className="Telemetry">
        <header className="App-header">
          AX Viewer<br/>
          <a href={`static_files/plot-${this.timestamp}.png`} target='_blank' rel="noreferrer">
            Fit plot
          </a>
        </header>

        {/* video */}
        <ReactPlayer
          url={`static_files/laps-${this.timestamp}.mp4`}
          controls={true}
          playsinline={true}
          progressInterval={50}
          onProgress={this.videoCallback}
        /><br/>

        {/* Speed */}
        {this.state.telemetry["Speed (MPH)"]} MPH <></>

        {/* Steering */}
        <img
          src={wheel}
          width="40"
          style={{transform: `rotate(${this.state.telemetry["Steering Angle (deg)"]}deg)`}}
          alt="Steering Angle"
        /><br/>

        {/* Throttle */}
        <label htmlFor="throttle">Throttle: </label><progress
            id="throttle"
            value={this.state.telemetry["Throttle Position (%)"]}
            max="100">
          telemetry["Throttle Position (%)"]%
        </progress>

        {/* Brake */}
        <label htmlFor="brake">Brake: </label><progress
            id="brake"
            value={this.state.telemetry["Brake Pressure (bar)"]}
            min="1"
            max="100">
          telemetry["Brake Pressure (bar)"]%
        </progress><br/><br/>

        <svg width="200" viewBox="0 0 110 110">
          {/* Map */}
          <polyline
              points={mapPoints}
              stroke="grey"
              strokeWidth="3"
              fill="none" />

          {/* Position */}
          <circle
            cx={this.state.telemetry["Longitude (relative)"]}
            cy={this.state.telemetry["Latitude (relative)"]}
            r="3" stroke="red" strokeWidth="3" fill="red" />
        </svg>
      </div>
    );
  }
}

export default TelemetryHelper;
