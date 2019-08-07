import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import * as mmb from 'music-metadata-browser';

class App extends Component {

  // metadata and file data

  constructor(props) {
    super(props);
    this.state = {
      parseResults: []
    };
  }

  render() {

    console.log('render called');

    const htmlParseResults = [];

    for (const parseResult of this.state.parseResults) {

      console.log(`metadata ${parseResult.file.name}`, parseResult);

      const htmlMetadata = parseResult.metadata ? (
        <table>
          <tbody>
          <tr>
            <th>Container</th>
            <td>{parseResult.metadata.format.container}</td>
          </tr>
          <tr>
            <th>Codec</th>
            <td>{parseResult.metadata.format.codec}</td>
          </tr>
          <tr>
            <th>Bit-rate</th>
            <td>{parseResult.metadata.format.bitrate}</td>
          </tr>
          </tbody>
        </table>
      ) : ( parseResult.error ? (<p className="App-error">{parseResult.error}</p>) : (<p>Parsing...</p>));

      htmlParseResults.push(
        <div key={parseResult.file.name}>
          <h3>{parseResult.file.name}</h3>
          {htmlMetadata}
        </div>
      );
    }

    if (this.state.parseResults.length === 0) {
      htmlParseResults.push(<div key="message">Please choose an audio file</div>);
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <a className="App-link" href="https://github.com/Borewit/music-metadata-browser"
             target="_blank">music-metadata-browser</a> &
          <a className="App-link" href="https://reactjs.org" target="_blank">React</a>
        </header>

        <input type="file" name="file" onChange={this.onChangeHandler}/>

        {htmlParseResults}

      </div>
    );
  }

  onChangeHandler = async (event) => {

    this.setState({
      parseResults: []
    });

    for (const file of event.target.files) {

      const parseResult = {
        file: file
      };

      this.setState(state => {
        state.parseResults.push(parseResult);
        return state;
      });

      try {
        const metadata = await this.parseFile(file);
        // Update GUI
        this.setState(state => {
          state.parseResults[state.parseResults.length - 1].metadata = metadata;
          return state;
        });

      } catch(err) {
        this.setState(state => {
          state.parseResults[state.parseResults.length - 1].error = err.message;
          return state;
        });
      }
    }
  };

  async parseFile(file) {
    console.log(`Parsing file "${file.name}" of type ${file.type}`);

    return mmb.parseBlob(file, {native: true}).then(metadata => {
      console.log(`Completed parsing of ${file.name}:`, metadata);
      return metadata;
    })
  }

}

export default App;
