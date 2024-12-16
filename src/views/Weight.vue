<template>
  <div>
    <h1>Weight</h1>
    <div>
      <label for="start-date">Start Date:</label>
      <input type="date" id="start-date" v-model="startDate" @input="debouncedFetchData" />
      <label for="end-date">End Date:</label>
      <input type="date" id="end-date" v-model="endDate" @input="debouncedFetchData" />
    </div>
    <div ref="chart"></div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="dataSet.point.length">
      <!-- Remove the duplicate chart div -->
    </div>
    <div v-else>No data available.</div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref, watch } from "vue";
import { useFitnessStore } from "@/stores/fitness";
import { debounce } from "lodash-es";

const chart = ref(null);
const fitnessStore = useFitnessStore();

const loading = ref(true);
const error = ref(null);
const dataSet = ref(null);

const today = new Date();
const startDate = ref(new Date(today.setDate(today.getDate() - 100)).toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const dataStream = fitnessStore.getDataSourceByType("com.google.weight")?.[0];

    if (!dataStream) {
      throw new Error("Data source not found for type: com.google.weight");
    }

    const dataStreamId = dataStream.dataStreamId;
    const start = new Date(startDate.value).getTime() * 1_000_000; // Start date in nanoseconds
    const end = new Date(endDate.value).getTime() * 1_000_000; // End date in nanoseconds

    const lastFetchStartDate = fitnessStore.getLastFetchStartDateByType("com.google.weight");
    const lastFetchEndDate = fitnessStore.getLastFetchEndDateByType("com.google.weight");

    // Use cache if the date picker hasn't changed since the last fetch
    if (lastFetchStartDate === start && lastFetchEndDate === end) {
      dataSet.value = fitnessStore.getDataSetByType("com.google.weight");
    } else {
      // Fetch data entries between the selected dates
      await fitnessStore.fetchDataSet(dataStreamId, start, end, "com.google.weight");
      dataSet.value = fitnessStore.getDataSetByType("com.google.weight");
    }

    drawChart();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const debouncedFetchData = debounce(fetchData, 300);

const drawChart = () => {
  const margin = { top: 20, right: 30, bottom: 70, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const x = d3
    .scaleBand()
    .domain(dataSet.value.point.map((d) => new Date(d.startTimeNanos / 1_000_000)))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(dataSet.value.point, (d) => d.value[0].fpVal)])
    .nice()
    .range([height, 0]);

  // Clear previous chart elements
  d3.select(chart.value).selectAll("*").remove();

  const svg = d3
    .select(chart.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

  // Filter x-axis labels to show only a subset
  const totalLabels = 30;
  const ticks = xAxis.selectAll(".tick text");
  const tickCount = ticks.size();
  ticks.each(function (d, i) {
    if (i % Math.ceil(tickCount / totalLabels) !== 0) {
      d3.select(this).remove();
    }
  });

  ticks.attr("transform", "rotate(45)").style("text-anchor", "start");

  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll(".bar")
    .data(dataSet.value.point)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(new Date(d.startTimeNanos / 1_000_000)))
    .attr("y", (d) => y(d.value[0].fpVal))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value[0].fpVal))
    .attr("fill", "steelblue");
};

onMounted(fetchData);
watch([startDate, endDate], debouncedFetchData);
</script>

<style scoped>
svg {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  shape-rendering: crispEdges;
}

.bar {
  fill: steelblue;
}
</style>
