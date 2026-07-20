import { strings } from "../strings";

function LegendLine({ dash }: { dash?: string }) {
  return (
    <svg width="34" height="8" aria-hidden="true">
      <line x1="0" y1="4" x2="34" y2="4" className="legend-line" strokeDasharray={dash} />
    </svg>
  );
}

export function Legend() {
  return (
    <div className="legend">
      <div className="legend-row">
        <LegendLine />
        <span>{strings.legendAdvisor}</span>
      </div>
      <div className="legend-row">
        <LegendLine dash="9 5" />
        <span>{strings.legendCoAdvisor}</span>
      </div>
      <div className="legend-row">
        <LegendLine dash="2 5" />
        <span>{strings.legendUnverifiedEdge}</span>
      </div>
      <div className="legend-row">
        <span className="legend-node-sample" aria-hidden="true" />
        <span>{strings.legendUnverifiedNode}</span>
      </div>
    </div>
  );
}
