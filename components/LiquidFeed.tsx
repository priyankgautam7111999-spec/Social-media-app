import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Post, ContentType } from '../types';
import { BadgeCheck, AlertTriangle, Users } from 'lucide-react';

interface LiquidFeedProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const LiquidFeed: React.FC<LiquidFeedProps> = ({ posts, onPostClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // D3 Simulation
  useEffect(() => {
    if (!svgRef.current || posts.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const nodes = posts.map(p => ({ ...p, r: p.type === ContentType.IMAGE ? 80 : 60 }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(5))
      .force("collide", d3.forceCollide().radius((d: any) => d.r + 10).iterations(2))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("y", d3.forceY(0).strength(0.05))
      .force("x", d3.forceX(0).strength(0.05));

    // Render Groups
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      )
      .on("click", (event, d) => onPostClick(d));

    // Bubbles (Glassmorphism)
    nodeGroup.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", "rgba(30, 41, 59, 0.6)")
      .attr("stroke", (d) => d.truthScore && d.truthScore < 50 ? "#ef4444" : "rgba(148, 163, 184, 0.3)")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

    // Content (ForeignObject for HTML text wrapping)
    const foreignObject = nodeGroup.append("foreignObject")
      .attr("x", (d) => -d.r + 10)
      .attr("y", (d) => -d.r + 10)
      .attr("width", (d) => (d.r * 2) - 20)
      .attr("height", (d) => (d.r * 2) - 20);

    const div = foreignObject.append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("justify-content", "center")
      .style("align-items", "center")
      .style("color", "white")
      .style("text-align", "center")
      .style("font-size", "12px")
      .style("pointer-events", "none"); // Let click pass to group

    // Post Content Logic inside D3
    div.html((d) => {
        let contentHtml = `<div class="font-bold text-xs mb-1 text-cyan-300">${d.author.handle}</div>`;
        if (d.type === ContentType.IMAGE) {
            contentHtml += `<div class="w-full h-16 bg-cover bg-center rounded-lg mb-1" style="background-image: url('${d.imageUrl}')"></div>`;
        }
        contentHtml += `<div class="line-clamp-3 overflow-hidden text-gray-200">${d.content}</div>`;
        return contentHtml;
    });

    // Icons/Badges (Truth Score)
    nodeGroup.filter(d => (d.truthScore || 0) > 90)
      .append("circle")
      .attr("cx", d => d.r * 0.707) // 45 deg
      .attr("cy", d => -d.r * 0.707)
      .attr("r", 10)
      .attr("fill", "#10b981"); // Emerald green

    // Simulation Tick
    simulation.on("tick", () => {
      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      
      // Boundary constraint (Soft)
      nodeGroup.attr("cx", (d: any) => d.x = Math.max(d.r, Math.min(dimensions.width - d.r, d.x)));
      nodeGroup.attr("cy", (d: any) => d.y = Math.max(d.r, Math.min(dimensions.height - d.r, d.y)));
    });

    // Drag Functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [posts, dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
       <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-cyan-400 font-display text-sm tracking-widest uppercase opacity-70">Liquid Interface v4.2</h3>
         <p className="text-xs text-slate-400">Physics-driven content delivery</p>
       </div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
    </div>
  );
};

export default LiquidFeed;