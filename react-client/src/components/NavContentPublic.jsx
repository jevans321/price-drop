import React from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";


class NavContentPublic extends React.Component {
  constructor(props) {
    super(props);

  }


  render() {
    return (
      <div>
        <div id="logo"><Link to="/"><i className="arrow circle down large icon"></i>Price Drop</Link></div>
        <div id="login" onClick={() => this.props.showModal('login')}>Log in</div>
      </div>
    );
  }
};


export default NavContentPublic;

