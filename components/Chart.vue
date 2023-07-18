<template>
  <div>
    <div v-if="isLoading" class="text-white flex justify-center items-center my-5 min-h-[180px]" >
      <SpinIcon />

    </div>
    <svg :class="isLoading ? 'hidden' : 'opacity-0'" ref="chartRef"></svg>

  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';
  import { storeToRefs } from 'pinia';
  import SpinIcon from './icons/SpinIcon.vue';
  import gsap from 'gsap';

  const { $expenseStore } = useNuxtApp()
  const { expenses } = storeToRefs($expenseStore)
  const isLoading = ref(true)

  const expensesByMonth = ref([])
  const chartRef = ref(null);
  const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ data: [] }],
  });

  const labels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
  const data = ref([])

  onMounted(async () => {
    setTimeout( async ()=> {
    
    await getChartData()
    isLoading.value = false
    renderChart()

    gsap.to(chartRef.value, {
      opacity: 1,
      duration: 1,
      delay: 0.5
    })
    }, 1000)
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
      .domain(labels.value)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.value)])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(labels.value[i]) + x.bandwidth() / 2)
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
      

    svg.append('path')
      .datum(data.value)
      .attr('fill', 'none')
      .attr('stroke', 'white') // line color 
      .attr('stroke-width', 2)
      .attr('d', line);
      

    svg.selectAll('circle')
      .data(data.value)
      .join('circle')
      .attr('cx', (d, i) => x(labels.value[i]) + x.bandwidth() / 2)
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

  const getChartData = async () =>  {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December']
    
    data.value = await Promise.all(months.map(async (month) => {
      const total = (await $expenseStore.calcTotalOfCurrentMonth(month, expenses.value, false)).toFixed(2)
      return +total
    }))
  }

  watchEffect(async () => {
    if (expenses.value.length && chartRef.value) {
      isLoading.value = true
      chartRef.value.innerHTML = ''
      await getChartData()
      renderChart()
      
      setTimeout(()=> {
        isLoading.value = false
      }, 1000)
    }
  })

</script>
