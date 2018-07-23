import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PriceTable from './components/price-table.jsx';
import LChart from './components/L-Chart.jsx';
import CChart from './components/C-Chart.jsx';
import Nav from './components/Nav.jsx';
import '../dist/styles.css';
import numbro from 'numbro';

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
        // console.log("The Data: ", response.data);
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
          "columnDefs": [
            {"className": "dt-center", "targets": -1}
          ],
          "columns": [
              { "data": "title" },
              { "data": "model" },
              // https://datatables.net/reference/option/columns.type
              { "type": "date", "data": "date",
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
                  return "$" + data;
                }
               },
              { "data": "flag",
                "render": function ( data, type, row, meta ) {
                  if(data === 1) {
                    return `<img src="./assets/down_white.png" />`;
                  } else if(data === 2) {
                    return `<img src="./assets/up_charc.png" />`;
                  } else {
                    return '-';//'<span style="margin-left: 35px">-<span/>';
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
    // Convert price strings to numbers: e.g. "$1000.50" to 1000.50
    this.state.data.forEach((obj) => obj.price = numbro.unformat(obj.price));

    let results = [];
    // map is object of models(keys) with price changes */
    let map = {};
    /* filter out all records that have had prices changes
        and add them to 'map' object */
    this.state.data.forEach((obj) => {
      if(obj.flag !== 0) {
        if(!map[obj.model]) {
          map[obj.model] = true;
        }
      }
    });

    // map2 is object of models(key) with unique date(value)
    let map2 = {};
    /* The below 'for loop' filters only one tv model record from each day from the
        previously filtered records
        - These filtered record objects are then added to a separate new array for each tv model
        - Then these new arrays are added to one large 'results' array
        - This was specifically done so the results array can be looped through in
          the render function and charts can be created for each tv model
          based on that tv models array. */
    for(let key in map) {
      let modelArr = this.state.data.filter((obj) => {
        let milliseconds = Date.parse(obj.date);
        let clientDate = new Date(milliseconds);
        let date = clientDate.toLocaleString();
        date = date.split(',')[0];
        // if model key equals obj model name
        if(key === obj.model && !map2[key+date]) {
          map2[key+date] = true;
          let graphDate = date.slice(0, date.length - 5).replace('/', '-');
          //console.log('graph date: ', graphDate);
          obj.dateClient = graphDate;
          return obj;       
        }
      });

      results.push(modelArr);
    }
    // console.log('filtered results: ', results);
    // returns an array of nested tv model arrays. The arrays contain records of one price from each day there was a scrape
    return results;
  }

  getClientDate(date, type) {
    let milliseconds = Date.parse(date);
    let clientDate = new Date(milliseconds);
    if(type === 'l') return clientDate.toLocaleString();
    else if(type === 'ld') return clientDate.toLocaleDateString("en-US");
  }

  allPriceDrops() {
    // let results = [];
    // for(let record of this.state.data) {
    //   if(record.flag === 1) {
    //     record.fullClientDate = this.getClientDate(record.date, 'ld');
    //     record.price = numbro.unformat(record.price);
    //     results.push(record);
    //   }
    // }
    // return results;

    let months = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July'
    }
    let result = [];
    let hash = {};
    for(let record of this.state.data) {
      let monthNum = record.date[5]+ record.date[6]
      if(record.date === '2018-06-24T23:28:27.000Z') record.flag = 1;
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
    // console.log('the result..... : ', result);
    if(result.length !== 0) return result;
  }

  /* renderView function renders the View based on the state category property */
  renderView() {
    if (this.state.category === 'Dashboard') {
      return (
        <div>
          <CChart priceDrops={this.allPriceDrops.bind(this)}/>
          <LChart filterPrice={this.filterPriceChanges.bind(this)}/>
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
            {this.renderView()}
          </div>

          <div className="footer"></div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));