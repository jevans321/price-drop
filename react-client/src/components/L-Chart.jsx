import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import CChart from './C-Chart.jsx';

/* This can be refactored to a functional component */
export default class LChart extends Component {
  constructor(props) {
      super(props);
  }


  render() {
    let results = Object.values(this.props.filterPrice);
    // if(!results.length) {
    //   return <div>Loading...</div>;
    // }
    const formatter = (value) => `$${value}`;
    // create chart for each data array in results array
    const charts = results.map((modelArray) => 
      <div key={modelArray[0].model + modelArray[0].date} className="chart">
        <p><strong>Model</strong></p>
        <p style={{'marginBottom': '20px'}}>{modelArray[0].title}</p>
        <LineChart width={500} height={250} data={modelArray}>
          <Line type="monotone" dataKey="price" stroke="red" activeDot={{r: 8}}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey={"dateClient"} tick={{ fill: '#7e7e7e', fontSize: 11 }}/>
          <YAxis tick={{ fill: '#7e7e7e', fontSize: 13 }} domain={[0, Math.ceil(modelArray[0].price)+1000]} allowDataOverflow tickFormatter={formatter} />
          {/* {
            modelArray[0].price > 3000
            ? <YAxis tick={{ fill: '#7e7e7e', fontSize: 13 }} tickFormatter={formatter} />
            : <YAxis tick={{ fill: '#7e7e7e', fontSize: 13 }} domain={[0, 3000]} allowDataOverflow tickFormatter={formatter} />
          } */}
          {/* <Legend /> */}
          <Tooltip />
        </LineChart>
      </div>
    );
    return (
      <div>
        <CChart priceDrops={this.props.priceDrops} />
        {charts}
      </div>
    )
  }
}