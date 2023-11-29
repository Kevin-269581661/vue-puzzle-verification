
function getReportChartOptions ({ xData = [], yData = [] }) {
  // X 轴最多显示的个数
  const X_MAX_NUMBER = 8
  return {
    xAxis: {
      // name: '日期',
      type: 'category',
      data: xData,
      axisLabel: {
        // interval: 1,
        color: 'rgba(0, 0, 0, 0.65)',
        fontSize: 12
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#E9E9E9'
        }
      },
    },
    yAxis: {
      // min: 0,
      // max: 4,
      // name: '次数',
      type: 'value',
      boundaryGap: [0, 0.3],
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(0, 0, 0, 0.65)',
        fontSize: 12
      },
      nameTextStyle: {
        color: 'rgba(0, 0, 0, 0.65)'
      },
    },
    grid: {
      top: '10%',
      left: '0%',
      right: '0%',
      bottom: '10%',
      containLabel: true
    },
    series: [
      {
        name: '总开门次数',
        type: 'line',
        data: yData,
        smooth: 0.7,
        showSymbol: true,
        lineStyle: {
          normal: {
            color: '#1890FF'
          }
        },
        itemStyle: {
          color: '#1890FF',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 1,
                color:'rgba(24, 144, 255, 0.2)'
              },
              {
                offset: 0,
                color: 'rgba(16, 137, 255, 0.05)'
              }
            ],
            globalCoord: false
          }
        },
      }
    ],
    tooltip: {},
    dataZoom: [
      {
        // type: 'inside',
        type: 'slider',
        show: true,
        showDetail: true,
        start: 0,
        // end: (X_MAX_NUMBER / xData.length) * 100,
        end: 100,
        minSpan: 0,
        // zoomLock: true,
        // maxSpan: (X_MAX_NUMBER / xData.length) * 100,
        maxSpan: 100,
        // moveOnMouseWheel: true,
        // zoomOnMouseWheel: false,
        filterMode: 'empty',
        right: '10px',
        left: '10px'
      }
    ],
  }
}

export {
  getReportChartOptions
}
