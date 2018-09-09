import React from 'react';
import WindowsButtons from './components/WindowsButtons';
import {remote, screen} from 'electron';
import {captureVideo} from 'electron-screencapture/index';
import moment from 'moment';
import './styles.scss';
const download = remote.require('./download')
const rlog = remote.require('./log');

const recordSvg = `
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5.5" cy="5.5" r="5" fill="#000"/>
  </svg>
`;
const stopSvg = `
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="11" height="11" fill="#000"/>
  </svg>
`;

const sleep = t => new Promise(res => setTimeout(res, t));

export default class App extends React.Component {
  state = {
    recording: false,
    message: null,
  }
  ss(update) {
    return new Promise(res => this.setState(update, res));
  }
  async toggleRecording() {
    const record = !this.state.recording;
    if (record) {
      this.countDown();
    } else if (this.recorder) {
      this.stopRecording();
    }
  }
  async countDown() {
    await this.ss({message: <div style={{fontSize:150}}>3...</div>});
    await sleep(1000);
    await this.ss({message: <div style={{fontSize:100}}>2..</div>});
    await sleep(1000);
    await this.ss({message: <div style={{fontSize:50}}>1.</div>});
    await sleep(1000);
    await this.ss({ message: null });
    this.startRecording();
  }
  async startRecording() {
    this.window = remote.getCurrentWindow();
    const bounds = this.window.getBounds();
    this.screen = screen.getDisplayMatching(bounds);
    const sourceId = this.screen.id;

    this.recorder = captureVideo({ ...bounds, sourceId });
    await this.recorder;
    
    await this.ss({ recording: true });
    this.window.setIgnoreMouseEvents(true, {forward: true});
  }
  async stopRecording() {
    this.window.setIgnoreMouseEvents(false);

    const rec = await this.recorder;
    this.recorder = null;
    await this.ss({ recording: false });

    const res = await rec.stop();
    const filename = `video_capture_${moment().format('YYYY-MM-DD-hh-mm-ssa')}.webm`
    try {
      await download(res.url, {filename});
      await this.ss({message: <div>Saved to Downloads as<br/>{filename}</div>});
    } catch (e) {
      await this.ss({message: <div>Could not save recording<br/>{e+''}</div>});
    }
  }

  mouseEnter() {
    if (this.recorder) {
      rlog('unignoring');
      this.window.setIgnoreMouseEvents(false);
    }
  }
  mouseLeave() {
    if (this.recorder) {
      rlog('ignoring');
      this.window.setIgnoreMouseEvents(true, { forward: true });
    }
  }
  render () {
    const {recording, message} = this.state;
    const offset = recording ? 0 : 2;
    return (
      <div id="frame" className={recording ? 'recording' : ''}>
        <div id="inner">
          {message && <div id="message">{message}</div>}
        </div>
        <WindowsButtons
          hideMinimize
          hideMaximize
          hideClose={recording}
          color="#555"
          style={{ position: 'fixed', top: offset, right: offset }}
          customButtons={[
            {
              icon: recording ? stopSvg : recordSvg,
              iconStyle: { backgroundColor: '#B00', },
              onClick: this.toggleRecording.bind(this),
            }
          ]}
          onMouseEnter={this.mouseEnter.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
        />
      </div>
    );
  }
}