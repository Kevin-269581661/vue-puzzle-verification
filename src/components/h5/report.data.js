function getReportChartOptions (xData = [], yData = []) {
  return {
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 1
      },
      axisTick: {
        alignWithLabel: true
      },
      data: xData
    },
    yAxis: {
      type: 'value',
      interval: 1,
      min:0,
    },
    grid: {
      top:'40px',
      left: '100px',
      right: '50px',
      bottom: '40px'
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 1,
                color:'rgba(16, 137, 255, 0.20)'
              },
              {
                offset: 0,
                color: 'rgba(16, 137, 255, 0.00)'
              }
            ],
            globalCoord: false
          }
        },
      }
    ]
  }
}

export {
  getReportChartOptions
}
