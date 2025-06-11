import "clsx";
import * as d3 from "d3";
import { extent, InternSet, range, rollup, scaleLinear, scaleBand, rgb, interpolateInferno, scaleOrdinal, max, scaleLog } from "d3";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean) return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
var current_component = null;
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
class HeadPayload {
  /** @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  out = "";
  uid = () => "";
  title = "";
  constructor(css = /* @__PURE__ */ new Set(), out = "", title = "", uid = () => "") {
    this.css = css;
    this.out = out;
    this.title = title;
    this.uid = uid;
  }
}
class Payload {
  /** @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  out = "";
  uid = () => "";
  select_value = void 0;
  head = new HeadPayload();
  constructor(id_prefix = "") {
    this.uid = props_id_generator(id_prefix);
    this.head.uid = this.uid;
  }
}
function props_id_generator(prefix) {
  let uid = 1;
  return () => `${prefix}s${uid++}`;
}
let on_destroy = [];
function render(component, options = {}) {
  const payload = new Payload(options.idPrefix ? options.idPrefix + "-" : "");
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += BLOCK_OPEN;
  if (options.context) {
    push();
    current_component.c = options.context;
  }
  component(payload, options.props ?? {}, {}, {});
  if (options.context) {
    pop();
  }
  payload.out += BLOCK_CLOSE;
  for (const cleanup of on_destroy) cleanup();
  on_destroy = prev_on_destroy;
  let head = payload.head.out + payload.head.title;
  for (const { hash, code } of payload.css) {
    head += `<style id="${hash}">${code}</style>`;
  }
  return {
    head,
    html: payload.out,
    body: payload.out
  };
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
function AxisX($$payload, $$props) {
  push();
  let {
    height,
    scale,
    title
  } = $$props;
  let logFormat10 = scale.tickFormat();
  let xTicks = scale.ticks();
  const each_array = ensure_array_like(xTicks);
  $$payload.out += `<g class="axis x"${attr("transform", `translate(0, ${stringify(height)})`)}><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let tick = each_array[index];
    $$payload.out += `<g class="xtick"${attr("transform", `translate(${stringify(scale(tick))}, 0)`)}><line x1="0" x2="0" y1="0" y2="6" stroke="hsla(212, 10%, 53%, 1)"></line></g><g class="tick-text"${attr("transform", `translate(${stringify(scale(tick))}, 0) scale(-1,1) rotate(45)`)}><text font-size="10" dx="13" dy="13">${escape_html(logFormat10(tick))}</text></g>`;
  }
  $$payload.out += `<!--]--><g class="xlab svelte-1y8xk6i"${attr("transform", `scale(-1,1) translate(-${stringify(height)}, 0)`)}><text dy="45"${attr("x", height / 2)}>Rank r</text><text dy="63"${attr("x", height / 2)}>for</text><text dy="80"${attr("x", height / 2)}>${escape_html(title[1])}</text><text dy="60"${attr("x", height - 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">more →</text><text dy="75"${attr("x", height - 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">frequent</text><text dy="60"${attr("x", 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">← less</text><text dy="75"${attr("x", 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">frequent</text></g></g>`;
  pop();
}
function AxisY($$payload, $$props) {
  push();
  let { height, scale, title } = $$props;
  let logFormat10 = scale.tickFormat();
  let yTicks = scale.ticks();
  const each_array = ensure_array_like(yTicks);
  $$payload.out += `<g class="axis y"${attr("transform", `translate(${stringify(height)}, 0) scale(-1, 1)`)}><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let tick = each_array[index];
    $$payload.out += `<g class="ytick"${attr("transform", `translate(0, ${stringify(scale(tick))})`)}><line x1="0" x2="-6" y1="0" y2="0" stroke="hsla(212, 10%, 53%, 1)"></line></g><g class="tick-text"${attr("transform", `translate(0, ${stringify(scale(tick))}) rotate(45)`)}><text font-size="10" dx="-23" dy="10">${escape_html(logFormat10(tick))}</text></g>`;
  }
  $$payload.out += `<!--]--><g class="ylab svelte-1y8visx" transform="rotate(90)"><text dy="45"${attr("x", height / 2)}>Rank r</text><text dy="63"${attr("x", height / 2)}>for</text><text dy="80"${attr("x", height / 2)}>${escape_html(title[0])}</text><text dy="60"${attr("x", height - 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">more →</text><text dy="75"${attr("x", height - 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">frequent</text><text dy="60"${attr("x", 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">← less</text><text dy="75"${attr("x", 40)} fill="hsla(212, 10%, 53%, 1)" opacity="0.7">frequent</text></g></g>`;
  pop();
}
function Grid($$payload, $$props) {
  push();
  let { scale, height, wxy, ncells } = $$props;
  let xygridLines = scale.ticks(ncells / 2);
  const each_array = ensure_array_like(xygridLines);
  $$payload.out += `<g class="grid"><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let yline = each_array[index];
    $$payload.out += `<g${attr("transform", `translate(${stringify(wxy(yline))}, 0)`)}><line${attr("y1", height)} y2="0" stroke="#d3d3d3" stroke-dasharray="3,3"${attr("opacity", index === 0 ? 0 : 1)}></line></g><g${attr("transform", `translate(0, ${stringify(wxy(yline))})`)}><line${attr("x1", height)} x2="0" stroke="#d3d3d3" stroke-dasharray="3,3"${attr("opacity", index === 0 ? 0 : 1)}></line></g>`;
  }
  $$payload.out += `<!--]--></g>`;
  pop();
}
function Contours($$payload, $$props) {
  push();
  let { alpha, maxlog10, rtd, DiamondInnerHeight } = $$props;
  function alpha_norm_type2(x1, x2, alpha2) {
    if (alpha2 == 0) {
      return Math.abs(Math.log(x1 / x2));
    } else if (alpha2 === Infinity) {
      return x1 === x2 ? 0 : Math.max(x1, x2);
    } else {
      const prefactor = (alpha2 + 1) / alpha2;
      const power = 1 / (alpha2 + 1);
      return prefactor * Math.abs(Math.pow(x1, alpha2) - Math.pow(x2, alpha2)) ** power;
    }
  }
  function make_grid(Ninset, tmpr1, tmpr2, alpha2, rtd2) {
    const deltamatrix = Array.from({ length: Ninset }, () => Array(Ninset).fill(0));
    for (let i = 0; i < Ninset; i++) {
      for (let j = 0; j < Ninset; j++) {
        const divElem = alpha_norm_type2(1 / tmpr1[i], 1 / tmpr2[j], alpha2);
        deltamatrix[i][j] = divElem / rtd2.normalization;
      }
      deltamatrix[i][i] = -1;
      if (i < Ninset - 1) {
        deltamatrix[i][i + 1] = -1;
        deltamatrix[i + 1][i] = -1;
      }
    }
    return deltamatrix;
  }
  function filter_contours(tmpcontours, Ninset, maxlog102) {
    const chart2val = d3.scaleLinear().domain([0, Ninset]).range([0, maxlog102]);
    let out = [];
    tmpcontours.forEach((contour) => {
      contour.coordinates.forEach((pair, i) => {
        const tmpr1 = pair[0].map((d) => d[0]);
        const tmpr2 = pair[0].map((d) => d[1]);
        const filteredPairs = [];
        for (let index = 0; index < tmpr1.length - 1; index++) {
          const x1 = chart2val(tmpr1[index]);
          const x2 = chart2val(tmpr2[index]);
          const tmpxrot = Math.abs(x2 - x1) / Math.sqrt(2);
          if (Math.abs(tmpxrot) >= 0.1 & x1 != maxlog102 & x2 != 0 & x1 != 0 & x2 != maxlog102) {
            filteredPairs.push([x1, x2]);
          }
        }
        if (filteredPairs.length > 0) {
          out.push(filteredPairs);
        }
      });
    });
    return out;
  }
  function get_contours(alpha2, maxlog102, rtd2) {
    const Ninset = 10 ** 3;
    const tmpr1 = d3.range(0, 1e3).map((d) => Math.pow(10, d / 999 * 5));
    const tmpr2 = d3.range(0, 1e3).map((d) => Math.pow(10, d / 999 * 5));
    const Ncontours = 10;
    const scale = d3.scaleLinear().domain([0, Ncontours + 1]).range([1, tmpr1.length]);
    const contour_indices = d3.range(Ncontours + 2).map((i) => Math.round(scale(i)));
    const grid = make_grid(Ninset, tmpr1, tmpr2, alpha2, rtd2);
    const indices = contour_indices.slice(1, -1);
    const lastRow = grid[grid.length - 1];
    const heights = indices.map((index) => lastRow[index]);
    const logTmpr = tmpr1.map(Math.log10);
    const contourGenerator = d3.contours().size([logTmpr.length, logTmpr.length]).thresholds(heights);
    const flatDeltamatrix = grid.flat();
    const tmpcontours = contourGenerator(flatDeltamatrix);
    return filter_contours(tmpcontours, Ninset, maxlog102);
  }
  let mycontours = get_contours(alpha, maxlog10, rtd);
  const x = d3.scaleLinear([0, maxlog10], [0, DiamondInnerHeight]);
  const y = d3.scaleLinear([maxlog10, 0], [DiamondInnerHeight, 0]);
  const pathData = d3.line().x((d, i) => x(d[0])).y((d, i) => y(d[1]));
  const each_array = ensure_array_like(mycontours);
  $$payload.out += `<g class="contours"><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let contour = each_array[index];
    $$payload.out += `<path fill="none" stroke="grey"${attr("d", pathData(contour))} stroke-width="0.9" stroke-opacity="0.9"></path>`;
  }
  $$payload.out += `<!--]--></g>`;
  pop();
}
function Diamond($$payload, $$props) {
  push();
  let {
    diamond_count,
    diamond_dat,
    margin,
    DiamondInnerHeight,
    trueDiamondHeight,
    alpha,
    maxlog10,
    rtd,
    title
  } = $$props;
  function get_relevant_types(diamond_dat2) {
    const ncells2 = 60;
    const bin_size = 1.5;
    const cummulative_bin = d3.range(0, ncells2, bin_size);
    const relevant_types2 = [];
    for (let sys of ["right", "left"]) {
      for (let i = 1; i < cummulative_bin.length; i++) {
        const filtered_dat = diamond_dat2.filter((d) => d.value > 0 && d.which_sys == sys).filter((d) => d.coord_on_diag >= cummulative_bin[i - 1] && d.coord_on_diag < cummulative_bin[i]);
        if (filtered_dat.length > 0) {
          const cos_dists = filtered_dat.map((d) => d.cos_dist);
          const max_dist = cos_dists.reduce((a, b) => {
            return Math.max(a, b);
          });
          const max_dist_idx = cos_dists.indexOf(max_dist);
          const types = filtered_dat[max_dist_idx]["types"].split(",");
          const name = typeof window !== "undefined" ? d3.shuffle(types)[0] : types[0];
          relevant_types2.push(name);
        }
      }
    }
    return relevant_types2;
  }
  function rin(arr1, arr2) {
    return Array.from(arr1, (x) => {
      return arr2.indexOf(x) == -1 ? false : true;
    });
  }
  let relevant_types = get_relevant_types(diamond_dat);
  let max_rank_raw = d3.range(d3.max(diamond_count, (d) => d.x1));
  let max_rank = d3.max(diamond_dat, (d) => d.rank_L[1]);
  let rounded_max_rank = 10 ** Math.ceil(Math.max(Math.log10(max_rank)));
  let ncells = d3.max(max_rank_raw);
  let xyDomain = [1, rounded_max_rank];
  let linScale = d3.scaleLinear().domain([0, ncells - 1]).range([0, DiamondInnerHeight]);
  let wxy = d3.scaleBand().domain(max_rank_raw).range([0, DiamondInnerHeight]);
  let logScale = d3.scaleLog().domain(xyDomain).range([0, DiamondInnerHeight]).nice();
  let xy = d3.scaleBand().domain(max_rank_raw).range([0, trueDiamondHeight]);
  let color_scale = d3.scaleSequentialLog().domain([rounded_max_rank, 1]).interpolator(d3.interpolateInferno);
  let blue_triangle = [
    [DiamondInnerHeight, DiamondInnerHeight],
    [0, 0],
    [0, DiamondInnerHeight]
  ].join(" ");
  let grey_triangle = [
    [DiamondInnerHeight, DiamondInnerHeight],
    [0, 0],
    [DiamondInnerHeight, 0]
  ].join(" ");
  function filter_labs(d, relevant_types2) {
    return rin(relevant_types2, d.types.split(",")).some((x) => x === true);
  }
  const each_array = ensure_array_like(diamond_dat);
  const each_array_1 = ensure_array_like(diamond_dat.filter((d) => filter_labs(d, relevant_types)));
  $$payload.out += `<g class="diamond-chart"${attr("transform", `translate(360, 0) scale (-1,1) rotate(45) translate(${stringify(margin.inner / 2)}, ${stringify(margin.inner / 2)})`)}><polygon${attr("points", blue_triangle)} fill="#89CFF0" fill-opacity="0.2" stroke="black" stroke-width="0.5"></polygon><polygon${attr("points", grey_triangle)} fill="grey" fill-opacity="0.2" stroke="black" stroke-width="0.5"></polygon>`;
  AxisX($$payload, {
    height: DiamondInnerHeight,
    scale: logScale,
    title
  });
  $$payload.out += `<!---->`;
  AxisY($$payload, {
    height: DiamondInnerHeight,
    scale: logScale,
    title
  });
  $$payload.out += `<!---->`;
  Grid($$payload, {
    height: DiamondInnerHeight,
    wxy,
    ncells,
    scale: linScale
  });
  $$payload.out += `<!----><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let d = each_array[$$index];
    $$payload.out += `<rect${attr("x", xy(d.x1))}${attr("y", xy(d.y1))}${attr("width", xy.bandwidth())}${attr("height", xy.bandwidth())}${attr("fill", color_scale(d.value))}${attr("opacity", d.value === null ? 0 : 1)} stroke="black" stroke-width="0.2"></rect>`;
  }
  $$payload.out += `<!--]--><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let d = each_array_1[$$index_1];
    $$payload.out += `<g class="diamond-lab"${attr("transform", `
            scale(1,-1) 
            rotate(-90) 
            rotate(-45, ${stringify(xy(d.x1))}, ${stringify(xy(d.y1))}) 
            translate(${stringify(d.which_sys === "right" ? xy(Math.sqrt(d.cos_dist)) * 1.5 : -xy(Math.sqrt(d.cos_dist)) * 1.5)}, 0)
        `)}><text${attr("x", xy(d.x1))}${attr("y", Number.isInteger(d.coord_on_diag) ? xy(d.y1) : xy(d.y1) - 1)} dy="20" font-size="10"${attr("text-anchor", d.x1 - d.y1 <= 0 ? "start" : "end")}>${escape_html(d.types.split(",")[0])}</text></g>`;
  }
  $$payload.out += `<!--]-->`;
  Contours($$payload, { alpha, maxlog10, rtd, DiamondInnerHeight });
  $$payload.out += `<!----></g>`;
  pop();
}
function Wordshift($$payload, $$props) {
  push();
  let { barData, DashboardHeight, DashboardWidth } = $$props;
  let margin = { top: 80, left: 140, right: 50, bottom: 10 };
  let width = 640;
  let yPadding = 0.2;
  let Y = d3.map(barData, (d) => d.type);
  let max_shift = d3.max(barData, (d) => Math.abs(d.metric)) * 1.5;
  let xDomain = [-max_shift, max_shift];
  let yDomain = new d3.InternSet(Y);
  let xRange = [
    DashboardWidth - width + margin.left,
    DashboardWidth - margin.right
  ];
  let yRange = [margin.top, DashboardHeight - margin.bottom];
  let xScale = d3.scaleLinear().domain(xDomain).range(xRange);
  let yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  let xTicks = xScale.ticks(width / 80);
  const colors = ["lightgrey", "lightblue"];
  const each_array = ensure_array_like(xTicks);
  const each_array_1 = ensure_array_like(barData);
  $$payload.out += `<g class="barChart-container svelte-37sv8o"><g class="axis x"${attr("transform", `translate(0, ${stringify(margin.top)})`)}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tick = each_array[$$index];
    $$payload.out += `<g class="tick"><line${attr("x1", xScale(tick))} y1="0"${attr("x2", xScale(tick))}${attr("y2", DashboardHeight - margin.top - margin.bottom)} stroke="hsla(212, 10%, 53%, 1)" stroke-opacity="0.2">${escape_html(tick)}</line><text${attr("x", xScale(tick))} y="-12" font-size="0.8em">${escape_html(tick * 100)}%</text></g>`;
  }
  $$payload.out += `<!--]--></g><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let d = each_array_1[i];
    $$payload.out += `<rect${attr("x", Math.min(xScale(0), xScale(d.metric)))}${attr("y", yScale(d.type))}${attr("fill", colors[d.metric > 0 ? colors.length - 1 : 0])}${attr("width", Math.abs(xScale(d.metric) - xScale(0)))}${attr("height", yScale.bandwidth())}></rect><text${attr("x", Math.min(xScale(0), xScale(d.metric)))}${attr("y", yScale(d.type))} dy="14" font-size="0.7em">${escape_html(d.type)}</text>`;
  }
  $$payload.out += `<!--]--></g>`;
  pop();
}
function DivergingBarChart($$payload, $$props) {
  push();
  let {
    test_elem_1,
    test_elem_2,
    DiamondHeight,
    DiamondWidth
  } = $$props;
  const setdiff = (x, y) => {
    let a = new Set(x);
    let b = new Set(y);
    return new Set([...a].filter((x2) => !b.has(x2)));
  };
  const union = (x, y) => {
    let a = new Set(x);
    let b = new Set(y);
    return /* @__PURE__ */ new Set([...a, ...b]);
  };
  let types_1 = test_elem_1.map((d) => d.types);
  let types_2 = test_elem_2.map((d) => d.types);
  let union_types = union(types_1, types_2);
  let tot_types = types_1.length + types_2.length;
  let width = 200;
  let margin = { right: 40, top: 30, left: 40, bottom: 10 };
  let yPadding = 0.5;
  let colors = ["lightgrey", "lightblue"];
  let dat = [
    {
      y_coord: "total count",
      frequency: +(types_2.length / tot_types).toFixed(3)
    },
    {
      y_coord: "total count",
      frequency: -(types_1.length / tot_types).toFixed(3)
    },
    {
      y_coord: "all names",
      frequency: +(types_2.length / union_types.size).toFixed(3)
    },
    {
      y_coord: "all names",
      frequency: -(types_1.length / union_types.size).toFixed(3)
    },
    {
      y_coord: "exclusive names",
      frequency: +(setdiff(types_2, types_1).size / types_2.length).toFixed(3)
    },
    {
      y_coord: "exclusive names",
      frequency: -(setdiff(types_1, types_2).size / types_1.length).toFixed(3)
    }
  ];
  let X = dat.map((d) => d.frequency);
  let Y = dat.map((d) => d.y_coord);
  let xRange = [margin.left, width - margin.right];
  let xDomain = extent(X);
  let yDomain = new InternSet(Y);
  let height = Math.ceil((yDomain.size + yPadding) * 25) + margin.top + margin.bottom;
  let I = range(X.length).filter((i) => yDomain.has(Y[i]));
  rollup(I, ([i]) => X[i], (i) => Y[i]);
  let xScale = scaleLinear(xDomain, xRange);
  let yScale = scaleBand().domain(yDomain).range([margin.top, height - margin.bottom]).padding(yPadding);
  let format = xScale.tickFormat(100, "%");
  const each_array = ensure_array_like(dat);
  const each_array_1 = ensure_array_like(yScale.domain());
  $$payload.out += `<g class="balance-chart"${attr("transform", `translate(${stringify(DiamondWidth - 75)}, ${stringify(DiamondHeight + 75)})`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let d = each_array[i];
    $$payload.out += `<rect${attr("x", Math.min(xScale(0), xScale(d.frequency)))}${attr("y", yScale(d.y_coord))}${attr("fill", colors[X[i] > 0 ? colors.length - 1 : 0])}${attr("width", Math.abs(xScale(d.frequency) - xScale(0)))}${attr("height", yScale.bandwidth())}></rect><text${attr("x", xScale(X[i]) + Math.sign(X[i] - 0) * 4)}${attr("y", yScale(Y[i]) + yScale.bandwidth() / 2)} opacity="0.5" dy="0.35em" font-size="10"${attr("text-anchor", d.frequency < 0 ? "end" : "start")}>${escape_html(format(Math.abs(d.frequency)))}</text>`;
  }
  $$payload.out += `<!--]--><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let text = each_array_1[i];
    $$payload.out += `<g class="diverging-ticks"><text${attr("x", xScale(0))}${attr("y", yScale(text) + yScale.bandwidth() / 2)} dy="-.9em" dx="-3em" font-size="10">${escape_html(text)}</text></g>`;
  }
  $$payload.out += `<!--]--></g>`;
  pop();
}
function Legend($$payload, $$props) {
  push();
  let { diamond_dat, DiamondHeight } = $$props;
  const N_CATEGO = 20;
  const myramp = range(N_CATEGO).map((i) => rgb(interpolateInferno(i / (N_CATEGO - 1))).hex());
  const color = scaleOrdinal(range(N_CATEGO), myramp);
  let height = 370;
  const margin = { right: 40, top: 65, left: 10 };
  let innerHeight = height - margin.top - margin.right;
  let max_rank = max(diamond_dat, (d) => d.rank_L[1]);
  let y = scaleBand().domain(color.domain().reverse()).rangeRound([0, innerHeight]);
  let logY = scaleLog().domain([
    1,
    10 ** Math.ceil(Math.max(Math.log10(max_rank)) - 1)
  ]).rangeRound([0, innerHeight]).nice();
  let logFormat10 = logY.tickFormat();
  let yTicks = logY.ticks();
  const each_array = ensure_array_like(color.domain());
  const each_array_1 = ensure_array_like(yTicks);
  $$payload.out += `<g class="legend-container"${attr("transform", `translate(${stringify(margin.left)}, ${stringify(DiamondHeight - margin.top)})`)}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let d = each_array[$$index];
    $$payload.out += `<rect${attr("x", 0)}${attr("y", y(d))}${attr("width", 14)}${attr("height", 13)}${attr("fill", color(d))} stroke="whitesmoke" stroke-width="1"></rect>`;
  }
  $$payload.out += `<!--]--></g><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let tick = each_array_1[i];
    $$payload.out += `<g class="legend-text"${attr("transform", `translate(${stringify(margin.left)}, ${stringify(DiamondHeight + logY(tick) - margin.top)})`)}><text font-size="10"${attr("dy", yTicks.length - 1 == i ? "-3" : "13")} dx="20">${escape_html(logFormat10(tick))}</text></g>`;
    if (i === yTicks.length - 1) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<g class="legend-title"${attr("transform", `translate(${stringify(margin.left)}, ${stringify(DiamondHeight + logY(tick) - margin.top)})`)}><text font-size="13" dy="9">Counts per cell</text></g>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Dashboard($$payload, $$props) {
  let {
    diamond_count = [],
    diamond_dat = [],
    barData = [],
    test_elem_1 = null,
    test_elem_2 = null,
    height = 815,
    width = 1200,
    DiamondHeight = 600,
    DiamondWidth = 600,
    DiamondInnerHeight = 440,
    margin = { inner: 160, diamond: 40 },
    trueDiamondHeight = 400,
    alpha = 0.58,
    maxlog10 = 0,
    rtd = null,
    title = ["System 1", "System 2"]
  } = $$props;
  $$payload.out += `<svg${attr("width", width)}${attr("height", height)} xmlns="http://www.w3.org/2000/svg">`;
  Diamond($$payload, {
    diamond_count,
    diamond_dat,
    DiamondInnerHeight,
    margin,
    trueDiamondHeight,
    alpha,
    maxlog10,
    rtd,
    title
  });
  $$payload.out += `<!---->`;
  Wordshift($$payload, {
    barData,
    DashboardHeight: height,
    DashboardWidth: width
  });
  $$payload.out += `<!---->`;
  DivergingBarChart($$payload, {
    test_elem_1,
    test_elem_2,
    DiamondHeight,
    DiamondWidth
  });
  $$payload.out += `<!---->`;
  Legend($$payload, { diamond_dat, DiamondHeight });
  $$payload.out += `<!----></svg>`;
}
function renderDashboard(props) {
  const result = render(Dashboard, { props });
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Allotaxonometer Dashboard</title>
</head>
<body>
  ${result.body}
</body>
</html>`;
}
export {
  renderDashboard
};
