import React from 'react';
import {createForm} from 'rc-form';

import {Picker, List, InputItem, Button, WhiteSpace, WingBlank} from 'antd-mobile';


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.changeTitle('生态新兴企业税收扶持速算对比表');

    const {setFieldsValue} = this.props.form;

    const result = {};

    for (let key of Object.keys(this.props.data)) {
      const v = this.props.data[key];

      if (v === null || v === undefined) {
        result[key] = null;
      } else if (typeof (v) === 'number') {
        result[key] = `${v}`
      } else if (typeof (v) === 'string') {
        result[key] = [v];
      }
    }

    setFieldsValue(result);
  }

  onSubmit() {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        let result = {};
        for (let key of Object.keys(value)) {
          let v = value[key];

          if (v !== undefined && v !== null) {
            if (typeof (v) === 'string') {
              result[key] = parseFloat(v);
              if (isNaN(result[key])) {
                result[key] = null;
              }
            } else if (typeof (v) === 'object' && v instanceof Array) {
              result[key] = v[0]
            }
          } else {
            result[key] = null;
          }
        }

        this.props.onCalcFinish(result);
      }
    });
  }

  render() {
    console.log(this.props.data);
    const {getFieldProps, getFieldError} = this.props.form;
    return (<form className="form" onsubmit="return false">
      <List renderHeader={() => <b>必填信息</b>}>
        <Picker data={[
          {label: "有限公司", value: "有限公司"},
          {label: "独资或合伙企业", value: "独资或合伙企业"}]}
                cols={1} {...getFieldProps('D2', {rules: [{required: true}]})}>
          <List.Item arrow="horizontal">企业类型</List.Item>
        </Picker>
        <div className="form-error"> {(getFieldError('D2')) ? "必填" : null} </div>

        <Picker data={[
          {label: "商业贸易、动产租赁、绿色工业等", value: "商业贸易、动产租赁、绿色工业等"},
          {label: "运输业、建筑业", value: "运输业、建筑业"},
          {label: "设计、咨询、代理等服务业", value: "设计、咨询、代理等服务业"},
          {label: "不动产租赁", value: "不动产租赁"}
        ]}
                cols={1} {...getFieldProps('D3', {rules: [{required: true}]})}>
          <List.Item arrow="horizontal">经营项目</List.Item>
        </Picker>
        <div className="form-error"> {(getFieldError('D3')) ? "必填" : null} </div>


        <Picker data={[
          {label: "一般纳税人", value: "一般纳税人"},
          {label: "小规模纳税人", value: "小规模纳税人"}
        ]}
                cols={1} {...getFieldProps('D4', {rules: [{required: true}]})}>
          <List.Item arrow="horizontal">纳税类型</List.Item>
        </Picker>
        <div className="form-error"> {(getFieldError('D4')) ? "必填" : null} </div>

        <InputItem
          {...getFieldProps('D5', {rules: [{required: true}]})}
          type="money"
          placeholder="请输入"
          clear
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
        >开票金额</InputItem>
        <div className="form-error"> {(getFieldError('D5')) ? "必填" : null} </div>


        <Picker data={[
          {label: "正常税率", value: "正常税率"},
          {label: "简易税率", value: "简易税率"}
        ]}
                cols={1} {...getFieldProps('C8', {rules: [{required: true}]})}>
          <List.Item arrow="horizontal">增值税-税种</List.Item>
        </Picker>
        <div className="form-error"> {(getFieldError('C8')) ? "必填" : null} </div>

      </List>

      <List renderHeader={() => <b>应交税费(选填)</b>}>
        <InputItem
          {...getFieldProps('G9', {
            // getValueProps: value => {
            //   if (isNaN(value)) {
            //     return null;
            //   } else {
            //     return value;
            //   }
            //}
          })}
          type="money"
          placeholder="请输入"
          clear
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
        >企业所得税</InputItem>


        <InputItem
          {...getFieldProps('G11')}
          type="money"
          placeholder="请输入"
          clear
          labelNumber={7}
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
        >
          <div style={{fontSize: "0.8rem", whiteSpace: "normal"}}>工资、股权转让及经营所得查帐征收等个税</div>
        </InputItem>

      </List>
      <WhiteSpace/>
      <WingBlank>
        <Button type="primary" onClick={this.onSubmit.bind(this)}>立即计算</Button>
      </WingBlank>
      <WhiteSpace/>

    </form>)
      ;
  }
}

export default createForm()(Demo);
