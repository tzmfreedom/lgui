import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { input: 'hoge', tasks: [] }
  }

  onChange(e) {
    this.setState({
      input: e.target.value,
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const tasks = this.state.tasks;
    tasks.push(this.state.input);
    this.setState({
      tasks: tasks,
      input: '',
    })
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      tasks: [],
      input: '',
    })
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" onChange={this.onChange.bind(this)} value={this.state.input}/>
          <p>{this.state.input}</p>
          <input type="submit" value="Add" />
          <input type="button" value="Clear" onClick={this.onClick.bind(this)}/>
        </form>
        <ul>
          {this.state.tasks.map(task => {
            return <li>{task}</li>
          })}
        </ul>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));