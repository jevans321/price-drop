import React from 'react';
// import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import NavContentPublic from './NavContentPublic.jsx';
import Modal from './Modal.jsx';
import Login from './Login.jsx';
import Carousel from './Carousel.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, type: "" };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    
  }

  showModal(type) {
    if(type === "login") {
      this.setState({ show: true, type: "login" });
    } else {
      this.setState({ show: true, type: "register" });
    }
  };

  hideModal() {
    this.setState({ show: false });
  };



  render() {

    return (
      <div>
        <Navigation>
          <NavContentPublic homeHistory={this.props.history} showModal={this.showModal} />
        </Navigation>
        <header>
          <Carousel />
          <div id="status">
            <p>12/16/2019: Currently adding features to this landing page and the authorized members section after login.
            Users are still able to test the sign up with a testing email, log in, and view the current dash board</p>
          </div>
          <div id="signup">
            <div><div id="signup-title">Be among the first</div> to find out when a television has a drop in price.</div>
            <div id="signup-btn" onClick={() => this.showModal('register')}>Sign up</div>
          </div>
        </header>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <Login
            homeHistory={this.props.history}
            hideModal={this.hideModal}
            type={this.state.type}
          />
        </Modal>
        <section id="mid-section">
          <div id="features">
            <div>
            <i className="circular big money bill alternate outline icon"></i>
              <div className="title-sml">Track Price Drops</div>
            </div>
            <div>
              <i className="circular big chart line icon"></i>
              <div className="title-sml">View Pricing History</div>
            </div>
            <div>
              <i className="circular big shopping bag icon"></i>
              <div className="title-sml">Mulitple stores</div>
            </div>
          </div>
        </section>
        <section id="bottom-section">
          <div>
            <div>Pick from top brands</div>
            <div id="brands"><span>Sony</span><span>Samsung</span><span>Vizio</span><span>LG</span></div>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
