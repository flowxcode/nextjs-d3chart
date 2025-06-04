"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const D3Dashboard: React.FC = () => {
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const lineChartRef = useRef<SVGSVGElement | null>(null);
  const pieChartRef = useRef<SVGSVGElement | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Sample data
  const data = {
    sales: [
      { month: 'Jan', value: 30 },
      { month: 'Feb', value: 45 },
      { month: 'Mar', value: 60 },
      { month: 'Apr', value: 50 },
      { month: 'May', value: 75 },
      { month: 'Jun', value: 90 },
    ],
    revenue: [
      { month: 'Jan', value: 200 },
      { month: 'Feb', value: 300 },
      { month: 'Mar', value: 450 },
      { month: 'Apr', value: 400 },
      { month: 'May', value: 600 },
      { month: 'Jun', value: 800 },
    ],
    categories: [
      { name: 'Product A', value: 40 },
      { name: 'Product B', value: 30 },
      { name: 'Product C', value: 20 },
      { name: 'Product D', value: 10 },
    ],
  };

  useEffect(() => {
    // Bar Chart
    if (barChartRef.current) {
      const svg = d3.select(barChartRef.current);
      svg.selectAll('*').remove();
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const currentData = selectedMetric === 'sales' ? data.sales : data.revenue;

      const xScale = d3.scaleBand()
        .domain(currentData.map(d => d.month))
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(currentData, d => d.value) || 0])
        .range([innerHeight, 0])
        .nice();

      // Axes
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('font-size', '12px');

      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size', '12px');

      // Bars with animation
      g.selectAll('.bar')
        .data(currentData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.month) || 0)
        .attr('y', innerHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', '#3b82f6')
        .transition()
        .duration(800)
        .attr('y', d => yScale(d.value))
        .attr('height', d => innerHeight - yScale(d.value));

      // Tooltip
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('padding', '8px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px')
        .style('opacity', 0);

      g.selectAll('.bar')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', '#2563eb');
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`${d.month}: ${d.value}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#3b82f6');
          tooltip.transition().duration(500).style('opacity', 0);
        });
    }

    // Line Chart
    if (lineChartRef.current) {
      const svg = d3.select(lineChartRef.current);
      svg.selectAll('*').remove();
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const currentData = selectedMetric === 'sales' ? data.sales : data.revenue;

      const xScale = d3.scalePoint()
        .domain(currentData.map(d => d.month))
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(currentData, d => d.value) || 0])
        .range([innerHeight, 0])
        .nice();

      // Axes
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('font-size', '12px');

      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size', '12px');

      // Line
      const line = d3.line<{ month: string; value: number }>()
        .x(d => xScale(d.month) || 0)
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(currentData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('stroke-dasharray', function () {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

      // Dots
      g.selectAll('.dot')
        .data(currentData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.month) || 0)
        .attr('cy', d => yScale(d.value))
        .attr('r', 5)
        .attr('fill', '#10b981')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay((_, i) => i * 100)
        .attr('opacity', 1);
    }

    // Pie Chart
    if (pieChartRef.current) {
      const svg = d3.select(pieChartRef.current);
      svg.selectAll('*').remove();
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;

      const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);
      const color = d3.scaleOrdinal(['#3b82f6', '#10b981', '#f59e0b', '#ef4444']);

      const pie = d3.pie<{ name: string; value: number }>()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

      const arcs = g.selectAll('.arc')
        .data(pie(data.categories))
        .enter()
        .append('g')
        .attr('class', 'arc');

      arcs.append('path')
        .attr('d', arc as any)
        .attr('fill', d => color(d.data.name))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('transform', 'scale(0)')
        .transition()
        .duration(800)
        .attr('transform', 'scale(1)');

      // Labels
      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .style('font-size', '12px')
        .style('fill', 'white')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(400)
        .attr('opacity', 1);
    }

    // Cleanup tooltip on unmount
    return () => {
      d3.select('.tooltip').remove();
    };
  }, [selectedMetric]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      <div className="mb-6">
        <label className="mr-4 text-gray-700 font-medium">Select Metric:</label>
        <select
          value={selectedMetric}
          onChange={e => setSelectedMetric(e.target.value)}
          className="p-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="sales">Sales</option>
          <option value="revenue">Revenue</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Performance (Bar)</h2>
          <svg ref={barChartRef} width={500} height={300}></svg>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Trend Analysis (Line)</h2>
          <svg ref={lineChartRef} width={500} height={300}></svg>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md lg:col-span-2 flex justify-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Category Distribution (Pie)</h2>
            <svg ref={pieChartRef} width={300} height={300}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3Dashboard;