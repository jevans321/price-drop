import React from 'react';


const Nav = (props) => {
  let isDashboard = props.category === 'Dashboard';
  let isPriceTable = props.category === 'Price Table';
  return (
    <div>
      <ul>
        <li
          onClick={() => {props.changeCat('Dashboard')}}><a className={isDashboard && 'active'} href="#"><div className="icon icon-dash"></div>Dashboard</a></li>
        <li className={props.category === 'Price Table' && 'nav-selected'}
          onClick={() => props.changeCat('Price Table')}><a className={isPriceTable && 'active'} href="#"><div className="icon icon-table"></div>Price Table</a></li>
      </ul>
    </div>
  );
};


export default Nav;
