   "use client"

   import React, { useEffect, useRef } from 'react';
   import * as d3 from 'd3';

   const D3Chart: React.FC = () => {
     const chartRef = useRef<SVGSVGElement | null>(null);

     useEffect(() => {
       if (chartRef.current) {
         const svg = d3.select(chartRef.current);
         const width = 400;
         const height = 200;
         const data = [10, 20, 39, 21, 50];

         const xScale = d3.scaleBand()
           .domain(data.map((d, i) => i.toString()))
           .range([0, width])
           .padding(0.1);

         const yScale = d3.scaleLinear()
           .domain([0, d3.max(data) || 0])
           .range([height, 0]);

         svg.selectAll('rect')
           .data(data)
           .enter()
           .append('rect')
           .attr('x', (d, i) => xScale(i.toString()) || 0)
           .attr('y', d => yScale(d))
           .attr('width', xScale.bandwidth())
           .attr('height', d => height - yScale(d))
           .attr('fill', 'steelblue');
       }
     }, []);

     return <svg ref={chartRef} width={400} height={200}></svg>;
   };

   export default D3Chart;