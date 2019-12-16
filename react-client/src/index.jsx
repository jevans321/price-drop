import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import AuthenticatedComponent from './components/AuthenticatedComponent.jsx';

import Nav from './components/Nav.jsx';
import '../dist/styles.css';
// import '../dist/Home.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    
  }

  showModal() {
    this.setState({ show: true });
  };

  hideModal() {
    this.setState({ show: false });
  };

  render () {
  //   <Route path="/Auth">
  //   <AuthenticatedComponent />
  // </Route>
  // <Route path="/dash">
  //   <Dashboard />
  // </Route>
  // <Route path="/">
  //   <Home />
  // </Route>
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <AuthenticatedComponent>
              <Route path="/dash" component={Dashboard} />
            </AuthenticatedComponent>
          </Switch>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));