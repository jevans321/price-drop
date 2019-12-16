import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }

    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }

  change(e) {
    /*
      I believe this will grabe the element 'name' from whichever-
      input element is changed and find the state key that matches-
      the name and update it's value to the input value
    */
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submit(e) {
    // we don't want to reload the page when a user submits
    e.preventDefault();

    let endPoint = e.target.className === "register-form" ? '/seedUser' : '/getToken';
    
    axios.post(endPoint, {
      email: this.state.email,
      password: this.state.password
    }).then(res => {
      if(res.data === 'ok') {
        this.props.hideModal();
        alert("Please login with user/pass");
        return;
      }
      localStorage.setItem('cool-jwt', res.data);
      this.props.homeHistory.push('/dash');
    });
  }
  

  render() {
    // console.log('Login props ', this.props);
    // <div>
    // <form onSubmit={e => this.submit(e)}>
    //   <label>email</label><input type="text" name="email" onChange={e => this.change(e)} value={this.state.email} />
    //   <label>password</label><input type="password" name="password" onChange={e => this.change(e)} value={this.state.password} />
    //   <button type="submit">Submit</button>
    // </form>
    // </div>

    // update display attribute based on which button was clicked to show component
    const registerDisplay = this.props.type === "login" ? "none" : "";
    const loginDisplay = this.props.type === "register" ? "none" : "";
  
    return (
      <div className="login-page">
        <div className="form">
          <form className="register-form" style={{display: registerDisplay}} onSubmit={e => this.submit(e)}>
            <h2>Sign up</h2>
            <input type="text" placeholder="email address" name="email" onChange={e => this.change(e)} value={this.state.email}/>
            <input type="password" placeholder="password" name="password" onChange={e => this.change(e)} value={this.state.password}/>
            <button type="submit">create</button>     
            <div id="bottom-row">
              <div id="close" onClick={this.props.hideModal}>Close</div>
              <p className="message">Already registered? <a href="#">Sign In</a></p>
            </div>
          </form>
          <form className="login-form" style={{display: loginDisplay}} onSubmit={e => this.submit(e)}>
            <h2>Log in</h2>
            <input type="text" placeholder="email address" name="email" onChange={e => this.change(e)} value={this.state.email}/>
            <input type="password" placeholder="password" name="password" onChange={e => this.change(e)} value={this.state.password}/>
            <button type="submit">login</button>
            <div id="bottom-row">
              <div id="close" onClick={this.props.hideModal}>Close</div>
              <p className="message">Not registered? <a href="#">Create an account</a></p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
