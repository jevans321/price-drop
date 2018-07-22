import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


export default class LChart extends Component {
  /* constructur not necessary */
  constructor(props) {
      super(props);
  }


  render() {
    let results = this.props.filterPrice();
    const formatter = (value) => `$${value}`;
    // create chart for each data array in results array
    const charts = results.map((modelArray) => 
      <div className="chart">
        <p><strong>Model</strong></p>
        <p style={{'marginBottom': '20px'}}>{modelArray[0].title}</p>
        <LineChart width={400} height={250} data={modelArray}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey={"dateClient"} />
          {
            modelArray[0].price > 3000
            ? <YAxis tickFormatter={formatter} />
            : <YAxis domain={[0, 3000]} allowDataOverflow tickFormatter={formatter} />
          }
          {/* <Legend /> */}
          <Tooltip />
      </LineChart>
     </div>
    );
    return (
      <div>
        {charts}
      </div>
    )
  }
}