import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "./data/mockGeoFeatures";
import { mockGeographyData as data } from "./data/mockData";

const GeographyChart = () => {
  return (
    <ResponsiveChoropleth
      data={data}
      features={geoFeatures.features}
      theme={{
        axis: {
          domain: { line: { stroke: "rgba(255,255,255,0.1)" } },
          legend: { text: { fill: "#a1a1aa" } },
          ticks: {
            line: { stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 },
            text: { fill: "#a1a1aa" },
          },
        },
        legends: { text: { fill: "#a1a1aa" } },
        tooltip: { container: { color: "#12151F" } }
      }}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 1000000]}
      unknownColor="rgba(255,255,255,0.05)"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={50}
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      enableGraticule={false}
      graticuleLineColor="rgba(255,255,255,0.1)"
      borderWidth={0.5}
      borderColor="rgba(255,255,255,0.2)"
      colors="purples"
    />
  );
};

export default GeographyChart;
