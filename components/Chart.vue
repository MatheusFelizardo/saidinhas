<template>
  <div>
    <svg ref="chartRef"></svg>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';

  const chartRef = ref(null);
  const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ data: [490.24, 1144.65, 0, 0, 0, 1690.42, 2150.75, 0, 0, 0, 0, 0] }],
  });

  onMounted(() => {
    renderChart();
  });

  const renderChart = () => {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 414 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.value)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .domain(chartData.value.labels)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData.value.datasets[0].data)])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(chartData.value.labels[i]) + x.bandwidth() / 2)
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
      

    svg.append('path')
      .datum(chartData.value.datasets[0].data)
      .attr('fill', 'none')
      .attr('stroke', 'white') // line color 
      .attr('stroke-width', 2)
      .attr('d', line);
      

    svg.selectAll('circle')
      .data(chartData.value.datasets[0].data)
      .join('circle')
      .attr('cx', (d, i) => x(chartData.value.labels[i]) + x.bandwidth() / 2)
      .attr('cy', d => y(d))
      .attr('r', 4)
      .attr('fill', 'white'); // bullet color 

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .style('color', 'white') // x axis color 
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('color', 'white'); // y axis color 

  };
</script>
