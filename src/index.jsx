import React from 'react';
import {render} from 'react-dom';
import jsforce from 'jsforce';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { records: [] }
  }

  componentDidMount() {
    jsforce.browser.init({
      clientId: 'xxxx',
      redirectUri: 'http://localhost:8081',
    })
    const app = this
    jsforce.browser.on('connect', function(conn) {
      // console.log(conn.accessToken)
      conn.query('SELECT Id, Name FROM Account', function(err, res) {
        if (err) { return console.error(err); }
        app.setState({
          records: res.records,
        })
      })
    })
  }

  login() {
    jsforce.browser.login()
  }

  render () {
    return (
      <div>
        <input type="button" onClick={this.login.bind(this)} value="Login"/>
        <table>
          {this.state.records.map(record => {
            return <tr>
              <td>{record.Id}</td>
              <td>{record.Name}</td>
            </tr>
          })}
        </table>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));