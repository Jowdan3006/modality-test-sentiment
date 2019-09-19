import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MainComponent from '../components/MainComponent'
import ProgressBarExample from '../components/ProgressBarExample'

class App extends Component {
  render() {
    return (
      <div>
        Yolo
        <MainComponent />
        <ProgressBarExample />
      </div>
    )
  }
}

export default App;