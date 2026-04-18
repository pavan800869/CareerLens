import { ResponsiveBar } from "@nivo/bar";
import { mockBarData as data } from "./data/mockData";

const BarChart = () => {
  return (
    <ResponsiveBar
      data={data}
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
        tooltip: { container: { color: "#12151F" } },
        grid: { line: { stroke: "rgba(255,255,255,0.05)" } }
      }}
      keys={["Applied", "Scheduled", "Rejected"]}
      indexBy="country"
      margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#7C3AED", "#06B6D4", "#F97316"]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -35,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`}
    />
  );
};

export default BarChart;
