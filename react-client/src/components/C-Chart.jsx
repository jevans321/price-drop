import React, { Component } from 'react';
import { PieChart, Pie, Sector, Tooltip, Legend } from 'recharts';

 

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" style={{fontSize:'30px'}} fill={fill}>{payload.month}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Price Drops: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
class CChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
        activeIndex: 0
    };

    this.onPieEnter = this.onPieEnter.bind(this);

  }

  componentDidMount() {
    // if(this.props.priceDrops().length > 0){
    //   this.setState({ activeIndex: records.length - 1}); 
    // } else {
    //     this.setState({ activeIndex: 0});
    // }
   
    // let records = ()=>{ this.props.priceDrops() };
    // this.setState({ activeIndex: records.length - 1});
//     var promise1 = new Promise((resolve, reject) => {
//       resolve(this.props.priceDrops());
//     });

//     promise1.then((value) => {
//       console.log('The Value....... :', value);
//       this.setState({ activeIndex: value.length - 1});
//         // expected output: "Success!"
//   });
    // let this2 = this;
    // async function asyncCall() {
    //   let result = await this2.props.priceDrops();
    //   console.log('async result: ', result);
    // }
    // asyncCall();
    // this.props.priceDrops().then((records) => {
    //   this.setState({ activeIndex: records.length - 1});
    // }, (error) => { 
    //     alert(error);
    // });
  }

//   componentDidMount() {
//     authUser().then((user) => {
//        this.userHasAuthenticated(true);
//        this.setState({ isAuthenticating: false });
//     }, (error) => {
//        this.setState({ isAuthenticating: false });
//        alert(e);
//     });
// }
  updateNah(records) {
    this.setState({ activeIndex: records.length - 1});
  }

  onPieEnter(data, index) {
    this.setState({
        activeIndex: index
    });
  }

  render () {
    // if(this.state.activeIndex <= 0) {
    //     return <div>Loading...</div>;
    // }
    let records = this.props.priceDrops();

    // console.log('the records: ', records);
    return (
      <PieChart width={800} height={400}>
      <Pie 
        activeIndex={this.state.activeIndex}
        activeShape={renderActiveShape} 
        dataKey="priceDrops"
        data={records} 
        cx={300} 
        cy={200} 
        innerRadius={60}
        outerRadius={80} 
        fill="#8884d8"
        onMouseEnter={this.onPieEnter}
      />
      </PieChart>
    );
  }
}

export default CChart;