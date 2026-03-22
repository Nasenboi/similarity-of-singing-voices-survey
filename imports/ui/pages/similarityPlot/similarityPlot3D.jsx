import React from "react";
import {useTranslation} from "react-i18next";
import Plot from "react-plotly.js";
import {useAudioContext} from "../../contextProvider/AudioContext";

function SimilarityPlot3Dm({songs}) {
  const {setTrackID} = useAudioContext();
  const {t} = useTranslation();

  const x = songs.map((s) => s.UMAP3D.UMAP_1);
  const y = songs.map((s) => s.UMAP3D.UMAP_2);
  const z = songs.map((s) => s.UMAP3D.UMAP_3);
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
    z,
    hovertemplate,
    customdata,
    hoverInfo: "text",
    type: "scatter3d",
    mode: "markers",
    marker: {
      color: cluster,
      size: 2,
      symbol: "circle",
      line: {width: 0},
      opacity: 0.8,
    },
  };

  const axisLayout = {
    showgrid: false,
    showline: false,
    showticklabels: false,
    visible: false,
  };

  const layout = {
    autosize: true,
    paper_bgcolor: "#00000000",
    plot_bgcolor: "#00000000",
    scene: {
      xaxis: axisLayout,
      yaxis: axisLayout,
      zaxis: axisLayout,
    },
    dragmode: "turntable",
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

export const SimilarityPlot3D = React.memo(SimilarityPlot3Dm);
