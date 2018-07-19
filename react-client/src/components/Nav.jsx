import React from 'react';


const Nav = (props) => (
  <div>
    <div className="b">
      <ul>
        <li className={props.category === 'Dashboard' && 'nav-selected'}
          onClick={() => props.changeCat('Dashboard')}><img src="/assets/line-chart-w.png"/><a href="#">Dashboard</a></li>
        <li className={props.category === 'Price Table' && 'nav-selected'}
          onClick={() => props.changeCat('Price Table')}><img src="/assets/table-selection-cell-w.png"/><a href="#">Price Table</a></li>
      </ul>
    </div>
  </div>
)

export default Nav;
