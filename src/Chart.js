import React from 'react';
import './Chart.css';
const d3 = window.d3;

class Chart extends React.Component {
  componentDidUpdate() {
    if (this.props.data && this.props.data.length) {
      this.buildChart(this.props.data)
    }
  }

  // Modified version of https://bl.ocks.org/zischwartz/2206230da01250355565e65d4f3d58c4
  buildChart(data){
    // Define margins
    const margin = { top: 0, right: 20, bottom: 50, left: 20 };
    const width = parseInt(d3.select('.chart').style('width')) - margin.left - margin.right;
    const height = parseInt(d3.select('.chart').style('height')) - margin.top - margin.bottom;

    // Define scales
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Define X axis
    const xAxis = d3.axisBottom().scale(xScale);
    xAxis.ticks(Math.max(width / 75, 2)).tickFormat(d3.timeFormat('%b'));

    // Define lines
    const line = d3.line().curve(d3.curveMonotoneX).x(d => xScale(d.date)).y(d => yScale(d.concentration));

    // Define chart element
    const chart = d3
      .select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Place the X axis on the chart
    chart.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${height})`).call(xAxis);

    // Convert date strings to objects
    const parseDate = d3.timeParse('%Y-%m-%d');
    data.forEach(d => d.date = parseDate(d.date));

    // Set the domain of the X axis
    xScale.domain(d3.extent(data, d => d.date));

    // Set the domain of the Y axis
    const amounts = data.reduce((acc, d) => {
      acc.push(d.ThisYear, d.LastYear);
      return acc;
    }, []);
    yScale.domain([Math.min(...amounts) - 2000000, Math.max(...amounts) + 2000000]);

    // Now update chart with data
    const concentrations = ['ThisYear', 'LastYear'].map(category => {
      return {
        category,
        datapoints: data.map(d => ({date: d.date, concentration: +d[category]}))
      };
    });

    chart
      .selectAll('.category')
      .data(concentrations)
      .enter()
      .append('g')
      .attr('class', d => d.category)
      .append('path').attr('d', d => line(d.datapoints));

    // Updates the scale, lines, and axis on resize event
    function resizeChart() {
      const width = parseInt(d3.select('.chart').style('width')) - margin.left - margin.right;
      const height = parseInt(d3.select('.chart').style('height')) - margin.top - margin.bottom;

      xScale.range([0, width]);
      yScale.range([height, 0]);
      chart.select('.x.axis').attr('transform', `translate(0, ${height})`).call(xAxis);
      chart.selectAll('.ThisYear path, .LastYear path').attr('d', d => line(d.datapoints));
      xAxis.ticks(Math.max(width / 75, 2)).tickFormat(d3.timeFormat('%b'));
    }

    d3.select(window).on('resize', resizeChart);
    resizeChart();
  }

  render() {
    return <div>
      <svg className="chart block full-width"></svg>
    </div>
  }
}

export default Chart;