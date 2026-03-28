import {useTheme} from "next-themes";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import Plot from "react-plotly.js";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AXIS_LAYOUT, CONFIG, LAYOUT, LINE_COLORS, LINE_OPACITY, MARKER_COLORS} from "./plotConfig";

function SimilarityPlot3Dm({songs, lines}) {
  const {setTrackID} = useAudioContext();
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setTrackID(null);
  }, []);

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
      ...MARKER_COLORS[theme || "light"],
      color: cluster,
      size: 2,
      symbol: "circle",
      line: {width: 0},
      opacity: 0.8,
    },
    showlegend: false,
  };

  const lineTraces =
    lines?.map((l) => {
      const {_id, ...cords} = l;

      // Use RGBA to control opacity
      const baseColor = LINE_COLORS[theme || "light"];
      const colorWithOpacity = baseColor === "black" ? `rgba(0,0,0,${LINE_OPACITY})` : `rgba(255,255,255,${LINE_OPACITY})`;

      return {
        ...cords,
        type: "scatter3d", // <- important for 3D`
        mode: "lines",
        line: {
          color: colorWithOpacity,
          width: 1,
        },
        hoverinfo: "skip",
        showlegend: false,
      };
    }) || [];

  const axisLayout = AXIS_LAYOUT;

  const layout = {
    ...LAYOUT,
    scene: {
      xaxis: axisLayout,
      yaxis: axisLayout,
      zaxis: axisLayout,
    },
    dragmode: "turntable",
  };

  const config = {
    ...CONFIG,
  };

  const onPointClick = ({points}) => {
    setTrackID(points[0].customdata.trackID);
  };

  return <Plot className="size-full" onClick={onPointClick} data={[trace, ...lineTraces]} layout={layout} config={config} />;
}

export const SimilarityPlot3D = React.memo(SimilarityPlot3Dm);
