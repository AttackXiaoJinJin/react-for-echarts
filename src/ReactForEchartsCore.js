import React,{Component} from 'react'
import PropTypes from 'prop-types';
import isEqual from 'fast-deep-equal';
import {bind, clear} from 'size-sensor';

const pick = (obj, keys) => {
  const r = {};
  keys.forEach((key) => {
    r[key] = obj[key];
  });
  return r;
};

const objectIs=(x, y)=> {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
  );
}

export default class ReactForEchartsCore extends Component{
  constructor(props) {
    super(props);
    //获取 <ReactEcharts/> 传进来的 props
    this.oriEcharts=props.echarts
    this.echartsRef=React.createRef()
  }

  //初始化
  componentDidMount() {
    this.runEchartInstance()
  }

  //获取 dom 容器上的实例
  getEchartsInstance=()=>{
    const {oriEcharts,echartsRef}=this
    const {theme,opts,}=this.props
    const echartsInstance=oriEcharts.getInstanceByDom(echartsRef.current)
      || oriEcharts.init(echartsRef.current, theme, opts);
    return echartsInstance
  }

  //配置echarts实例
  configEchartInstance=()=>{
    const {option,notMerge,showLoading,loadingOption, lazyUpdate,}=this.props

    //init the echart object
    const echartObj=this.getEchartsInstance()

    /*自定义api——option,notMerge*/
    echartObj.setOption(option,notMerge,lazyUpdate)

    /*自定义api——showLoading*/
    //一般是接口请求 echartsData，直接设置 boolean 来改变 loading 状态
    if(showLoading){
      echartObj.showLoading(loadingOption)
    }else{
      echartObj.hideLoading()
    }

    return echartObj
  }

  //绑定 Events 事件
  //echartObj,eventsObj
  bindEvents = (instance, eventsObj) => {
    const bindEvent = (eventName, func) => {
      // ignore the event config which not satisfy
      /*eventName 类型必须为 string，func 类型必须为 function*/
      if (typeof eventName === 'string' && typeof func === 'function') {
        // binding event
        // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作

        /*这里暂不支持官网的筛选项*/
        //不支持：
        // chart.on('mouseover', {seriesName: 'uuu'}, function () {
        //    series name 为 'uuu' 的系列中的图形元素被 'mouseover' 时，此方法被回调。
        // });
        instance.on(eventName, (param) => {
          func(param, instance);
        });
      }
    };

    // loop and bind
    //暴露的eventsObj使用示例：
    // {
    //  click:()=>{},
    //  legendselectchanged:()=>{},
    // }
    for (const eventName in eventsObj) {
      //除去原型链上的属性，如 Object.keys()
      if (Object.prototype.hasOwnProperty.call(eventsObj, eventName)) {
        bindEvent(eventName, eventsObj[eventName]);
      }
    }
  };

  runEchartInstance=()=>{
    //获取 <ReactEcharts/> 传进来的
    const {eventsObj,onChartReady}=this.props
    const echartObj=this.configEchartInstance()
    //绑定 eventsObj 事件
    this.bindEvents(echartObj,eventsObj||{})

    // if(typeof onChartReady==='function'){
    //   onChartReady(echartObj)
    // }

    //todo:bind 函数的作用？
    // if(this.echartsRef){
    //   bind(this.echartsRef, () => {
    //     try {
    //       echartObj.resize();
    //     } catch (e) {
    //       console.warn(e);
    //     }
    //   });
    // }

  }

  //dispose echarts and clear size-sensor
  //取消之前的绑定 events
  disposeEchartsInstance = () => {
    const {echartsRef,oriEcharts}=this
    if (echartsRef) {
      try {
        //清空当前实例
        clear(echartsRef);
      } catch (e) {
        console.warn(e);
      }
      //摧毁实例
      //因为下面是 rebind，会重新创建实例，这里干脆就 destory 了
      oriEcharts.dispose(echartsRef);
    }
  };

