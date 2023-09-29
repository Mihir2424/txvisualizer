import { useEffect, useRef } from "react";
import * as d3 from "d3";

function TreeComponent() {
  const svgRef = useRef();
  const centralAddress = "0x900d0881a2e85a8e4076412ad1cefbe2d39c566c";

  const networkData = {
    nodes: [
      { id: centralAddress },
      { id: "0x0cc278edcf5b265c75978f5bbece8340e2e7c115" },
      { id: "0x7700edddd3fc34c18fe2ab14b5345f1596d10553" },
      { id: "0xa6f3b7a54884ef2a18dd3791b88741cc149fa659" },
      { id: "0x76acf33951b1d58c0df0388194926eb5f22e520d" },
      { id: "0x1151314c646ce4e0efd76d1af4760ae66a9fe30f" },
      { id: "0xfa129dce2215e3f16aa9b1bd31601873206157c5" },
      { id: "0xc1ddc380d7631abfeadda85bc804cac147b6a20a" },
      { id: "0xedfe2ce9383f11c6fb357fb684a54e9849ad74e6" },
      { id: "0xc4ce7b61c02b75a84547884f7039c082c5c7edba" },
      { id: "0x158c0456a4c2c12d89dafad5abba1e50df6ed7aa" },
      { id: "0x13c0d0861c70d827ae12c0d0861c70d827ae91267269925739274572fd" },
      { id: "0x2ffab7c13cfb92ef80e46889cc9f671d1a35339b" },
      { id: "0x619d3c02fdf4ef097d560923af914974b682ba58" },
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
      .style("stroke-width", 1)
      .style("stroke", "black");

    const linkLabels = svg
      .selectAll(".link-label")
      .data(networkData.links)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .text((d) => d.label) // Assuming you have a "label" property in your link data
      .attr("dy", -10) // Adjust the vertical position of the label
      .attr("text-anchor", "middle"); // Center the label with respect to the link

    // Position the labels at the midpoint of the links
    linkLabels
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);

    const nodes = svg
      .selectAll(".node")
      .data(networkData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10);

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

 // const networkData = {
  //   nodes: [
  //     { id: centralAddress },
  //     { id: "0x0cc278edcf5b265c75978f5bbece8340e2e7c115" },
  //     { id: "0x7700edddd3fc34c18fe2ab14b5345f1596d10553" },
  //     { id: "0xa6f3b7a54884ef2a18dd3791b88741cc149fa659" },
  //     { id: "0x76acf33951b1d58c0df0388194926eb5f22e520d" },
  //     { id: "0x1151314c646ce4e0efd76d1af4760ae66a9fe30f" },
  //     { id: "0xfa129dce2215e3f16aa9b1bd31601873206157c5" },
  //     { id: "0xc1ddc380d7631abfeadda85bc804cac147b6a20a" },
  //     { id: "0xedfe2ce9383f11c6fb357fb684a54e9849ad74e6" },
  //     { id: "0xc4ce7b61c02b75a84547884f7039c082c5c7edba" },
  //     { id: "0x158c0456a4c2c12d89dafad5abba1e50df6ed7aa" },
  //     { id: "0x13c0d0861c70d827ae12c0d0861c70d827ae91267269925739274572fd" },
  //     { id: "0x2ffab7c13cfb92ef80e46889cc9f671d1a35339b" },
  //     { id: "0x619d3c02fdf4ef097d560923af914974b682ba58" },
  //   ],
  // };

  // networkData.links = networkData.nodes
  //   .filter((node) => node.id !== centralAddress)
  //   .map((node) => ({ source: centralAddress, target: node.id }));
