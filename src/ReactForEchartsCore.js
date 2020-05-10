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

export default class ReactForEchartsCore extends Component{
  constructor(props) {
    super(props);
    //获取 <ReactEcharts/> 传进来的 props
    this.oriEcharts=props.echarts
    this.echartsRef=React.createRef()
  }

  //初始化
  componentDidMount() {
    this.rerender()
  }

  getEchartsInstance=()=>{
    const {oriEcharts,echartsRef}=this
    const {theme,opts,}=this
    const echartsInstance=oriEcharts.getInstanceByDom(echartsRef.current)
      || oriEcharts.init(echartsRef.current, theme, opts);
    return echartsInstance
  }

  /*对echarts实例，进行配置，核心函数*/
  renderEchartDom=()=>{
    /*set echart option*/
    const {option,notMerge,showLoading,loadingOption,
      // lazyUpdate,
    }=this.props

    //init the echart object
    const echartObj=this.getEchartsInstance()

    /*自定义api——option,notMerge*/
    echartObj.setOption(option,notMerge,)

    /*自定义api——showLoading*/
    if(showLoading){
      echartObj.showLoading(loadingOption)
    }else{
      echartObj.hideLoading()
    }

    return echartObj
  }

  // // bind the events
  // bindEvents = (instance, events) => {
  //   const _bindEvent = (eventName, func) => {
  //     // ignore the event config which not satisfy
  //     if (typeof eventName === 'string' && typeof func === 'function') {
  //       // binding event
  //       // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作
  //       instance.on(eventName, (param) => {
  //         func(param, instance);
  //       });
  //     }
  //   };
  //
  //   // loop and bind
  //   for (const eventName in events) {
  //     if (Object.prototype.hasOwnProperty.call(events, eventName)) {
  //       _bindEvent(eventName, events[eventName]);
  //     }
  //   }
  // };

  rerender=()=>{
    //获取 <ReactEcharts/> 传进来的
    const {onEvents,onChartReady}=this.props
    //todo:
    const echartObj=this.renderEchartDom()
    // this.bindEvents(echartObj,onEvents||{})

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

  // // dispose echarts and clear size-sensor
  // dispose = () => {
  //   const {echartsRef,oriEcharts}=this
  //   if (echartsRef) {
  //     try {
  //       clear(echartsRef);
  //     } catch (e) {
  //       console.warn(e);
  //     }
  //     // dispose echarts instance
  //     oriEcharts.dispose(echartsRef);
  //   }
  // };

  // // update
  // componentDidUpdate(prevProps) {
  //   // 判断是否需要 setOption，由开发者自己来确定。默认为 true
  //   if (typeof this.props.shouldSetOption === 'function' && !this.props.shouldSetOption(prevProps, this.props)) {
  //     return;
  //   }
  //
  //   // 以下属性修改的时候，需要 dispose 之后再新建
  //   // 1. 切换 theme 的时候
  //   // 2. 修改 opts 的时候
  //   // 3. 修改 onEvents 的时候，这样可以取消所有之前绑定的事件 issue #151
  //   if (
  //     !isEqual(prevProps.theme, this.props.theme) ||
  //     !isEqual(prevProps.opts, this.props.opts) ||
  //     !isEqual(prevProps.onEvents, this.props.onEvents)
  //   ) {
  //     this.dispose();
  //
  //     this.rerender(); // 重建
  //     return;
  //   }
  //
  //   // 当这些属性保持不变的时候，不 setOption
  //   const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
  //   if (isEqual(pick(this.props, pickKeys), pick(prevProps, pickKeys))) {
  //     return;
  //   }
  //
  //   const echartObj = this.renderEchartDom();
  //   // 样式修改的时候，可能会导致大小变化，所以触发一下 resize
  //   if (!isEqual(prevProps.style, this.props.style) || !isEqual(prevProps.className, this.props.className)) {
  //     try {
  //       echartObj.resize();
  //     } catch (e) {
  //       console.warn(e);
  //     }
  //   }
  // }

  // // remove
  // componentWillUnmount() {
  //   this.dispose();
  // }

  render(){
    const {style,className}=this.props

    return(<div
      ref={this.echartsRef}
      style={{height:300,...style}}
      // className={className}
    />)


  }

}

//默认 props
ReactForEchartsCore.defaultProps={
  //是否不跟之前设置的 option 进行合并，默认为 false，即合并。
  notMerge:false,
  // echarts:{}
  // lazyUpdate:false,
  style:{},
  className:{},
  // theme:null,
  // onChartReady:()=>{},
  showLoading:false,
  loadingOption:null,
  // onEvents:{},
  // opts:{},
  // shouldSetOption:()=>true,

}
//指定 prop 类型
ReactForEchartsCore.propTypes={
  //图表的配置项和数据，必填
  option:PropTypes.object.isRequired,
  notMerge:PropTypes.bool,
  // echarts:PropTypes.object,
  // lazyUpdate:PropTypes.bool,
  style:PropTypes.object,
  className:PropTypes.object,
  // theme:PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
  // onChartReady:PropTypes.func,
  showLoading:PropTypes.bool,
  loadingOption:PropTypes.object,
  // onEvents:PropTypes.object,
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

