import { ResponsiveLine } from "@nivo/line";
import { mockLineData as data } from "./data/mockData";

const LineChart = () => {
  return (
    <ResponsiveLine
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
        tooltip: { container: { color: "#12151F", background: "#ffffff" } },
        grid: { line: { stroke: "rgba(255,255,255,0.05)" } }
      }}
      colors={({ color }) => color}
      margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        legend: "Month",
        legendOffset: 30,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        legend: "Users",
        legendOffset: -35,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={true}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;