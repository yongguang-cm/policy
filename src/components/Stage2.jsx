import React from 'react';
import {
  Tabs, SegmentedControl, Flex, WingBlank, WhiteSpace, Button
} from 'antd-mobile';

function formatCurrency(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    }
  }

  componentDidMount() {
    this.props.changeTitle('试算结果');
  }

  formatPercent(value, digits) {
    if (value !== null) {
      return `${(value * 100).toFixed(digits || 0)}%`;
    }
    return "";
  }

  formatMoney(value, digits) {
    if (typeof (value) === 'string') {
      return value;
    }
    if (value !== null) {
      return `${formatCurrency(value, digits)}`;
    }
    return "";

  }

  render() {
    const cell = {...this.props.data};
    cell.M2 = '简易税率';
    cell.N2 = '正常税率';
    cell.M3 = '商业贸易、动产租赁、绿色工业等';
    cell.N3 = '一般纳税人';
    cell.O3 = '有限公司';
    cell.M4 = '运输业、建筑业';
    cell.N4 = '小规模纳税人';
    cell.O4 = '独资或合伙企业';
    cell.M5 = '设计、咨询、代理等服务业';
    cell.M6 = '不动产租赁';

    cell.M8 = '正常税率';
    cell.M9 = '简易税率';

    // 旧=IF(D3&D4&C8=M3&N3&N2,13%,IF(D3&D4&C8=M4&N3&N2,9%,IF(D3&D4&C8=M5&N3&N2,6%,IF(D3&D4&C8=M6&N3&N2,9%,IF(D3&D4&C8=M6&N3&M2,5%,IF(D3&D4&C8=M6&N4&N2,5%,IF(D3&D4&C8=M3&N3&M2,3%,IF(D3&D4&C8=M4&N3&M2,3%,3%))))))))
    // 新=IF(D3&D4&C8=M3&N3&N2,13%,IF(D3&D4&C8=M4&N3&N2,9%,IF(D3&D4&C8=M5&N3&N2,6%,IF(D3&D4&C8=M6&N3&N2,9%,IF(D3&D4&C8=M6&N3&M2,5%,IF(D3&D4&C8=M6&N4&N2,5%,IF(D3&D4&C8=M3&N3&M2,1%,IF(D3&D4&C8=M4&N3&M2,1%,1%))))))))
    cell.E8 = `${cell.D3}${cell.D4}${cell.C8}` === `${cell.M3}${cell.N3}${cell.N2}` ? 0.13
      : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M4}${cell.N3}${cell.N2}` ? 0.09
        : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M5}${cell.N3}${cell.N2}` ? 0.06
          : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M6}${cell.N3}${cell.N2}` ? 0.09
            : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M6}${cell.N3}${cell.M2}` ? 0.05
              : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M6}${cell.N4}${cell.N2}` ? 0.05
                : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M3}${cell.N3}${cell.M2}` ? 0.01
                  : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M4}${cell.N3}${cell.M2}` ? 0.01 : 0.01
                  )))))));
    // =ROUND(IF(AND(D4="一般纳税人",C8="简易税率"),D5/(1+E8)*E8,D5/(1+E8)*E8),2)
    cell.G8 = cell.D4 === "一般纳税人" && cell.C8 === '简易税率' ? cell.D5 / (1 + cell.E8) * cell.E8 : cell.D5 / (1 + cell.E8) * cell.E8;

    //=IF(D2=O3,0,IF(D3=M3,5%,IF(D3=M4,7%,IF(D3=M5,10%,IF(D3=M6,10%,)))))
    cell.C10 = cell.D2 === cell.O3 ? 0
      : (cell.D3 === cell.M3 ? 0.05
        : (cell.D3 === cell.M4 ? 0.07
          : (cell.D3 === cell.M5 ? 0.1
            : cell.D3 === cell.M6 ? 0.1 : null)))

    //=IF(C10*D5<=30000,5%,IF(C10*D5<=90000,10%,IF(C10*D5<=300000,20%,IF(C10*D5<=500000,30%,IF(C10*D5>500000,35%)))))
    cell.E10 = cell.C10 * cell.D5 <= 30000 ? 0.05
      : (cell.C10 * cell.D5 <= 90000 ? 0.1
        : (cell.C10 * cell.D5 <= 300000 ? 0.2
          : (cell.C10 * cell.D5 <= 500000 ? 0.3
            : (cell.C10 * cell.D5 > 500000 ? 0.35 : null))))

    //=ROUND(MAX((D5/(1+E8))*C10*0.01*{5,10,20,30,35}-{0,1500,10500,40500,65500},0),2)
    // cell.G10 = Math.max((cell.D5 / (1 + cell.E8)) * cell.C10 * 0.01 * 5 - 0, 0);
    const a = [0, 1500, 10500, 40500, 65500];
    cell.G10 = [0, ...[5, 10, 20, 30, 35].map((first, idx) => {
      return (cell.D5 / (1 + cell.E8)) * cell.C10 * 0.01 * first - a[idx];
    })].reduce((x, y) => Math.max(x, y), 0);


    //=IF(D4=N3,E8*5%,E8*5%/2)
    cell.E12 = cell.D4 === cell.N3 ? cell.E8 * 0.05 : cell.E8 * 0.05 / 2;

    //=IF(E12="","",(ROUND(D5/(1+E8)*E12,2)))
    cell.G12 = cell.E12 === '' ? null : (cell.D5 / (1 + cell.E8) * cell.E12);

    //=IF(D5/(1+E8)<100000,"",IF(AND(D5/(1+E8)>=100000,D4="小规模纳税人"),E8*0.015,E8*0.03))
    cell.E13 = cell.D5 / (1 + cell.E8) < 100000 ? null
      : (cell.D5 / (1 + cell.E8) >= 100000 && cell.D4 === "小规模纳税人" ? cell.E8 * 0.015 : cell.E8 * 0.03)

    //=IF(E13="","",(ROUND(D5/(1+E8)*E13,2)))
    cell.G13 = cell.E13 === '' ? null : (cell.D5 / (1 + cell.E8) * cell.E13);

    //=IF(D5/(1+E8)<100000,"",IF(AND(D5/(1+E8)>=100000,D4="小规模纳税人"),E8*0.01,E8*0.02))
    cell.E14 = cell.D5 / (1 + cell.E8) < 100000 ? null
      : (cell.D5 / (1 + cell.E8) >= 100000 && cell.D4 === "小规模纳税人" ? cell.E8 * 0.01 : cell.E8 * 0.02)

    //=IF(E14="","",ROUND(D5/(1+E8)*E14,2))
    cell.G14 = cell.E14 === null ? null : cell.D5 / (1 + cell.E8) * cell.E14;

    //=SUM(E12:F14)+C10*E10+E8
    cell.E15 = cell.E12 + cell.E13 + cell.E14 + cell.C10 * cell.E10 + cell.E8;

    //=IF(D3&D4&C8=M3&N3&M2,"不适用简易征收",IF(D3&D4&C8=M5&N3&M2,"不适用简易征收",SUM(G8:J14)))
    cell.G15 = `${cell.D3}${cell.D4}${cell.C8}` === `${cell.M3}${cell.N3}${cell.M2}` ? "不适用简易征收"
      : (`${cell.D3}${cell.D4}${cell.C8}` === `${cell.M5}${cell.N3}${cell.M2}` ? "不适用简易征收" : (cell.G8 + cell.G9 + cell.G10 + cell.G11 + cell.G12 + cell.G13 + cell.G14));

    //=ROUND(G8*0.5+(G9+G10+G11)*0.4+G12,0)
    cell.G16 = cell.G8 * 0.5 + (cell.G9 + cell.G10 + cell.G11) * 0.4 + cell.G12;

    //=ROUND(((G8*50%+G12)*65%+G9*0.4*0.5+(G10+G11)*0.4*0.55),0)
    cell.G17 = ((cell.G8 * 0.5 + cell.G12) * 0.65 + cell.G9 * 0.4 * 0.5 + (cell.G10 + cell.G11) * 0.4 * 0.55);

    cell.B21 = 0.5;

    //=IF(G16>=5000000,50%,40%)
    cell.C21 = cell.G16 >= 5000000 ? 0.5 : 0.4;

    //=E8*B21*C21
    cell.D21 = cell.E8 * cell.B21 * cell.C21;

    //=ROUND(G8*B21*C21,0)
    cell.E21 = cell.G8 * cell.B21 * cell.C21;

    cell.B22 = 0.4;

    //=IF(G16>=5000000,50%,40%)
    cell.C22 = cell.G16 >= 5000000 ? 0.5 : 0.4;

    //=ROUND(G9*B22*C22,0)
    cell.E22 = cell.G9 * cell.B22 * cell.C22;

    cell.B23 = 0.4;

    //=IF(G16>=1000000,30%,0)
    cell.C23 = cell.G16 >= 1000000 ? 0.3 : 0.0;

    //ROUND((G10+G11)*B23*C23,0)
    cell.E23 = (cell.G10 + cell.G11) * cell.B23 * cell.C23;

    cell.B24 = 1.0;

    cell.C24 = 0.0;

    //=ROUND(G11*B24*C24,0)
    cell.E24 = cell.G11 * cell.B24 * cell.C24;

    //=IF(G17<100000,50%,IF(G17<500000,60%,IF(G17<1000000,65%,IF(G17<3000000,70%,IF(G17>=3000000,80%)))))
    //=IF(G17<100000,50%,IF(G17<500000,60%,IF(G17<1000000,65%,IF(G17<3000000,70%,IF(G17<5000000,75%,IF(G17>=5000000,80%))))))
    cell.G21 = cell.G17 < 100000 ? 0.5
      : (cell.G17 < 500000 ? 0.6
        : (cell.G17 < 1000000 ? 0.65
          : (cell.G17 < 3000000 ? 0.7
            : (cell.G17 < 5000000 ? 0.75
              : (cell.G17 >= 5000000 ? 0.8 : 0.8)))));

    //=ROUND((G8*50%*65%*G21),0)
    cell.H21 = cell.G8 * 0.5 * 0.65 * cell.G21;

    cell.G22 = cell.G21;

    //=G9*40%*50%*G22
    cell.H22 = cell.G9 * 0.4 * 0.5 * cell.G22;

    cell.G23 = cell.G21;

    //=ROUND((G10+G11)*40%*55%*G23,0)
    cell.H23 = (cell.G10 + cell.G11) * 0.4 * 0.55 * cell.G23;

    cell.G24 = cell.G21;

    //=ROUND(G12*65%*G24,0)
    cell.H24 = cell.G12 * 0.65 * cell.G24;

    //=H21-E21
    cell.J21 = cell.H21 - cell.E21;

    //=B21*C21
    cell.K21 = cell.B21 * cell.C21;

    //=50%*65%*G21
    cell.L21 = 0.50 * 0.65 * cell.G21;


    cell.J22 = cell.H22 - cell.E22;
    cell.J23 = cell.H23 - cell.E23;
    cell.J24 = cell.H24 - cell.E24;

    //=B22*C22
    cell.K22 = cell.B22 * cell.C22;
    cell.K23 = cell.B23 * cell.C23;
    cell.K24 = cell.B24 * cell.C24;

    //=40%*50%*G22
    cell.L22 = 0.40 * 0.50 * cell.G22;

    //=40%*55%*G23
    cell.L23 = 0.40 * 0.55 * cell.G23;

    //=F24*G24
    cell.F24 = 0.65;
    cell.L24 = cell.F24 * cell.G24;

    //=FLOOR(SUM(E21:E24),1000)
    cell.E25 = Math.floor((cell.E21 + cell.E22 + cell.E23 + cell.E24) / 1000) * 1000;

    //=FLOOR(SUM(H21:I24),1000)
    cell.H25 = Math.floor((cell.H21 + cell.H22 + cell.H23 + cell.H24) / 1000) * 1000;

    //=H25-E25
    cell.J25 = cell.H25 - cell.E25;

    return (
      <div>
        <Tabs tabs={[{title: "应交税费", key: 'first'}, {title: "新旧扶持政策对比", key: 'second'}]} initialPage={'first'}
              useOnPan={false}
        >
          <div style={{backgroundColor: '#fff'}} key={"first"}>
            <Flex className="line" style={{background: "#DDD"}}>
              <Flex.Item className="text">税种 </Flex.Item>
              <Flex.Item>应税所得率/简易税率 </Flex.Item>
              <Flex.Item>税率 </Flex.Item>
              <Flex.Item>税费金额 </Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">增值税 </Flex.Item>
              <Flex.Item>{cell.C8}</Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E8)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G8)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">企业所得税 </Flex.Item>
              <Flex.Item style={{flex: 2}}>10%、25% </Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G9)} </Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">经营所得个人所得税 </Flex.Item>
              <Flex.Item>{this.formatPercent(cell.C10)}</Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E10)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G10)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">工资、股权转让及经营所得查帐征收等个税 </Flex.Item>
              <Flex.Item style={{flex: 2}}>3~45%、20%、5~35%</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G11)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">城建税 </Flex.Item>
              <Flex.Item></Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E12, 3)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G12)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">教育费附加 </Flex.Item>
              <Flex.Item>
              </Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E13, 3)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G13)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item className="text">地方教育费 </Flex.Item>
              <Flex.Item></Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E14, 3)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G14)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item style={{flex: 2}} className="text">税 费 合 计 </Flex.Item>
              <Flex.Item>{this.formatPercent(cell.E15, 2)}</Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G15)}</Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item style={{flex: 3}} className="text">市级 地方 贡献 合计 </Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G16, 0)} </Flex.Item>
            </Flex>
            <Flex className="line">
              <Flex.Item style={{flex: 3}} className="text">崇明本级地方贡献合计 </Flex.Item>
              <Flex.Item>{this.formatMoney(cell.G17, 0)} </Flex.Item>
            </Flex>
          </div>
          <div style={{backgroundColor: '#fff'}} key={"second"}>
            {this.state.selectedIndex === 0 && <div>
              <div className="title">差异</div>
              <Flex className="line" style={{background: "#DDD"}}>
                <Flex.Item className="text">扶持结算税种</Flex.Item>
                <Flex.Item>新旧扶持增减</Flex.Item>
                <Flex.Item>4月1日前注册企业实交扶持比例</Flex.Item>
                <Flex.Item>4月1日后注册企业实交扶持比例</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">增值税</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.J21, 0)} </Flex.Item>
                <Flex.Item>{this.formatPercent(cell.K21, 2)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.L21, 2)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">企业所得税</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.J22, 0)} </Flex.Item>
                <Flex.Item>{this.formatPercent(cell.K22, 2)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.L22, 2)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">个人所得税</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.J23, 0)} </Flex.Item>
                <Flex.Item>{this.formatPercent(cell.K23, 2)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.L23, 2)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">城建税</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.J24, 0)} </Flex.Item>
                <Flex.Item>{this.formatPercent(cell.K24, 2)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.L24, 2)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">合计</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.J25, 0)} </Flex.Item>
                <Flex.Item> </Flex.Item>
                <Flex.Item> </Flex.Item>
              </Flex>
            </div>}

            {this.state.selectedIndex === 1 && <div>
              <div className="title">2019年4月1日前按市级所得结算</div>
              <Flex className="line" style={{background: "#DDD"}}>
                <Flex.Item className="text">扶持结算税种</Flex.Item>
                <Flex.Item>市级分成</Flex.Item>
                <Flex.Item>扶持比例</Flex.Item>
                <Flex.Item>扶持税率</Flex.Item>
                <Flex.Item>扶持金额</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">增值税</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.B21)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.C21)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.D21, 2)}</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.E21, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">企业所得税</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.B22)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.C22)}</Flex.Item>
                <Flex.Item></Flex.Item>
                <Flex.Item>{this.formatMoney(cell.E22, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">个人所得税</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.B23)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.C23)}</Flex.Item>
                <Flex.Item></Flex.Item>
                <Flex.Item>{this.formatMoney(cell.E23)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">城建税</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.B24)}</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.C24)}</Flex.Item>
                <Flex.Item></Flex.Item>
                <Flex.Item>{this.formatMoney(cell.E24)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">老政策扶持合计</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.E25, 0)}</Flex.Item>
              </Flex>
            </div>}

            {this.state.selectedIndex === 2 && <div>
              <div className="title">2019年4月1日后按区级所得结算</div>
              <Flex className="line" style={{background: "#DDD"}}>
                <Flex.Item className="text">扶持结算税种</Flex.Item>
                <Flex.Item>区级分成</Flex.Item>
                <Flex.Item>扶持比例</Flex.Item>
                <Flex.Item>扶持金额</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">增值税</Flex.Item>
                <Flex.Item>50%*65%</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.G21)}</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.H21, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">企业所得税</Flex.Item>
                <Flex.Item>40%*50%</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.G22)}</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.H22, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">个人所得税</Flex.Item>
                <Flex.Item>40%*55%</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.G23)}</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.H23, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">城建税</Flex.Item>
                <Flex.Item>65%</Flex.Item>
                <Flex.Item>{this.formatPercent(cell.G24)}</Flex.Item>
                <Flex.Item>{this.formatMoney(cell.H24, 0)}</Flex.Item>
              </Flex>
              <Flex className="line">
                <Flex.Item className="text">新政策扶持合计 </Flex.Item>
                <Flex.Item>{this.formatMoney(cell.H25, 0)}</Flex.Item>
              </Flex>
            </div>}

            <WhiteSpace/>
            <WingBlank>
              <SegmentedControl values={['差异', '4月1日前明细', '4月1日后明细']}
                                selectedIndex={this.state.selectedIndex}
                                onChange={e => {
                                  this.setState({
                                    selectedIndex: e.nativeEvent.selectedSegmentIndex
                                  })
                                }}
              />
            </WingBlank>
            <WhiteSpace/>
            <div className="hint">
              根据生态新兴企业对崇明本级经济和社会贡献综合考虑，贡献在10（不含）万元以下的，给予30%-50%以内的扶持；贡献在10（含）-50（不含）万元之间的，最高给予60%扶持；贡献在50（含）-100（不含）万元之间的，最高给予65%扶持；贡献超过100（含）万元的，最高给予70%扶持。贡献超过300（含）万元的，通过一事一议最高给予75%-80%扶持。
            </div>
          </div>
        </Tabs>

        <WhiteSpace/>
        <WingBlank>
          <Button type="primary" onClick={() => this.props.onBack()}>重新计算</Button>
        </WingBlank>
        <WhiteSpace/>
      </div>);
  }
}
