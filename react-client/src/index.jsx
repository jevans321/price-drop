import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PriceTable from './components/price-table.jsx';
import Charts from './components/Charts.jsx';
import Nav from './components/Nav.jsx';
import '../dist/styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      category: 'Dashboard',
      data: []
    };
  }

  /* Get scraped data from database after component is mounted */
  componentDidMount() {
    axios.get('/data')
      .then((response) => {
        console.log("The Data: ", response.data);
        // 'response.data' is an array of objects
        this.setState({
          data: response.data
        })
      })
      .catch((error) => {
        console.log(error);
      });

  }

  createPriceTable() {
    $(document).ready(() => {
      $('#table_id').DataTable( {
          "data": this.state.data,
          "columns": [
              { "data": "title" },
              { "data": "model" },
              { "data": "date" },
              { "data": "price" },
              { "data": "flag" }
          ],
          "pageLength": 50,
          "order": [[2, "desc"]],
          "rowCallback": function( row, data, index ) {
            /* Reference for below code syntax: 
               https://datatables.net/forums/discussion/comment/134049/#Comment_134049 */
            if (data.flag === 1) {
              /* 'td:eq(4)' */
              $('td', row).css({'background-color': '#fe5458'});
            } else if(data.flag === 2) {
              $('td', row).css({'background-color': '#E0F7F4'});
            }
          }
      } );
    } );
  }
  /* changeCategory function is passed to the navigation menu
     It is used to update the state category property,
     which is used to change the page view  */
  changeCategory(categoryVal) {
    this.setState({
      category: categoryVal
    });
  }
  /* renderView function renders the View based on the state category property */
  renderView() {
    if (this.state.category === 'Dashboard') {
      return <Charts data={this.state.data}/>
    } else if (this.state.category === 'Price Table') {
      this.createPriceTable();
      return <PriceTable data={this.state.data}/>
    }
  }


  render () {

    return (
      <div>
        <div className="wrapper">
          <div className="header">           
            <img src="/assets/arrow-icon-9_dark.png"/>
            <span className="b">Price Drop </span>
          </div>

          <div className="menu">
              <Nav category={this.state.category} changeCat={this.changeCategory.bind(this)}/>
          </div>

          <div className="banner">{this.state.category}</div>

          <div className="content">
            {this.renderView()}
          </div>

          <div className="footer"></div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));