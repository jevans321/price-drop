import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import NavContentPublic from './NavContentPublic.jsx';
import Modal from './Modal.jsx';
import Login from './Login.jsx';

// import './Home.css';
// import '../../dist/Home.css';

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
        <Header
          homeHistory={this.props.history}
          showModal={this.showModal}
        />
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
