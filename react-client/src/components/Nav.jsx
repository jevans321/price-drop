import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export default class Nav extends Component {

  render(){
    return (
      <div>
        <div className="b">
          <ul>
              <li className={this.props.category === 'Dashboard' && 'nav-selected'}
                onClick={() => this.props.changeCat('Dashboard')}><a href="#">Dashboard</a></li>
              <li className={this.props.category === 'Price Table' && 'nav-selected'}
                onClick={() => this.props.changeCat('Price Table')}><a href="#">Price Table</a></li>
              {/* <li><a href="#">Data Table</a></li> */}
          </ul>
        </div>
      </div>
    );
  }
}

// ReactDOM.render(<Nav />, document.getElementById('nav-menu'));
