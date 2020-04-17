import React, { useState, useEffect } from 'react'
// import './App.css'
import * as d3 from "d3";
import { select } from 'd3-selection';
import numeral from 'numeral';

import '../../App.css';

const BubbleChart = props => {

    const colors = [
        // '#51574a',
        // '#447c69',
        '#74c493',
        // '#8e8c6d',
        '#e4bf80',
        '#e9d78e',
        '#e2975d',
        '#f19670',
        '#e16552',
        '#c94a53',
        '#be5168',
        '#a34974',
        '#993767',
        '#65387d',
        '#4e2472',
        '#9163b6',
        '#e279a3',
        '#e0598b',
        '#7c9fb0',
        '#5698c4',
        '#9abf88'
    ]
    

    const data = {children : []};
    const [node, setNode] = useState();
    // const inputX = props.input/100

    const drawChart = () => {

        data.children = props.data;
    
        // const format = d3.format(",d");
        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
    
        // const color = d3.scaleOrdinal(d3.schemeCategory20);
    
        const bubble = d3.pack(data)
            .size([width, height])
            .padding(3);
    
        const nodes = d3.hierarchy(data)
            .sum(function(d) { return d.value; });

        var tooltip = d3.select('body')
            .append("div")	
            .attr("class", "tooltip")
            .style("opacity", 0);
    
    

        // let getSelect = select(node)
        //     .selectAll()
        //     .remove()
        
        let getSelect = select(node)
            .selectAll('circle')
            .remove();
            
        getSelect = select(node)
            .selectAll('text')
            .remove()
                    
        getSelect = select(node)
            .selectAll('circle')
            .data(bubble(nodes).descendants())
            .enter()
            .filter(d => !d.children)
            .append("g")
            .attr("class", "node")
            .attr("transform", d => 
                `translate(${d.x},${d.y})`)
            .on("mouseover", d => {
                tooltip
                    .text(d.data.displayText)
                    .style("opacity", 1)	
                    .style("left", d3.event.pageX + 'px')		
                    .style("top", d3.event.pageY + 'px');
            })					
            .on("mouseout", () => {		
                tooltip.style("opacity", 0);
            }
        );;

    
        getSelect.append("circle")
            .attr("id", d => d.data._id)
            .attr("r", d => d.r)
            .style("fill", d => colors[d.data.index]);
          
    
        getSelect.append("text")
            .attr("dy", ".3em")
            .attr("font-size","12px")
            .style("text-anchor", "middle")
            .text(d => d.data.value > 1 ? numeral(d.data.value * numeral(props.input).value()/100).format('0,0') : null);
    
        // getSelect.append("title")
        //     .text(d => d.data.displayText);
    
        } 

    useEffect(() => props.data ? drawChart() : null , [node, props.data, props.input]);

    return(
        <div>
            <svg ref={node => setNode(node)} width={window.innerWidth} height={window.innerHeight/5} />
        </div>   
    );
}
export default BubbleChart