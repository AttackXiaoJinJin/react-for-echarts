import ReactEcharts from './index'
import React,{useState,useEffect} from 'react'
import ReactDOM from 'react-dom';

const option = {
  backgroundColor: '#2c343c',
  title: {
    text: 'Customized Pie',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ccc'
    }
  },
  series : [
    {
      name:'访问来源',
      type:'pie',
      radius : '55%',
      center: ['50%', '50%'],
      data:[
        {value:335, name:'直接访问'},
        {value:310, name:'邮件营销'},
        {value:274, name:'联盟广告'},
        {value:235, name:'视频广告'},
        {value:400, name:'搜索引擎'}
      ],
      roseType: 'angle',
    }
  ]
};

export const loadStyle = {
  text: '正在加载。。。',
  color: '#c23531',
  textColor: '#000',
  maskColor: 'rgba(255, 255, 255, 1)',
  zlevel: 10,
};

function App() {
  const [isLoading,setLoading]=useState(true)

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false)
    },2000)
  },[])

  console.log(isLoading,'isLoading89')

  return (
    <div>
      <ReactEcharts
        style={{
          height: 400,
          width: 400,
        }}
        option={option}
        loadingOption={loadStyle}
        showLoading={isLoading}
        notMerge
      />
  </div>
);
}

ReactDOM.render(<App />, document.getElementById('root'));
