import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import numbro from 'numbro';

export default class Charts extends Component {
  /* constructur doesn't seem to be necessary */
  constructor(props) {
      super(props);
  }

  /* function filters out all records that have had price changes
     - This data is then displayed in the graphs */
  filterPriceChanges() {
    /* Convert price strings to numbers: e.g. "$1000.50" to 1000.50 */
    this.props.data.forEach((obj) => obj.price = numbro.unformat(obj.price));
    console.log('This Data in render: ', this.props.data);

    let results = [];
    /* map is object of models(keys) with price changes */
    let map = {};
    /* filter out all records that have had prices changes
       and add them to 'map' object */
    this.props.data.forEach((obj) => {
      if(obj.flag !== 0) {
        if(!map[obj.model]) {
          map[obj.model] = true;
        }
      }
    });
    console.log('map: ', map);
    /* map2 is object of models(key) with unique date(value) */
    // key is model, val is date
    let map2 = {};
    /* Filter only one tv model record from each day from the
       previously filtered records
       - Add these record objects to a separate new array for each tv model
       - Then add these new arrays to one large 'results' array
       - This was specifically done so the array can be looped through in
         the render function and charts can be created for each tv model
         based on that tv models array.  */
    for(let key in map) {
      let modelArr = this.props.data.filter((obj) => {
        let milliseconds = Date.parse(obj.date);
        let clientDate = new Date(milliseconds);
        let date = clientDate.toLocaleString();
        date = date.split(',')[0];
        // if model key equals obj model name
        if(key === obj.model && !map2[key+date]) {
          map2[key+date] = true;
          let graphDate = date.slice(0, date.length - 5).replace('/', '-');
          obj.dateClient = graphDate;
          return obj;       
        }
      });
      // add new array to larger results array?
      results.push(modelArr);
    }
    return results;
  }

  render() {
    let results = this.filterPriceChanges();
    // create chart for each data array in results array
    const charts = results.map((modelArray) => 
      <div className="chart">
        <p><strong>Model</strong></p>
        <p style={{'marginBottom': '20px'}}>{modelArray[0].title}</p>
        <LineChart width={400} height={250} data={modelArray}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>
          {/* <Line type="monotone" dataKey="flag" stroke="#82ca9d" /> */}
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey={"dateClient"} />
          <YAxis />
          <Legend />
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