import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PriceTable from './price-table.jsx';
import LChart from './L-Chart.jsx';
import CChart from './C-Chart.jsx';
import Nav from './Nav.jsx';
import numbro from 'numbro';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      category: 'Dashboard',
      data: [],
      priceDrops: [],
      allPriceChanges: {},
      isLoading: false
    };
  }

  /* Get scraped data from database after component is mounted */
  componentDidMount() {
    this.setState({ isLoading: true });
    axios.get('/data')
      .then((response) => {
        console.log("The Data: ", response.data);
        // 'response.data' is an array of objects
        this.setState({
          data: response.data
        });
      })
      .then(() => {
        this.filterPriceChanges();
        this.allPriceDrops();
      })
      .catch((error) => {
        console.log(error);
      });

      // setTimeout(() => {
      //   this.filterPriceChanges();
      //   this.allPriceDrops();
      // }, 3000);
  }

  createPriceTable() {
    $(document).ready(() => {
      $('#table_id').DataTable( {
          retrieve: true,
          "data": this.state.data,
          "columnDefs": [
            {"className": "dt-center", "targets": -1}
          ],
          "columns": [
              { "data": "title" },
              { "data": "model" },
              // https://datatables.net/reference/option/columns.type
              { "type": "date", "data": "created_at",
              // https://datatables.net/reference/option/columns.render
                "render": function ( data, type, row, meta ) {
                  let milliseconds = Date.parse(data);
                  let clientDate = new Date(milliseconds);
                  let date = clientDate.toLocaleString();
                  return date;
                }
              },
              { "data": "price",
                "render": function ( data, type, row, meta ) {
                  return data === "not available" ? data : "$" + data;

                }
               },
              { "data": "flag",
                "render": function ( data, type, row, meta ) {
                  if(data === 1) {
                    return `<img src="./assets/down_white.png" />`;
                  } else if(data === 2) {
                    return `<img src="./assets/up_charc.png" />`;
                  } else {
                    return '-';
                  }
                }
              }
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

  /* filterPriceChanges function filters out all records that have had price changes
     - The filtered records are then displayed in the graphs */
  filterPriceChanges() {
    /* 
       Here I am creating hash table storage of only filtered records that have had a
       price drop. The hash will then be added to the state and passed to the L-Chart
       component.
       The model name is the key and it's value is an array of matching model
       records with unique dates.
    */

    let droppedPriceRecords = {};
    let seen = new Set();
    // Add unique tv models that have had a price drop to a hash table.
    this.state.data.forEach((object) => {
      if(object.flag !== 0) {
        if(!droppedPriceRecords[object.model]) {
          droppedPriceRecords[object.model] = [];
        }
      }
    });

    // Add all model records that have had a price drop to the hash table.
    this.state.data.forEach((object) => {
      if(droppedPriceRecords[object.model]) {

        // check for same model with duplicate dates
        if(!seen.has(object.model + object.created_at)) {
          seen.add(object.model + object.created_at);
          // Convert price strings to integers   
          object.price = numbro.unformat(object.price);
          object.dateClient = this.getClientDate(object.created_at, 'ld');
          droppedPriceRecords[object.model].push(object);
        }
      }
    });
    // update state with hash table of each tv model that has had a price drop
    this.setState({ allPriceChanges: droppedPriceRecords });
  }
  
  /* getClientDate is a helper function that converts UTC/Server time to client time */
  getClientDate(date, type) {
    
    let milliseconds = Date.parse(date);
    // console.log("Inside getClientDate millisecs var: ", milliseconds);
    let clientDate = new Date(milliseconds);
    // console.log("Inside getClientDate clientDate var: ", clientDate);
    if(type === 'l') return clientDate.toLocaleString();
    else if(type === 'ld') return clientDate.toLocaleDateString("en-US");
  }

  allPriceDrops() {
    let months = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    };
    
    let result = [];
    let hash = {};
    for(let record of this.state.data) {
      let monthNum = record.created_at[5] + record.created_at[6];
      if(record.created_at === '2018-06-24T23:28:27.000Z') record.flag = 1;
      if(record.flag === 1) {
        if(hash[monthNum]) {
          hash[monthNum].priceDrops++;
        } else {
          hash[monthNum] = { 
            priceDrops: 1,
            month: months[monthNum]
          };
        }
      }
    }
    for(let key in hash) {
      result.push(hash[key]);
    }
    this.setState({
      priceDrops: result,
      isLoading: false
    });
  }

  /* renderView function renders the View based on the state category property */
  renderView() {
    console.log('PriceDrops :', this.state.priceDrops);
    console.log('Filterd Prices :', this.state.allPriceChanges);
    if (this.state.category === 'Dashboard') {
      return (
        <div>
          <LChart priceDrops={this.state.priceDrops} filterPrice={this.state.allPriceChanges}/>
        </div>
      );
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
            {
              this.state.isLoading
              ? <div className="spinner"><img src="assets/137424-red-color-red.gif" /></div>
              : this.renderView()
            }   
          </div>

          <div className="footer"></div>
        </div>
      </div>
    )
  }
}

export default Dashboard;