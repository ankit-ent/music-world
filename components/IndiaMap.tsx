'use client';

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function IndiaMap() {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 400,
          center: [82, 23]  // Centered on India
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any }) =>
            geographies
              .filter((geo: any) => geo.properties.name === "India")
              .map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  strokeWidth={0.5}
                />
              ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
} 