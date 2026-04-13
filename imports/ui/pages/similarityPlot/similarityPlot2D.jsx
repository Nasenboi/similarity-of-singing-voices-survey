import {useTheme} from "next-themes";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Plot from "react-plotly.js";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AXIS_LAYOUT, CONFIG, LAYOUT, LINE_COLORS, LINE_OPACITY, MARKER_COLORS, getHoverInfos} from "./plotConfig";

function SimilarityPlot2Dm({songs, lines}) {
  const {setTrackID} = useAudioContext();
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setTrackID(null);
  }, []);

  const x = songs.map((s) => s.UMAP2D.UMAP_1);
  const y = songs.map((s) => s.UMAP2D.UMAP_2);
  const cluster = songs.map((s) => s.cluster);
  const hovertemplate = songs.map((s) => {
    return getHoverInfos(s, t);
  });

  const customdata = songs.map((s) => ({
    trackID: s.trackID,
  }));

  const trace = {
    x,
    y,
    hovertemplate,
    customdata,
    hoverInfo: "text",
    type: "scatter",
    mode: "markers",
    marker: {
      ...MARKER_COLORS[theme || "light"],
      color: cluster,
    },
    showlegend: false,
  };

  const lineTraces =
    lines?.map((l) => {
      const {_id, ...cords} = l;
      return {
        ...cords,
        type: "scatter",
        mode: "lines",
        line: {
          color: LINE_COLORS[theme || "light"],
          width: 1,
        },
        opacity: LINE_OPACITY,
        showlegend: false,
      };
    }) || [];

  const axisLayout = {
    ...AXIS_LAYOUT,
    fixedrange: false,
  };

  const layout = {
    ...LAYOUT,
    xaxis: axisLayout,
    yaxis: {
      ...axisLayout,
      scaleanchor: false,
    },
    dragmode: "pan",
  };

  const config = {
    ...CONFIG,
  };

  const onPointClick = ({points}) => {
    setTrackID(points[0].customdata.trackID);
  };

  return <Plot className="size-full" onClick={onPointClick} data={[trace, ...lineTraces]} layout={layout} config={config} />;
}

export const SimilarityPlot2D = React.memo(SimilarityPlot2Dm);
