import React from 'react';
const dt = require( 'datatables.net-responsive' );


const PriceTable = () => (
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
    </table>
  </div>
)

export default PriceTable;