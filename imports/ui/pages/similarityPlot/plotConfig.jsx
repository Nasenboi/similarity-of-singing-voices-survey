export const AXIS_LAYOUT = {
  showgrid: false,
  showline: false,
  showticklabels: false,
  visible: false,
};

export const LAYOUT = {
  autosize: true,
  paper_bgcolor: "#00000000",
  plot_bgcolor: "#00000000",
  hovermode: "closest",
  uirevision: "static",
  margin: {
    b: 0,
    t: 0,
    l: 0,
    r: 0,
  },
};

// light: Cividis
// dark: Picnic
// plotConfig.js
export const MARKER_COLORS = {
  light: {colorscale: "Cividis"},
  dark: {colorscale: "Picnic"},
};

export const LINE_COLORS = {
  light: "black",
  dark: "white",
};

export const LINE_OPACITY = 0.2;

export const CONFIG = {
  displayModeBar: false,
  scrollZoom: true,
  responsive: true,
};

export const getHoverInfos = (s, t) => {
  const artistPage = s.artist.replace(/\s+/g, "_");
  const url = `https://freemusicarchive.org/music/${artistPage}`;

  return `${[
    `<b>${t("Collections.Songs.song")}:</b> ${s.trackID}`,
    `<b>${t("Collections.Songs.cluster")}:</b> ${s.cluster}`,
    `<b>${t("Collections.Songs.title")}:</b> ${s.title}`,
    `<b>${t("Collections.Songs.artist")}:</b> ${s.artist}`,
    `<b>${t("Collections.Songs.source")}:</b> ${url}`,
    `<b>${t("Collections.Songs.license")}:</b> ${s.license}`,
  ].join("<br>")}<extra></extra>`;
};
