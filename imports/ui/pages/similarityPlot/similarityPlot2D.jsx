import React from "react";
import {useTranslation} from "react-i18next";
import Plot from "react-plotly.js";
import {useAudioContext} from "../../contextProvider/AudioContext";

// t("SimilarityPlot.2D.title")

function SimilarityPlot2Dm({songs}) {
  const {setTrackID} = useAudioContext();
  const {t} = useTranslation();

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
      color: cluster,
    },
  };

  const axisLayout = {
    showgrid: false,
    showline: false,
    showticklabels: false,
    visible: false,
    fixedrange: false,
  };

  const layout = {
    autosize: true,
    paper_bgcolor: "#00000000",
    plot_bgcolor: "#00000000",
    xaxis: axisLayout,
    yaxis: {
      ...axisLayout,
      scaleanchor: false,
    },
    dragmode: "pan",
    hovermode: "closest",
    uirevision: "static",
  };

  const config = {
    displayModeBar: false,
    scrollZoom: true,
    responsive: true,
  };

  const onPointClick = ({points}) => {
    setTrackID(points[0].customdata.trackID);
  };

  return <Plot className="size-full" onClick={onPointClick} data={[trace]} layout={layout} config={config} />;
}

export const SimilarityPlot2D = React.memo(SimilarityPlot2Dm);
