import React, { Component } from 'react';
const dt = require( 'datatables.net-responsive' );

export default class PriceTable extends Component {

    // constructor(props) {
    //     super(props);

    //   }
    // componentDidMount() {
    //     $(document).ready(() => {
    //         $('#table_id').DataTable( {
    //             "processing": true,
    //             "ajax": this.props.data,
    //             "columns": [
    //                 { "data": "title" },
    //                 { "data": "model" },
    //                 { "data": "date" },
    //                 { "data": "price" },
    //                 { "data": "status" }
    //             ]
    //         } );
    //     } );
    // }

    render() {
        return (
          <div>
            <table id="table_id" className="display">
             <thead>
              <tr>
                  <th>Title</th>
                  <th>Model</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
              </tr>
            </thead>
            {/* <tbody>
              {
                this.props.data.map(row => (
                  <tr>
                    <td>{row.title}</td>
                    <td>{row.model}</td>
                    <td>{row.date}</td>
                    <td>{row.price}</td>
                    <td>{row.flag === 1 ? "Price Drop!" : row.flag === 2 ? "Increase" : "Original"}</td>
                  </tr>
                ))
              }
            </tbody> */}
            </table>
          </div>
        )
    }
}