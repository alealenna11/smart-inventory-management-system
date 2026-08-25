import React, { useState } from "react";
import "../styles/executive.css";

export default function DashboardCharts() {

  const allocation = [120,150,180,210];
  const months = ["Jan","Feb","Mar","Apr"];

  const max = Math.max(...allocation);
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="charts-container">

      <div className="chart-card full">

        <h3>Allocation Trend</h3>

        <svg width="100%" height="240">

          {/* LINE */}
          {allocation.map((v,i)=>{
            if(i===0) return null;

            const x1=((i-1)/(allocation.length-1))*100;
            const y1=200-(allocation[i-1]/max)*160;

            const x2=(i/(allocation.length-1))*100;
            const y2=200-(v/max)*160;

            return (
              <line
                key={"line"+i}
                x1={`${x1}%`}
                y1={y1}
                x2={`${x2}%`}
                y2={y2}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}

          {/* POINTS */}
          {allocation.map((v,i)=>{

            const x = (i/(allocation.length-1))*100;
            const y = 200 - (v/max)*160;

            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="6"
                  fill="#3b82f6"
                  onMouseEnter={()=>setHoverIndex(i)}
                  onMouseLeave={()=>setHoverIndex(null)}
                />

                {hoverIndex === i && (
                  <g>
                    <rect
                      x={`${x}%`}
                      y={y - 40}
                      width="70"
                      height="26"
                      rx="6"
                      fill="#0f2a3d"
                    />
                    <text
                      x={`${x}%`}
                      y={y - 22}
                      fill="white"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {months[i]}: {v}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        </svg>

        <div className="chart-labels">
          {months.map(m=>(<span key={m}>{m}</span>))}
        </div>

      </div>

    </div>
  );
}