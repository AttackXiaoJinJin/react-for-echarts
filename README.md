#### 简介
参照 [echarts-for-react](https://github.com/hustcc/echarts-for-react) ，将`echarts`简单封装成了一个`React`组件，方便在`React`栈中使用

#### 安装
```
yarn add echarts-for-react
```
#### 使用
```
import ReactEcharts from 'react-for-echarts'

<ReactEcharts
        style={{
          height: 400,
          width: 400,
        }}
        option={option}
        loadingOption={loadStyle}
        showLoading={true/false}
        notMerge={true/false}
        eventsObj={
          click:()=>{},
          legendselectchanged:()=>{},  
        }
      />
```
#### API介绍
###### option:object / notMerge:boolean / lazyUpdate:boolean
对应<br/>
`echartsInstance.setOption(option: Object, notMerge?: boolean, lazyUpdate?: boolean)` 

###### style:object
包裹`echarts`的`div`的`style`

###### showLoading:boolean / loadingOption:object
对应<br/>
`echartsInstance.showLoading(loadingOption)`/`echartsInstance.hideLoading`

###### eventObj:object
对应<br/>
`echartsInstance.on`的集合，如：
```
echartsInstance.on("click",()=>{})
echartsInstance.on("legendselectchanged",()=>{})
```
`eventObj`：
```
eventsObj={
  click:()=>{},
  legendselectchanged:()=>{},  
}
```
**注意：**<br/>
暂不支持筛选条件
```
chart.on('mouseover', {seriesName: 'uuu'}, function () {
  //series name 为 'uuu' 的系列中的图形元素被 'mouseover' 时，此方法被回调。
});
```
#### Fork后如何运行
```
yarn add
yarn start
```
打开 `http://localhost:8001/` 即可

#### Issues和PR
请移至 [echarts-for-react](https://github.com/hustcc/echarts-for-react) 提相关`PR`和`Issues`
