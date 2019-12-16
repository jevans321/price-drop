import React from 'react';
// import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props); // reference to the parents(React.Component) constructor function

    this.state = { image: "photo-1550557019-3436df3d1c67.jpeg" };
  }
  // state = { img: null };
  componentDidMount() {
    const images = ["photo-1550557019-3436df3d1c67.jpeg", "photo-1557413287-60f2f07fe204.jpeg",
                    "photo-1560205001-a7011fc0093c.jpeg", "photo-1501645429123-a300be5fe1c2.jpeg",
                    "photo-1523437275713-4dbf723f62c1.jpeg", "photo-1565307961646-5269939b5b64.jpeg",
                    "photo-1572609239482-d3a83f976aa0.jpeg"];
    let idx = 1;
    setInterval(() => {
      idx++;
      if(idx == images.length) idx = 0;
      this.setState({image: images[idx]});
    }, 8000);
    
  }


  render() {
    

    return (
      <header style={{backgroundImage: `url(./assets/${this.state.image})`}}>
        <div id="status"><p>12/16/2019: Currently adding features to this landing page and the authorized members section after login.
          Users are still able to test the sign up with a testing email, log in, and view the current dash board</p></div>
        <div>
          <div><h2>Be among the first</h2> to find out when a television has a drop in price.</div>
          <div id="signup-btn" onClick={() => this.props.showModal('register')}>Sign up</div>
        </div>
      </header>
    );
  }
}

export default Header;
