import React from 'react';
import { getJwt } from '../helpers/jwt';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class AuthenticatedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    // get jwt Token from localStorage
    const jwt = getJwt();
    // if we don't have a jwt token we're not logged in, so redirect
    if(!jwt) {
      this.props.history.push('/')
    }
    // Authenticate user by getting user from backend after authorizing them with jwt token
    axios.get('/getUser/', { headers: { Authorization: `Bearer ${jwt}` }})
      .then(res => this.setState({ user: res.data }))
      .catch(err => {
        /* if error, remove jwt and redirect back to Logn.
          An error here could also mean the server is having an issue,
          which would not be the fault of the user.
          In production this would need to be handled specifically.
        */
        localStorage.removeItem('cool-jwt');
        this.props.history.push('/');
      });
  }

  render() {
    // We don't want to render the children if we're not authenticated
    if(this.state.user === undefined) {
      // we're making the authentication request and we're waiting to see if we have a user
      return (
        <div><h1>Loading...</h1></div>
      )
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

// wrapping component with 'withRouter' will inject 'this.props.hitory' where we want it to go
export default withRouter(AuthenticatedComponent);