  // update
  componentDidUpdate(prevProps) {
    // 判断是否需要 setOption，由开发者自己来确定。默认为 true
    // if (typeof this.props.shouldSetOption === 'function' && !this.props.shouldSetOption(prevProps, this.props)) {
    //   return;
    // }

    const {eventsObj,}=this.props
    const {eventsObjPre,}=prevProps

    // 以下属性修改的时候，需要 dispose 之后再新建
    // 1. 切换 theme 的时候
    // 2. 修改 opts 的时候
    // 3. 修改 eventsObj 的时候，这样可以取消所有之前绑定的事件 issue #151
    if (
    //   !isEqual(prevProps.theme, this.props.theme) ||
    //   !isEqual(prevProps.opts, this.props.opts) ||
      !objectIs(eventsObjPre, eventsObj)
    ) {
      //cancel-bind
      this.disposeEchartsInstance();
      //configEchartInstance
      //re-bindEvent
      this.runEchartInstance();
      return;
    }

    // 当 setOption 属性保持不变的时候，不执行 update
    const {option,notMerge,showLoading,loadingOption, lazyUpdate,}=this.props
    const {ptionPre,notMergePre,showLoadingPre,loadingOptionPre, lazyUpdatePre,}=prevProps
    // const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
    // if (isEqual(pick(this.props, pickKeys), pick(prevProps, pickKeys))) {
    //   return;
    // }

    if(
      objectIs(option,ptionPre)&&
      objectIs(notMerge,notMergePre)&&
      objectIs(showLoading,showLoadingPre)&&
      objectIs(loadingOption,loadingOptionPre)&&
      objectIs(lazyUpdate,lazyUpdatePre)
    ){
      return;
    }

    const echartObj = this.configEchartInstance();
    // 样式修改的时候，可能会导致大小变化，所以触发一下 resize
    // if (!isEqual(prevProps.style, this.props.style) || !isEqual(prevProps.className, this.props.className)) {
    //   try {
    //     echartObj.resize();
    //   } catch (e) {
    //     console.warn(e);
    //   }
    // }
  }

  // remove
  componentWillUnmount() {
    this.disposeEchartsInstance();
  }

  render(){
    const {style,className}=this.props

    return(<div
      ref={this.echartsRef}
      //为防止 echarts 初始化失败，需要默认设置 div 的宽高
      style={{height:300,width:300,...style}}
      // className={className}
    />)


  }

}

//默认 props
ReactForEchartsCore.defaultProps={
  //是否不跟之前设置的 option 进行合并，默认为 false，即合并。
  notMerge:false,
  // echarts:{}
  lazyUpdate:false,
  style:{},
  className:{},
  // theme:null,
  // onChartReady:()=>{},
  showLoading:false,
  loadingOption:null,
  // eventsObj:{},
  // opts:{},
  // shouldSetOption:()=>true,

}
//指定 prop 类型
ReactForEchartsCore.propTypes={
  //图表的配置项和数据，必填
  option:PropTypes.object.isRequired,
  notMerge:PropTypes.bool,
  // echarts:PropTypes.object,
  lazyUpdate:PropTypes.bool,
  style:PropTypes.object,
  className:PropTypes.object,
  // theme:PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
  // onChartReady:PropTypes.func,
  showLoading:PropTypes.bool,
  loadingOption:PropTypes.object,
  // eventsObj:PropTypes.object,
  // opts: PropTypes.shape({
  //   devicePixelRatio: PropTypes.number,
  //   renderer: PropTypes.oneOf(['canvas', 'svg']),
  //   width: PropTypes.oneOfType([
  //     PropTypes.number,
  //     PropTypes.oneOf([null, undefined, 'auto'])
  //   ]),
  //   height: PropTypes.oneOfType([
  //     PropTypes.number,
  //     PropTypes.oneOf([null, undefined, 'auto'])
  //   ]),
  // }),
  // shouldSetOption: PropTypes.func,

}

