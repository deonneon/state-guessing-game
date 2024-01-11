import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

import allStates from "./states2.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
};

// Get easyMode from the props
export const MapChart = ({ guessedStates, easyMode, reveal }) => {
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const cur = allStates.find((s) => s.val === geo.id);
              const centroid = geoCentroid(geo);

              // Decide the fill color based on guessedStates and reveal
              let fillColor;
              if (guessedStates.includes(cur?.id)) {
                fillColor = "green";
              } else if (reveal) {
                fillColor = "red";
              } else {
                fillColor = "#DDD";
              }

              return (
                <React.Fragment key={geo.rsmKey}>
                  <Geography stroke="#FFF" geography={geo} fill={fillColor} />
                  {cur &&
                    easyMode &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y="2" fontSize={14} textAnchor="middle">
                          {easyMode &&
                            !guessedStates.includes(cur.id) &&
                            cur.id !== "DC" &&
                            cur.id}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {easyMode &&
                            !guessedStates.includes(cur.id) &&
                            cur.id !== "DC" &&
                            cur.id}
                        </text>
                      </Annotation>
                    ))}
                </React.Fragment>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
