import {useTheme} from "next-themes";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Plot from "react-plotly.js";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AXIS_LAYOUT, CONFIG, LAYOUT, MARKER_COLORS} from "./plotConfig";

function SimilarityPlot2Dm({songs}) {
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
    return `${[
      `${t("Collections.Songs.song")} ${s.trackID}`,
      `${t("Collections.Songs.artist")} ${s.artist}`,
      `${t("Collections.Songs.album")} ${s.album}`,
      `${t("Collections.Songs.cluster")} ${s.cluster}`,
    ].join("<br>")}<extra></extra>`;
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
  };

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

  return <Plot className="size-full" onClick={onPointClick} data={[trace]} layout={layout} config={config} />;
}

export const SimilarityPlot2D = React.memo(SimilarityPlot2Dm);
