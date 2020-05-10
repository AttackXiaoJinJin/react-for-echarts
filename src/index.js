import echarts from 'echarts'
import ReactForEchartsCore from './ReactForEchartsCore'


//1、因为是 default，所以开发层用，可以自定义 name
//2、类组件，方便复用
export default class ReactForEcharts extends ReactForEchartsCore{
  constructor(props) {
    //子类 ReactForEcharts 必须执行一次父类的 constructor
    super(props);
    //将 echarts 对象传入 this 的 oriEcharts 上
    this.oriEcharts=echarts
  }
}
