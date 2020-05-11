import echarts from 'echarts'
import ReactForEchartsCore from './ReactForEchartsCore'


//默认导入 echarts 所有包
export default class ReactForEcharts extends ReactForEchartsCore{
  constructor(props) {
    //子类 ReactForEcharts 必须执行一次父类的 constructor
    super(props);
    //将 echarts 对象传入 this 的 oriEcharts 上
    this.oriEcharts=echarts
  }
}
