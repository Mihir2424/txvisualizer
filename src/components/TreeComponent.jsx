/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import * as d3 from "d3";

function TreeComponent({ responseData, centralAddress }) {
  const svgRef = useRef();

  const networkData = {
    nodes: [
      { id: centralAddress, label: "Central Node" },
      ...responseData.map((item, index) => ({
        id: item.address,
        label: `Node ${index + 1}`,
        tx_count: item.tx_count !== undefined ? item.tx_count : null,
      })),
    ],
  };

  networkData.links = networkData.nodes
    .filter((node) => node.id !== centralAddress)
    .map((node) => ({ source: centralAddress, target: node.id }));

  useEffect(() => {
    const width = 800;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(networkData.nodes)
      .force(
        "link",
        d3
          .forceLink(networkData.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg
      .selectAll(".link")
      .data(networkData.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", (d) => {
        // Set the stroke width based on the tx_count of the target node
        const targetNode = networkData.nodes.find((node) => node.id === d.target);
        return targetNode?.tx_count;
      })
      .style("stroke", "gray");

    const nodes = svg
      .selectAll(".node")
      .data(networkData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, []);

  return (
    <div className="tree-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default TreeComponent;
