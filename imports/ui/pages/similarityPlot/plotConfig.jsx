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

export const LINE_OPACITY = 0.1;

export const CONFIG = {
  displayModeBar: false,
  scrollZoom: true,
  responsive: true,
};
