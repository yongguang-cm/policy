import React from 'react';
import ReactDOM from 'react-dom';
import {Toast} from 'antd-mobile';

import App from './components/App';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';

import './index.less';
import {NavBar} from "antd-mobile";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: "CALC", // CALC/RESULT
      title: null,
      data: {
        C8: "正常税率",
        D2: "有限公司",
        D3: "商业贸易、动产租赁、绿色工业等",
        D4: "一般纳税人",
        D5: 10000000,
        G9: null,
        G11: null
      }
    };
  }

  onCalcFinish(data) {
    Toast.loading('计算中...', 1.5, () => {
      this.setState({data, step: "RESULT"});
    });
  }

  render() {
    return (
      <div className="body">
        <NavBar mode="light">
          {this.state.title}
        </NavBar>
        {this.state.step === "CALC" && <Stage3
          changeTitle={title => this.setState({title})}
          onCalcFinish={this.onCalcFinish.bind(this)}
          data={this.state.data}
        />}
        {this.state.step === "RESULT" && <Stage2
          changeTitle={title => this.setState({title})}
          onBack={() => this.setState({step: "CALC"})}
          data={this.state.data}
        />}
      </div>
    );
  }
}

ReactDOM.render(
  <Index/>
  , document.getElementById('example'));

// ReactDOM.render(
//   <div className="body">
//     <h1>Stages list</h1>
//     <ul role="nav">
//       <li><h3>ListView + Carousel</h3></li>
//       <li><h3>Tabs + ...</h3></li>
//       <li><h3>Form + ...</h3></li>
//     </ul>
//     <App><Stage3 /></App>
//   </div>
// , document.getElementById('example'));
