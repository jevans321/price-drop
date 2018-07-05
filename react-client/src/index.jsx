import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
// var dt = require( 'datatables.net' )();
// require( 'datatables.net-dt' )();
// require( 'datatables.net-buttons-dt' )();
// require( 'datatables.net-responsive-dt' )();
import List from './components/List.jsx';
import axios from 'axios';
import PriceTable from './components/price-table.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: []
    };
  }

  componentDidMount() {
    axios.get('/data')
      .then((response) => {
        console.log("The Data: ", response.data);
        // 'response.data' is an array of objects
        this.setState({
          data: response.data
        })
        console.log("The state: ", this.state.data);
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
              "order": [[2, "desc"]]
          } );
      } );
      })
      .catch((error) => {
        console.log(error);
      });

  }

  render () {
    return (<div>
      <PriceTable data={this.state.data}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));