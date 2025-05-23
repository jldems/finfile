import {
  r as requestAnimFrame,
  a as resolve,
  e as effects,
  c as color,
  i as isObject,
  d as defaults,
  b as isArray,
  v as valueOrDefault,
  u as unlistenArrayEvents,
  l as listenArrayEvents,
  f as resolveObjectKey,
  g as isNumberFinite,
  h as defined,
  s as sign,
  j as createContext,
  k as isNullOrUndef,
  _ as _arrayUnique,
  t as toRadians,
  m as toPercentage,
  n as toDimension,
  T as TAU,
  o as formatNumber,
  p as _angleBetween,
  H as HALF_PI,
  P as PI,
  q as _getStartAndCountOfVisiblePoints,
  w as _scaleRangesChanged,
  x as isNumber,
  y as _parseObjectDataRadialScale,
  z as getRelativePosition,
  A as _rlookupByKey,
  B as _lookupByKey,
  C as _isPointInArea,
  D as getAngleFromPoint,
  E as toPadding,
  F as each,
  G as getMaximumSize,
  I as _getParentNode,
  J as readUsedSize,
  K as supportsEventListenerOptions,
  L as throttled,
  M as _isDomSupported,
  N as _factorize,
  O as finiteOrDefault,
  Q as callback,
  R as _addGrace,
  S as _limitValue,
  U as toDegrees,
  V as _measureText,
  W as _int16Range,
  X as _alignPixel,
  Y as clipArea,
  Z as renderText,
  $ as unclipArea,
  a0 as toFont,
  a1 as _toLeftRightCenter,
  a2 as _alignStartEnd,
  a3 as overrides,
  a4 as merge,
  a5 as _capitalize,
  a6 as descriptors,
  a7 as isFunction,
  a8 as _attachContext,
  a9 as _createResolver,
  aa as _descriptors,
  ab as mergeIf,
  ac as uid,
  ad as debounce,
  ae as retinaScale,
  af as clearCanvas,
  ag as setsEqual,
  ah as _elementsEqual,
  ai as _isClickEvent,
  aj as _isBetween,
  ak as _readValueToProps,
  al as _updateBezierControlPoints,
  am as _computeSegments,
  an as _boundSegments,
  ao as _steppedInterpolation,
  ap as _bezierInterpolation,
  aq as _pointInLine,
  ar as _steppedLineTo,
  as as _bezierCurveTo,
  at as drawPoint,
  au as addRoundedRectPath,
  av as toTRBL,
  aw as toTRBLCorners,
  ax as _boundSegment,
  ay as _normalizeAngle,
  az as getRtlAdapter,
  aA as overrideTextDirection,
  aB as _textX,
  aC as restoreTextDirection,
  aD as drawPointLegend,
  aE as distanceBetweenPoints,
  aF as noop,
  aG as _setMinAndMaxByKey,
  aH as niceNum,
  aI as almostWhole,
  aJ as almostEquals,
  aK as _decimalPlaces,
  aL as Ticks,
  aM as log10,
  aN as _longestText,
  aO as _filterBetween,
  aP as _lookup,
} from "./chunks/helpers.segment.js";
import "@kurkle/color";
class Animator {
  constructor() {
    (this._request = null),
      (this._charts = new Map()),
      (this._running = !1),
      (this._lastDate = void 0);
  }
  _notify(e, i, a, t) {
    const s = i.listeners[t],
      n = i.duration;
    s.forEach((t) =>
      t({
        chart: e,
        initial: i.initial,
        numSteps: n,
        currentStep: Math.min(a - i.start, n),
      })
    );
  }
  _refresh() {
    this._request ||
      ((this._running = !0),
      (this._request = requestAnimFrame.call(window, () => {
        this._update(),
          (this._request = null),
          this._running && this._refresh();
      })));
  }
  _update(r = Date.now()) {
    let o = 0;
    this._charts.forEach((a, s) => {
      if (a.running && a.items.length) {
        const n = a.items;
        let t = n.length - 1,
          e = !1,
          i;
        for (; 0 <= t; --t)
          (i = n[t])._active
            ? (i._total > a.duration && (a.duration = i._total),
              i.tick(r),
              (e = !0))
            : ((n[t] = n[n.length - 1]), n.pop());
        e && (s.draw(), this._notify(s, a, r, "progress")),
          n.length ||
            ((a.running = !1),
            this._notify(s, a, r, "complete"),
            (a.initial = !1)),
          (o += n.length);
      }
    }),
      (this._lastDate = r),
      0 === o && (this._running = !1);
  }
  _getAnims(t) {
    const e = this._charts;
    let i = e.get(t);
    return (
      i ||
        ((i = {
          running: !1,
          initial: !0,
          items: [],
          listeners: { complete: [], progress: [] },
        }),
        e.set(t, i)),
      i
    );
  }
  listen(t, e, i) {
    this._getAnims(t).listeners[e].push(i);
  }
  add(t, e) {
    e && e.length && this._getAnims(t).items.push(...e);
  }
  has(t) {
    return 0 < this._getAnims(t).items.length;
  }
  start(t) {
    const e = this._charts.get(t);
    e &&
      ((e.running = !0),
      (e.start = Date.now()),
      (e.duration = e.items.reduce((t, e) => Math.max(t, e._duration), 0)),
      this._refresh());
  }
  running(t) {
    if (!this._running) return !1;
    t = this._charts.get(t);
    return !!(t && t.running && t.items.length);
  }
  stop(e) {
    const i = this._charts.get(e);
    if (i && i.items.length) {
      const a = i.items;
      let t = a.length - 1;
      for (; 0 <= t; --t) a[t].cancel();
      (i.items = []), this._notify(e, i, Date.now(), "complete");
    }
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var animator = new Animator();
const transparent = "transparent",
  interpolators = {
    boolean(t, e, i) {
      return 0.5 < i ? e : t;
    },
    color(t, e, i) {
      t = color(t || transparent);
      const a = t.valid && color(e || transparent);
      return a && a.valid ? a.mix(t, i).hexString() : e;
    },
    number(t, e, i) {
      return t + (e - t) * i;
    },
  };
class Animation {
  constructor(t, e, i, a) {
    var s = e[i],
      s = ((a = resolve([t.to, a, s, t.from])), resolve([t.from, s, a]));
    (this._active = !0),
      (this._fn = t.fn || interpolators[t.type || typeof s]),
      (this._easing = effects[t.easing] || effects.linear),
      (this._start = Math.floor(Date.now() + (t.delay || 0))),
      (this._duration = this._total = Math.floor(t.duration)),
      (this._loop = !!t.loop),
      (this._target = e),
      (this._prop = i),
      (this._from = s),
      (this._to = a),
      (this._promises = void 0);
  }
  active() {
    return this._active;
  }
  update(t, e, i) {
    var a, s, n;
    this._active &&
      (this._notify(!1),
      (a = this._target[this._prop]),
      (s = i - this._start),
      (n = this._duration - s),
      (this._start = i),
      (this._duration = Math.floor(Math.max(n, t.duration))),
      (this._total += s),
      (this._loop = !!t.loop),
      (this._to = resolve([t.to, e, a, t.from])),
      (this._from = resolve([t.from, a, e])));
  }
  cancel() {
    this._active &&
      (this.tick(Date.now()), (this._active = !1), this._notify(!1));
  }
  tick(t) {
    var t = t - this._start,
      e = this._duration,
      i = this._prop,
      a = this._from,
      s = this._loop,
      n = this._to;
    let r;
    if (((this._active = a !== n && (s || t < e)), !this._active))
      return (this._target[i] = n), void this._notify(!0);
    t < 0
      ? (this._target[i] = a)
      : ((r = (t / e) % 2),
        (r = s && 1 < r ? 2 - r : r),
        (r = this._easing(Math.min(1, Math.max(0, r)))),
        (this._target[i] = this._fn(a, n, r)));
  }
  wait() {
    const i = this._promises || (this._promises = []);
    return new Promise((t, e) => {
      i.push({ res: t, rej: e });
    });
  }
  _notify(t) {
    var e = t ? "res" : "rej";
    const i = this._promises || [];
    for (let t = 0; t < i.length; t++) i[t][e]();
  }
}
class Animations {
  constructor(t, e) {
    (this._chart = t), (this._properties = new Map()), this.configure(e);
  }
  configure(s) {
    if (isObject(s)) {
      const n = Object.keys(defaults.animation),
        r = this._properties;
      Object.getOwnPropertyNames(s).forEach((e) => {
        const t = s[e];
        if (isObject(t)) {
          const i = {};
          for (const a of n) i[a] = t[a];
          ((isArray(t.properties) && t.properties) || [e]).forEach((t) => {
            (t !== e && r.has(t)) || r.set(t, i);
          });
        }
      });
    }
  }
  _animateOptions(t, e) {
    const i = e.options;
    e = resolveTargetOptions(t, i);
    if (!e) return [];
    e = this._createAnimations(e, i);
    return (
      i.$shared &&
        awaitAll(t.options.$animations, i).then(
          () => {
            t.options = i;
          },
          () => {}
        ),
      e
    );
  }
  _createAnimations(e, i) {
    const a = this._properties,
      s = [],
      n = e.$animations || (e.$animations = {});
    var t = Object.keys(i),
      r = Date.now();
    let o;
    for (o = t.length - 1; 0 <= o; --o) {
      const d = t[o];
      if ("$" !== d.charAt(0))
        if ("options" === d) s.push(...this._animateOptions(e, i));
        else {
          var l = i[d];
          let t = n[d];
          var h = a.get(d);
          if (t) {
            if (h && t.active()) {
              t.update(h, l, r);
              continue;
            }
            t.cancel();
          }
          h && h.duration
            ? ((n[d] = t = new Animation(h, e, d, l)), s.push(t))
            : (e[d] = l);
        }
    }
    return s;
  }
  update(t, e) {
    {
      if (0 !== this._properties.size)
        return (t = this._createAnimations(t, e)).length
          ? (animator.add(this._chart, t), !0)
          : void 0;
      Object.assign(t, e);
    }
  }
}
function awaitAll(e, t) {
  const i = [];
  var a = Object.keys(t);
  for (let t = 0; t < a.length; t++) {
    const s = e[a[t]];
    s && s.active() && i.push(s.wait());
  }
  return Promise.all(i);
}
function resolveTargetOptions(e, i) {
  if (i) {
    let t = e.options;
    if (t)
      return (
        t.$shared &&
          (e.options = t =
            Object.assign({}, t, { $shared: !1, $animations: {} })),
        t
      );
    e.options = i;
  }
}
function scaleClip(t, e) {
  var t = (t && t.options) || {},
    i = t.reverse,
    a = void 0 === t.min ? e : 0,
    t = void 0 === t.max ? e : 0;
  return { start: i ? t : a, end: i ? a : t };
}
function defaultClip(t, e, i) {
  if (!1 === i) return !1;
  (t = scaleClip(t, i)), (e = scaleClip(e, i));
  return { top: e.end, right: t.end, bottom: e.start, left: t.start };
}
function toClip(t) {
  let e, i, a, s;
  return (
    isObject(t)
      ? ((e = t.top), (i = t.right), (a = t.bottom), (s = t.left))
      : (e = i = a = s = t),
    { top: e, right: i, bottom: a, left: s, disabled: !1 === t }
  );
}
function getSortedDatasetIndices(t, e) {
  const i = [];
  var a = t._getSortedDatasetMetas(e);
  let s, n;
  for (s = 0, n = a.length; s < n; ++s) i.push(a[s].index);
  return i;
}
function applyStack(t, e, i, a = {}) {
  var s = t.keys,
    n = "single" === a.mode;
  let r, o, l, h;
  if (null !== e) {
    for (r = 0, o = s.length; r < o; ++r) {
      if ((l = +s[r]) === i) {
        if (a.all) continue;
        break;
      }
      (h = t.values[l]),
        isNumberFinite(h) && (n || 0 === e || sign(e) === sign(h)) && (e += h);
    }
    return e;
  }
}
function convertObjectDataToArray(t) {
  var e = Object.keys(t);
  const i = new Array(e.length);
  let a, s, n;
  for (a = 0, s = e.length; a < s; ++a) (n = e[a]), (i[a] = { x: n, y: t[n] });
  return i;
}
function isStacked(t, e) {
  t = t && t.options.stacked;
  return t || (void 0 === t && void 0 !== e.stack);
}
function getStackKey(t, e, i) {
  return `${t.id}.${e.id}.` + (i.stack || i.type);
}
function getUserBounds(t) {
  var { min: t, max: e, minDefined: i, maxDefined: a } = t.getUserBounds();
  return {
    min: i ? t : Number.NEGATIVE_INFINITY,
    max: a ? e : Number.POSITIVE_INFINITY,
  };
}
function getOrCreateStack(t, e, i) {
  const a = t[e] || (t[e] = {});
  return a[i] || (a[i] = {});
}
function getLastIndexInStack(t, e, i, a) {
  for (const n of e.getMatchingVisibleMetas(a).reverse()) {
    var s = t[n.index];
    if ((i && 0 < s) || (!i && s < 0)) return n.index;
  }
  return null;
}
function updateStacks(t, e) {
  const { chart: i, _cachedMeta: a } = t;
  var s = i._stacks || (i._stacks = {}),
    { iScale: t, vScale: n, index: r } = a,
    o = t.axis,
    l = n.axis,
    h = getStackKey(t, n, a),
    d = e.length;
  let c;
  for (let t = 0; t < d; ++t) {
    const p = e[t];
    var { [o]: u, [l]: g } = p;
    const f = p._stacks || (p._stacks = {}),
      m =
        (((c = f[l] = getOrCreateStack(s, h, u))[r] = g),
        (c._top = getLastIndexInStack(c, n, !0, a.type)),
        (c._bottom = getLastIndexInStack(c, n, !1, a.type)),
        c._visualValues || (c._visualValues = {}));
    m[r] = g;
  }
}
function getFirstScaleId(t, e) {
  const i = t.scales;
  return Object.keys(i)
    .filter((t) => i[t].axis === e)
    .shift();
}
function createDatasetContext(t, e) {
  return createContext(t, {
    active: !1,
    dataset: void 0,
    datasetIndex: e,
    index: e,
    mode: "default",
    type: "dataset",
  });
}
function createDataContext(t, e, i) {
  return createContext(t, {
    active: !1,
    dataIndex: e,
    parsed: void 0,
    raw: void 0,
    element: i,
    index: e,
    mode: "default",
    type: "data",
  });
}
function clearStacks(t, e) {
  var i = t.controller.index,
    a = t.vScale && t.vScale.axis;
  if (a)
    for (const s of (e = e || t._parsed)) {
      const n = s._stacks;
      if (!n || void 0 === n[a] || void 0 === n[a][i]) return;
      delete n[a][i],
        void 0 !== n[a]._visualValues &&
          void 0 !== n[a]._visualValues[i] &&
          delete n[a]._visualValues[i];
    }
}
const isDirectUpdateMode = (t) => "reset" === t || "none" === t,
  cloneIfNotShared = (t, e) => (e ? t : Object.assign({}, t)),
  createStack = (t, e, i) =>
    t &&
    !e.hidden &&
    e._stacked && { keys: getSortedDatasetIndices(i, !0), values: null };
class DatasetController {
  static defaults = {};
  static datasetElementType = null;
  static dataElementType = null;
  constructor(t, e) {
    (this.chart = t),
      (this._ctx = t.ctx),
      (this.index = e),
      (this._cachedDataOpts = {}),
      (this._cachedMeta = this.getMeta()),
      (this._type = this._cachedMeta.type),
      (this.options = void 0),
      (this._parsing = !1),
      (this._data = void 0),
      (this._objectData = void 0),
      (this._sharedOptions = void 0),
      (this._drawStart = void 0),
      (this._drawCount = void 0),
      (this.enableOptionSharing = !1),
      (this.supportsDecimation = !1),
      (this.$context = void 0),
      (this._syncList = []),
      (this.datasetElementType = new.target.datasetElementType),
      (this.dataElementType = new.target.dataElementType),
      this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(),
      this.linkScales(),
      (t._stacked = isStacked(t.vScale, t)),
      this.addElements(),
      this.options.fill &&
        !this.chart.isPluginEnabled("filler") &&
        console.warn(
          "Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options"
        );
  }
  updateIndex(t) {
    this.index !== t && clearStacks(this._cachedMeta), (this.index = t);
  }
  linkScales() {
    var t = this.chart;
    const e = this._cachedMeta;
    var i = this.getDataset(),
      a = (t, e, i, a) => ("x" === t ? e : "r" === t ? a : i),
      s = (e.xAxisID = valueOrDefault(i.xAxisID, getFirstScaleId(t, "x"))),
      n = (e.yAxisID = valueOrDefault(i.yAxisID, getFirstScaleId(t, "y"))),
      i = (e.rAxisID = valueOrDefault(i.rAxisID, getFirstScaleId(t, "r"))),
      t = e.indexAxis,
      r = (e.iAxisID = a(t, s, n, i)),
      a = (e.vAxisID = a(t, n, s, i));
    (e.xScale = this.getScaleForId(s)),
      (e.yScale = this.getScaleForId(n)),
      (e.rScale = this.getScaleForId(i)),
      (e.iScale = this.getScaleForId(r)),
      (e.vScale = this.getScaleForId(a));
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    var e = this._cachedMeta;
    return t === e.iScale ? e.vScale : e.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    var t = this._cachedMeta;
    this._data && unlistenArrayEvents(this._data, this),
      t._stacked && clearStacks(t);
  }
  _dataCheck() {
    const t = this.getDataset();
    var e = t.data || (t.data = []),
      i = this._data;
    if (isObject(e)) this._data = convertObjectDataToArray(e);
    else if (i !== e) {
      if (i) {
        unlistenArrayEvents(i, this);
        const a = this._cachedMeta;
        clearStacks(a), (a._parsed = []);
      }
      e && Object.isExtensible(e) && listenArrayEvents(e, this),
        (this._syncList = []),
        (this._data = e);
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(),
      this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta;
    var i = this.getDataset();
    let a = !1;
    this._dataCheck();
    var s = e._stacked;
    (e._stacked = isStacked(e.vScale, e)),
      e.stack !== i.stack && ((a = !0), clearStacks(e), (e.stack = i.stack)),
      this._resyncElements(t),
      (!a && s === e._stacked) || updateStacks(this, e._parsed);
  }
  configure() {
    const t = this.chart.config;
    var e = t.datasetScopeKeys(this._type),
      e = t.getOptionScopes(this.getDataset(), e, !0);
    (this.options = t.createResolver(e, this.getContext())),
      (this._parsing = this.options.parsing),
      (this._cachedDataOpts = {});
  }
  parse(t, e) {
    const { _cachedMeta: i, _data: a } = this;
    var { iScale: s, _stacked: n } = i;
    const r = s.axis;
    let o = (0 === t && e === a.length) || i._sorted,
      l = 0 < t && i._parsed[t - 1],
      h,
      d,
      c;
    if (!1 === this._parsing) (i._parsed = a), (i._sorted = !0), (c = a);
    else {
      c = isArray(a[t])
        ? this.parseArrayData(i, a, t, e)
        : isObject(a[t])
        ? this.parseObjectData(i, a, t, e)
        : this.parsePrimitiveData(i, a, t, e);
      for (h = 0; h < e; ++h)
        (i._parsed[h + t] = d = c[h]),
          o && ((null === d[r] || (l && d[r] < l[r])) && (o = !1), (l = d));
      i._sorted = o;
    }
    n && updateStacks(this, c);
  }
  parsePrimitiveData(t, e, i, a) {
    const { iScale: s, vScale: n } = t;
    var r = s.axis,
      o = n.axis,
      l = s.getLabels(),
      h = s === n;
    const d = new Array(a);
    let c, u, g;
    for (c = 0, u = a; c < u; ++c)
      (g = c + i),
        (d[c] = { [r]: h || s.parse(l[g], g), [o]: n.parse(e[g], g) });
    return d;
  }
  parseArrayData(t, e, i, a) {
    const { xScale: s, yScale: n } = t,
      r = new Array(a);
    let o, l, h, d;
    for (o = 0, l = a; o < l; ++o)
      (d = e[(h = o + i)]),
        (r[o] = { x: s.parse(d[0], h), y: n.parse(d[1], h) });
    return r;
  }
  parseObjectData(t, e, i, a) {
    const { xScale: s, yScale: n } = t;
    var { xAxisKey: r = "x", yAxisKey: o = "y" } = this._parsing;
    const l = new Array(a);
    let h, d, c, u;
    for (h = 0, d = a; h < d; ++h)
      (u = e[(c = h + i)]),
        (l[h] = {
          x: s.parse(resolveObjectKey(u, r), c),
          y: n.parse(resolveObjectKey(u, o), c),
        });
    return l;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, e, i) {
    var a = this.chart,
      s = this._cachedMeta,
      n = e[t.axis];
    return applyStack(
      {
        keys: getSortedDatasetIndices(a, !0),
        values: e._stacks[t.axis]._visualValues,
      },
      n,
      s.index,
      { mode: i }
    );
  }
  updateRangeFromParsed(t, e, i, a) {
    var s = i[e.axis];
    let n = null === s ? NaN : s;
    i = a && i._stacks[e.axis];
    a && i && ((a.values = i), (n = applyStack(a, s, this._cachedMeta.index))),
      (t.min = Math.min(t.min, n)),
      (t.max = Math.max(t.max, n));
  }
  getMinMax(e, t) {
    var i = this._cachedMeta;
    const a = i._parsed;
    var s = i._sorted && e === i.iScale,
      n = a.length;
    const r = this._getOtherScale(e);
    var o = createStack(t, i, this.chart),
      l = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    const { min: h, max: d } = getUserBounds(r);
    let c, u;
    function g() {
      var t = (u = a[c])[r.axis];
      return !isNumberFinite(u[e.axis]) || h > t || d < t;
    }
    for (
      c = 0;
      c < n && (g() || (this.updateRangeFromParsed(l, e, u, o), !s));
      ++c
    );
    if (s)
      for (c = n - 1; 0 <= c; --c)
        if (!g()) {
          this.updateRangeFromParsed(l, e, u, o);
          break;
        }
    return l;
  }
  getAllParsedValues(t) {
    var e = this._cachedMeta._parsed;
    const i = [];
    let a, s, n;
    for (a = 0, s = e.length; a < s; ++a)
      (n = e[a][t.axis]), isNumberFinite(n) && i.push(n);
    return i;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    var e = this._cachedMeta;
    const i = e.iScale,
      a = e.vScale;
    e = this.getParsed(t);
    return {
      label: i ? "" + i.getLabelForValue(e[i.axis]) : "",
      value: a ? "" + a.getLabelForValue(e[a.axis]) : "",
    };
  }
  _update(t) {
    const e = this._cachedMeta;
    this.update(t || "default"),
      (e._clip = toClip(
        valueOrDefault(
          this.options.clip,
          defaultClip(e.xScale, e.yScale, this.getMaxOverflow())
        )
      ));
  }
  update(t) {}
  draw() {
    var t = this._ctx,
      e = this.chart;
    const i = this._cachedMeta;
    var a = i.data || [],
      s = e.chartArea;
    const n = [];
    var r = this._drawStart || 0,
      o = this._drawCount || a.length - r,
      l = this.options.drawActiveElementsOnTop;
    let h;
    for (i.dataset && i.dataset.draw(t, s, r, o), h = r; h < r + o; ++h) {
      const d = a[h];
      d.hidden || (d.active && l ? n.push(d) : d.draw(t, s));
    }
    for (h = 0; h < n.length; ++h) n[h].draw(t, s);
  }
  getStyle(t, e) {
    e = e ? "active" : "default";
    return void 0 === t && this._cachedMeta.dataset
      ? this.resolveDatasetElementOptions(e)
      : this.resolveDataElementOptions(t || 0, e);
  }
  getContext(t, e, i) {
    var a = this.getDataset();
    let s;
    if (0 <= t && t < this._cachedMeta.data.length) {
      const n = this._cachedMeta.data[t];
      ((s =
        n.$context ||
        (n.$context = createDataContext(this.getContext(), t, n))).parsed =
        this.getParsed(t)),
        (s.raw = a.data[t]),
        (s.index = s.dataIndex = t);
    } else
      ((s =
        this.$context ||
        (this.$context = createDatasetContext(
          this.chart.getContext(),
          this.index
        ))).dataset = a),
        (s.index = s.datasetIndex = this.index);
    return (s.active = !!e), (s.mode = i), s;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", i) {
    const a = "active" === e,
      s = this._cachedDataOpts;
    var n = t + "-" + e,
      r = s[n],
      o = this.enableOptionSharing && defined(i);
    if (r) return cloneIfNotShared(r, o);
    const l = this.chart.config;
    var r = l.datasetElementScopeKeys(this._type, t),
      h = a ? [t + "Hover", "hover", t, ""] : [t, ""],
      r = l.getOptionScopes(this.getDataset(), r),
      t = Object.keys(defaults.elements[t]);
    const d = l.resolveNamedOptions(r, t, () => this.getContext(i, a, e), h);
    return (
      d.$shared &&
        ((d.$shared = o), (s[n] = Object.freeze(cloneIfNotShared(d, o)))),
      d
    );
  }
  _resolveAnimations(t, e, i) {
    var a = this.chart;
    const s = this._cachedDataOpts;
    var n = "animation-" + e,
      r = s[n];
    if (r) return r;
    let o;
    if (!1 !== a.options.animation) {
      const l = this.chart.config;
      (r = l.datasetAnimationScopeKeys(this._type, e)),
        (r = l.getOptionScopes(this.getDataset(), r));
      o = l.createResolver(r, this.getContext(t, i, e));
    }
    r = new Animations(a, o && o.animations);
    return o && o._cacheable && (s[n] = Object.freeze(r)), r;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return (
        this._sharedOptions || (this._sharedOptions = Object.assign({}, t))
      );
  }
  includeOptions(t, e) {
    return !e || isDirectUpdateMode(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    var t = this.resolveDataElementOptions(t, e),
      i = this._sharedOptions,
      a = this.getSharedOptions(t),
      i = this.includeOptions(e, a) || a !== i;
    return (
      this.updateSharedOptions(a, e, t), { sharedOptions: a, includeOptions: i }
    );
  }
  updateElement(t, e, i, a) {
    isDirectUpdateMode(a)
      ? Object.assign(t, i)
      : this._resolveAnimations(e, a).update(t, i);
  }
  updateSharedOptions(t, e, i) {
    t &&
      !isDirectUpdateMode(e) &&
      this._resolveAnimations(void 0, e).update(t, i);
  }
  _setStyle(t, e, i, a) {
    t.active = a;
    var s = this.getStyle(e, a);
    this._resolveAnimations(e, i, a).update(t, {
      options: (!a && this.getSharedOptions(s)) || s,
    });
  }
  removeHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !1);
  }
  setHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !0);
  }
  _removeDatasetHoverStyle() {
    var t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    var t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    var e,
      i,
      a,
      s = this._data,
      n = this._cachedMeta.data;
    for ([e, i, a] of this._syncList) this[e](i, a);
    this._syncList = [];
    var n = n.length,
      s = s.length,
      r = Math.min(s, n);
    r && this.parse(0, r),
      n < s
        ? this._insertElements(n, s - n, t)
        : s < n && this._removeElements(s, n - s);
  }
  _insertElements(t, e, i = !0) {
    var a = this._cachedMeta;
    const s = a.data,
      n = t + e;
    let r;
    var o = (t) => {
      for (t.length += e, r = t.length - 1; r >= n; r--) t[r] = t[r - e];
    };
    for (o(s), r = t; r < n; ++r) s[r] = new this.dataElementType();
    this._parsing && o(a._parsed),
      this.parse(t, e),
      i && this.updateElements(s, t, e, "reset");
  }
  updateElements(t, e, i, a) {}
  _removeElements(t, e) {
    const i = this._cachedMeta;
    var a;
    this._parsing &&
      ((a = i._parsed.splice(t, e)), i._stacked && clearStacks(i, a)),
      i.data.splice(t, e);
  }
  _sync(t) {
    var e, i, a;
    this._parsing ? this._syncList.push(t) : (([e, i, a] = t), this[e](i, a)),
      this.chart._dataChanges.push([this.index, ...t]);
  }
  _onDataPush() {
    var t = arguments.length;
    this._sync(["_insertElements", this.getDataset().data.length - t, t]);
  }
  _onDataPop() {
    this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
  }
  _onDataShift() {
    this._sync(["_removeElements", 0, 1]);
  }
  _onDataSplice(t, e) {
    e && this._sync(["_removeElements", t, e]);
    var i = arguments.length - 2;
    i && this._sync(["_insertElements", t, i]);
  }
  _onDataUnshift() {
    this._sync(["_insertElements", 0, arguments.length]);
  }
}
function getAllScaleValues(a, t) {
  if (!a._cache.$bar) {
    const s = a.getMatchingVisibleMetas(t);
    let i = [];
    for (let t = 0, e = s.length; t < e; t++)
      i = i.concat(s[t].controller.getAllParsedValues(a));
    a._cache.$bar = _arrayUnique(i.sort((t, e) => t - e));
  }
  return a._cache.$bar;
}
function computeMinSampleSize(t) {
  const e = t.iScale;
  var i = getAllScaleValues(e, t.type);
  let a = e._length,
    s,
    n,
    r,
    o;
  var l = () => {
    32767 !== r &&
      -32768 !== r &&
      (defined(o) && (a = Math.min(a, Math.abs(r - o) || a)), (o = r));
  };
  for (s = 0, n = i.length; s < n; ++s) (r = e.getPixelForValue(i[s])), l();
  for (o = void 0, s = 0, n = e.ticks.length; s < n; ++s)
    (r = e.getPixelForTick(s)), l();
  return a;
}
function computeFitCategoryTraits(t, e, i, a) {
  var s = i.barThickness;
  let n, r;
  return (
    (r = isNullOrUndef(s)
      ? ((n = e.min * i.categoryPercentage), i.barPercentage)
      : ((n = s * a), 1)),
    { chunk: n / a, ratio: r, start: e.pixels[t] - n / 2 }
  );
}
function computeFlexCategoryTraits(t, e, i, a) {
  var s = e.pixels,
    n = s[t];
  let r = 0 < t ? s[t - 1] : null,
    o = t < s.length - 1 ? s[t + 1] : null;
  (s = i.categoryPercentage),
    null === r && (r = n - (null === o ? e.end - e.start : o - n)),
    null === o && (o = n + n - r),
    (t = n - ((n - Math.min(r, o)) / 2) * s);
  return {
    chunk: ((Math.abs(o - r) / 2) * s) / a,
    ratio: i.barPercentage,
    start: t,
  };
}
function parseFloatBar(t, e, i, a) {
  var s = i.parse(t[0], a),
    t = i.parse(t[1], a),
    a = Math.min(s, t),
    n = Math.max(s, t);
  let r = a,
    o = n;
  Math.abs(a) > Math.abs(n) && ((r = n), (o = a)),
    (e[i.axis] = o),
    (e._custom = { barStart: r, barEnd: o, start: s, end: t, min: a, max: n });
}
function parseValue(t, e, i, a) {
  return (
    isArray(t) ? parseFloatBar(t, e, i, a) : (e[i.axis] = i.parse(t, a)), e
  );
}
function parseArrayOrPrimitive(t, e, i, a) {
  const s = t.iScale;
  var n = t.vScale,
    r = s.getLabels(),
    o = s === n;
  const l = [];
  let h, d, c, u;
  for (d = (h = i) + a; h < d; ++h)
    (u = e[h]),
      ((c = {})[s.axis] = o || s.parse(r[h], h)),
      l.push(parseValue(u, c, n, h));
  return l;
}
function isFloatBar(t) {
  return t && void 0 !== t.barStart && void 0 !== t.barEnd;
}
function barSign(t, e, i) {
  return 0 !== t
    ? sign(t)
    : (e.isHorizontal() ? 1 : -1) * (e.min >= i ? 1 : -1);
}
function borderProps(t) {
  let e, i, a, s, n;
  return (
    (a = t.horizontal
      ? ((e = t.base > t.x), (i = "left"), "right")
      : ((e = t.base < t.y), (i = "bottom"), "top")),
    (n = e ? ((s = "end"), "start") : ((s = "start"), "end")),
    { start: i, end: a, reverse: e, top: s, bottom: n }
  );
}
function setBorderSkipped(t, e, i, a) {
  let s = e.borderSkipped;
  const n = {};
  var r, o, l, h;
  s
    ? !0 === s
      ? (t.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 })
      : (({ start: e, end: r, reverse: o, top: l, bottom: h } = borderProps(t)),
        "middle" === s &&
          i &&
          ((t.enableBorderRadius = !0),
          (s =
            (i._top || 0) === a
              ? l
              : (i._bottom || 0) === a
              ? h
              : ((n[parseEdge(h, e, r, o)] = !0), l))),
        (n[parseEdge(s, e, r, o)] = !0),
        (t.borderSkipped = n))
    : (t.borderSkipped = n);
}
function parseEdge(t, e, i, a) {
  return (t = a ? startEnd((t = swap(t, e, i)), i, e) : startEnd(t, e, i));
}
function swap(t, e, i) {
  return t === e ? i : t === i ? e : t;
}
function startEnd(t, e, i) {
  return "start" === t ? e : "end" === t ? i : t;
}
function setInflateAmount(t, { inflateAmount: e }, i) {
  t.inflateAmount = "auto" === e ? (1 === i ? 0.33 : 0) : e;
}
class BarController extends DatasetController {
  static id = "bar";
  static defaults = {
    datasetElementType: !1,
    dataElementType: "bar",
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: !0,
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "base", "width", "height"],
      },
    },
  };
  static overrides = {
    scales: {
      _index_: { type: "category", offset: !0, grid: { offset: !0 } },
      _value_: { type: "linear", beginAtZero: !0 },
    },
  };
  parsePrimitiveData(t, e, i, a) {
    return parseArrayOrPrimitive(t, e, i, a);
  }
  parseArrayData(t, e, i, a) {
    return parseArrayOrPrimitive(t, e, i, a);
  }
  parseObjectData(t, e, i, a) {
    const { iScale: s, vScale: n } = t;
    var { xAxisKey: t = "x", yAxisKey: r = "y" } = this._parsing,
      o = "x" === s.axis ? t : r,
      l = "x" === n.axis ? t : r;
    const h = [];
    let d, c, u, g;
    for (c = (d = i) + a; d < c; ++d)
      (g = e[d]),
        ((u = {})[s.axis] = s.parse(resolveObjectKey(g, o), d)),
        h.push(parseValue(resolveObjectKey(g, l), u, n, d));
    return h;
  }
  updateRangeFromParsed(t, e, i, a) {
    super.updateRangeFromParsed(t, e, i, a);
    a = i._custom;
    a &&
      e === this._cachedMeta.vScale &&
      ((t.min = Math.min(t.min, a.min)), (t.max = Math.max(t.max, a.max)));
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(t) {
    const { iScale: e, vScale: i } = this._cachedMeta;
    var t = this.getParsed(t),
      a = t._custom,
      a = isFloatBar(a)
        ? "[" + a.start + ", " + a.end + "]"
        : "" + i.getLabelForValue(t[i.axis]);
    return { label: "" + e.getLabelForValue(t[e.axis]), value: a };
  }
  initialize() {
    (this.enableOptionSharing = !0), super.initialize();
    const t = this._cachedMeta;
    t.stack = this.getDataset().stack;
  }
  update(t) {
    var e = this._cachedMeta;
    this.updateElements(e.data, 0, e.data.length, t);
  }
  updateElements(e, i, a, s) {
    var n = "reset" === s;
    const {
      index: r,
      _cachedMeta: { vScale: o },
    } = this;
    var l = o.getBasePixel(),
      h = o.isHorizontal(),
      d = this._getRuler(),
      { sharedOptions: c, includeOptions: u } = this._getSharedOptions(i, s);
    for (let t = i; t < i + a; t++) {
      var g = this.getParsed(t),
        p =
          n || isNullOrUndef(g[o.axis])
            ? { base: l, head: l }
            : this._calculateBarValuePixels(t),
        f = this._calculateBarIndexPixels(t, d),
        m = (g._stacks || {})[o.axis];
      const v = {
        horizontal: h,
        base: p.base,
        enableBorderRadius:
          !m || isFloatBar(g._custom) || r === m._top || r === m._bottom,
        x: h ? p.head : f.center,
        y: h ? f.center : p.head,
        height: h ? f.size : Math.abs(p.size),
        width: h ? Math.abs(p.size) : f.size,
      };
      u &&
        (v.options =
          c || this.resolveDataElementOptions(t, e[t].active ? "active" : s));
      g = v.options || e[t].options;
      setBorderSkipped(v, g, m, r),
        setInflateAmount(v, g, d.ratio),
        this.updateElement(e[t], t, v, s);
    }
  }
  _getStacks(t, i) {
    const e = this._cachedMeta["iScale"];
    var a = e
        .getMatchingVisibleMetas(this._type)
        .filter((t) => t.controller.options.grouped),
      s = e.options.stacked;
    const n = [];
    for (const r of a)
      if (
        (void 0 === i ||
          !((t) => {
            var e = t.controller.getParsed(i),
              e = e && e[t.vScale.axis];
            if (isNullOrUndef(e) || isNaN(e)) return !0;
          })(r)) &&
        ((!1 === s ||
          -1 === n.indexOf(r.stack) ||
          (void 0 === s && void 0 === r.stack)) &&
          n.push(r.stack),
        r.index === t)
      )
        break;
    return n.length || n.push(void 0), n;
  }
  _getStackCount(t) {
    return this._getStacks(void 0, t).length;
  }
  _getStackIndex(t, e, i) {
    const a = this._getStacks(t, i);
    t = void 0 !== e ? a.indexOf(e) : -1;
    return -1 === t ? a.length - 1 : t;
  }
  _getRuler() {
    var t = this.options,
      e = this._cachedMeta;
    const i = e.iScale,
      a = [];
    let s, n;
    for (s = 0, n = e.data.length; s < n; ++s)
      a.push(i.getPixelForValue(this.getParsed(s)[i.axis], s));
    var r = t.barThickness;
    return {
      min: r || computeMinSampleSize(e),
      pixels: a,
      start: i._startPixel,
      end: i._endPixel,
      stackCount: this._getStackCount(),
      scale: i,
      grouped: t.grouped,
      ratio: r ? 1 : t.categoryPercentage * t.barPercentage,
    };
  }
  _calculateBarValuePixels(t) {
    const {
      _cachedMeta: { vScale: e, _stacked: i, index: a },
      options: { base: s, minBarLength: n },
    } = this;
    var r = s || 0;
    const o = this.getParsed(t);
    var l = o._custom,
      h = isFloatBar(l);
    let d = o[e.axis],
      c = 0,
      u = i ? this.applyStack(e, o, i) : d,
      g,
      p;
    u !== d && ((c = u - d), (u = d)),
      h &&
        ((d = l.barStart),
        (u = l.barEnd - l.barStart),
        0 !== d && sign(d) !== sign(l.barEnd) && (c = 0),
        (c += d));
    var f,
      l = isNullOrUndef(s) || h ? c : s;
    let m = e.getPixelForValue(l);
    return (
      (g = this.chart.getDataVisibility(t) ? e.getPixelForValue(c + u) : m),
      (p = g - m),
      Math.abs(p) < n &&
        ((p = barSign(p, e, r) * n),
        d === r && (m -= p / 2),
        (l = e.getPixelForDecimal(0)),
        (t = e.getPixelForDecimal(1)),
        (f = Math.min(l, t)),
        (l = Math.max(l, t)),
        (m = Math.max(Math.min(m, l), f)),
        (g = m + p),
        i &&
          !h &&
          (o._stacks[e.axis]._visualValues[a] =
            e.getValueForPixel(g) - e.getValueForPixel(m))),
      m === e.getPixelForValue(r) &&
        ((t = (sign(p) * e.getLineWidthForValue(r)) / 2), (m += t), (p -= t)),
      { size: p, base: m, head: g, center: g + p / 2 }
    );
  }
  _calculateBarIndexPixels(t, e) {
    const i = e.scale;
    var a,
      s = this.options,
      n = s.skipNull,
      r = valueOrDefault(s.maxBarThickness, 1 / 0);
    let o, l;
    return (
      (l = e.grouped
        ? ((a = n ? this._getStackCount(t) : e.stackCount),
          (s = (
            "flex" === s.barThickness
              ? computeFlexCategoryTraits
              : computeFitCategoryTraits
          )(t, e, s, a)),
          (a = this._getStackIndex(
            this.index,
            this._cachedMeta.stack,
            n ? t : void 0
          )),
          (o = s.start + s.chunk * a + s.chunk / 2),
          Math.min(r, s.chunk * s.ratio))
        : ((o = i.getPixelForValue(this.getParsed(t)[i.axis], t)),
          Math.min(r, e.min * e.ratio))),
      { base: o - l / 2, head: o + l / 2, center: o, size: l }
    );
  }
  draw() {
    var t = this._cachedMeta,
      e = t.vScale;
    const i = t.data;
    var a = i.length;
    let s = 0;
    for (; s < a; ++s)
      null !== this.getParsed(s)[e.axis] && i[s].draw(this._ctx);
  }
}
class BubbleController extends DatasetController {
  static id = "bubble";
  static defaults = {
    datasetElementType: !1,
    dataElementType: "point",
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "borderWidth", "radius"],
      },
    },
  };
  static overrides = {
    scales: { x: { type: "linear" }, y: { type: "linear" } },
  };
  initialize() {
    (this.enableOptionSharing = !0), super.initialize();
  }
  parsePrimitiveData(t, e, i, a) {
    const s = super.parsePrimitiveData(t, e, i, a);
    for (let t = 0; t < s.length; t++)
      s[t]._custom = this.resolveDataElementOptions(t + i).radius;
    return s;
  }
  parseArrayData(t, e, i, a) {
    const s = super.parseArrayData(t, e, i, a);
    for (let t = 0; t < s.length; t++) {
      var n = e[i + t];
      s[t]._custom = valueOrDefault(
        n[2],
        this.resolveDataElementOptions(t + i).radius
      );
    }
    return s;
  }
  parseObjectData(t, e, i, a) {
    const s = super.parseObjectData(t, e, i, a);
    for (let t = 0; t < s.length; t++) {
      var n = e[i + t];
      s[t]._custom = valueOrDefault(
        n && n.r && +n.r,
        this.resolveDataElementOptions(t + i).radius
      );
    }
    return s;
  }
  getMaxOverflow() {
    const e = this._cachedMeta.data;
    let i = 0;
    for (let t = e.length - 1; 0 <= t; --t)
      i = Math.max(i, e[t].size(this.resolveDataElementOptions(t)) / 2);
    return 0 < i && i;
  }
  getLabelAndValue(t) {
    var e = this._cachedMeta,
      i = this.chart.data.labels || [];
    const { xScale: a, yScale: s } = e;
    var e = this.getParsed(t),
      n = a.getLabelForValue(e.x),
      r = s.getLabelForValue(e.y),
      e = e._custom;
    return {
      label: i[t] || "",
      value: "(" + n + ", " + r + (e ? ", " + e : "") + ")",
    };
  }
  update(t) {
    var e = this._cachedMeta.data;
    this.updateElements(e, 0, e.length, t);
  }
  updateElements(e, i, a, s) {
    var n = "reset" === s;
    const { iScale: r, vScale: o } = this._cachedMeta;
    var { sharedOptions: l, includeOptions: h } = this._getSharedOptions(i, s),
      d = r.axis,
      c = o.axis;
    for (let t = i; t < i + a; t++) {
      var u = e[t],
        g = !n && this.getParsed(t);
      const f = {};
      var p = (f[d] = n ? r.getPixelForDecimal(0.5) : r.getPixelForValue(g[d])),
        g = (f[c] = n ? o.getBasePixel() : o.getPixelForValue(g[c]));
      (f.skip = isNaN(p) || isNaN(g)),
        h &&
          ((f.options =
            l || this.resolveDataElementOptions(t, u.active ? "active" : s)),
          n && (f.options.radius = 0)),
        this.updateElement(u, t, f, s);
    }
  }
  resolveDataElementOptions(t, e) {
    var i = this.getParsed(t);
    let a = super.resolveDataElementOptions(t, e);
    t = (a = a.$shared ? Object.assign({}, a, { $shared: !1 }) : a).radius;
    return (
      "active" !== e && (a.radius = 0),
      (a.radius += valueOrDefault(i && i._custom, t)),
      a
    );
  }
}
function getRatioAndOffset(t, e, a) {
  let i = 1,
    s = 1,
    n = 0,
    r = 0;
  if (e < TAU) {
    const u = t,
      g = u + e;
    var t = Math.cos(u),
      e = Math.sin(u),
      o = Math.cos(g),
      l = Math.sin(g),
      h = (t, e, i) =>
        _angleBetween(t, u, g, !0) ? 1 : Math.max(e, e * a, i, i * a),
      d = (t, e, i) =>
        _angleBetween(t, u, g, !0) ? -1 : Math.min(e, e * a, i, i * a),
      c = h(0, t, o),
      h = h(HALF_PI, e, l),
      t = d(PI, t, o),
      o = d(PI + HALF_PI, e, l);
    (i = (c - t) / 2),
      (s = (h - o) / 2),
      (n = -(c + t) / 2),
      (r = -(h + o) / 2);
  }
  return { ratioX: i, ratioY: s, offsetX: n, offsetY: r };
}
class DoughnutController extends DatasetController {
  static id = "doughnut";
  static defaults = {
    datasetElementType: !1,
    dataElementType: "arc",
    animation: { animateRotate: !0, animateScale: !1 },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "circumference",
          "endAngle",
          "innerRadius",
          "outerRadius",
          "startAngle",
          "x",
          "y",
          "offset",
          "borderWidth",
          "spacing",
        ],
      },
    },
    cutout: "50%",
    rotation: 0,
    circumference: 360,
    radius: "100%",
    spacing: 0,
    indexAxis: "r",
  };
  static descriptors = {
    _scriptable: (t) => "spacing" !== t,
    _indexable: (t) =>
      "spacing" !== t &&
      !t.startsWith("borderDash") &&
      !t.startsWith("hoverBorderDash"),
  };
  static overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(s) {
            const t = s.data;
            if (t.labels.length && t.datasets.length) {
              const { pointStyle: n, color: r } = s.legend.options["labels"];
              return t.labels.map((t, e) => {
                const i = s.getDatasetMeta(0);
                var a = i.controller.getStyle(e);
                return {
                  text: t,
                  fillStyle: a.backgroundColor,
                  strokeStyle: a.borderColor,
                  fontColor: r,
                  lineWidth: a.borderWidth,
                  pointStyle: n,
                  hidden: !s.getDataVisibility(e),
                  index: e,
                };
              });
            }
            return [];
          },
        },
        onClick(t, e, i) {
          i.chart.toggleDataVisibility(e.index), i.chart.update();
        },
      },
    },
  };
  constructor(t, e) {
    super(t, e),
      (this.enableOptionSharing = !0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.offsetX = void 0),
      (this.offsetY = void 0);
  }
  linkScales() {}
  parse(a, s) {
    const n = this.getDataset().data,
      r = this._cachedMeta;
    if (!1 === this._parsing) r._parsed = n;
    else {
      let t = (t) => +n[t];
      if (isObject(n[a])) {
        const { key: o = "value" } = this._parsing;
        t = (t) => +resolveObjectKey(n[t], o);
      }
      let e, i;
      for (i = (e = a) + s; e < i; ++e) r._parsed[e] = t(e);
    }
  }
  _getRotation() {
    return toRadians(this.options.rotation - 90);
  }
  _getCircumference() {
    return toRadians(this.options.circumference);
  }
  _getRotationExtents() {
    let e = TAU,
      i = -TAU;
    for (let t = 0; t < this.chart.data.datasets.length; ++t)
      if (
        this.chart.isDatasetVisible(t) &&
        this.chart.getDatasetMeta(t).type === this._type
      ) {
        const n = this.chart.getDatasetMeta(t).controller;
        var a = n._getRotation(),
          s = n._getCircumference();
        (e = Math.min(e, a)), (i = Math.max(i, a + s));
      }
    return { rotation: e, circumference: i - e };
  }
  update(t) {
    var e = this.chart["chartArea"];
    const i = this._cachedMeta;
    var a = i.data,
      s =
        this.getMaxBorderWidth() + this.getMaxOffset(a) + this.options.spacing,
      n = Math.max((Math.min(e.width, e.height) - s) / 2, 0),
      n = Math.min(toPercentage(this.options.cutout, n), 1),
      r = this._getRingWeight(this.index),
      { circumference: o, rotation: l } = this._getRotationExtents(),
      {
        ratioX: l,
        ratioY: o,
        offsetX: h,
        offsetY: d,
      } = getRatioAndOffset(l, o, n),
      l = (e.width - s) / l,
      e = (e.height - s) / o,
      s = Math.max(Math.min(l, e) / 2, 0),
      o = toDimension(this.options.radius, s),
      l = (o - Math.max(o * n, 0)) / this._getVisibleDatasetWeightTotal();
    (this.offsetX = h * o),
      (this.offsetY = d * o),
      (i.total = this.calculateTotal()),
      (this.outerRadius = o - l * this._getRingWeightOffset(this.index)),
      (this.innerRadius = Math.max(this.outerRadius - l * r, 0)),
      this.updateElements(a, 0, a.length, t);
  }
  _circumference(t, e) {
    var i = this.options,
      a = this._cachedMeta,
      s = this._getCircumference();
    return (e && i.animation.animateRotate) ||
      !this.chart.getDataVisibility(t) ||
      null === a._parsed[t] ||
      a.data[t].hidden
      ? 0
      : this.calculateCircumference((a._parsed[t] * s) / TAU);
  }
  updateElements(t, e, i, a) {
    var s = "reset" === a,
      n = this.chart,
      r = n.chartArea,
      n = n.options.animation,
      o = (r.left + r.right) / 2,
      l = (r.top + r.bottom) / 2,
      r = s && n.animateScale,
      h = r ? 0 : this.innerRadius,
      d = r ? 0 : this.outerRadius,
      { sharedOptions: c, includeOptions: u } = this._getSharedOptions(e, a);
    let g = this._getRotation(),
      p;
    for (p = 0; p < e; ++p) g += this._circumference(p, s);
    for (p = e; p < e + i; ++p) {
      var f = this._circumference(p, s),
        m = t[p];
      const v = {
        x: o + this.offsetX,
        y: l + this.offsetY,
        startAngle: g,
        endAngle: g + f,
        circumference: f,
        outerRadius: d,
        innerRadius: h,
      };
      u &&
        (v.options =
          c || this.resolveDataElementOptions(p, m.active ? "active" : a)),
        (g += f),
        this.updateElement(m, p, v, a);
    }
  }
  calculateTotal() {
    var t = this._cachedMeta,
      e = t.data;
    let i = 0,
      a;
    for (a = 0; a < e.length; a++) {
      var s = t._parsed[a];
      null === s ||
        isNaN(s) ||
        !this.chart.getDataVisibility(a) ||
        e[a].hidden ||
        (i += Math.abs(s));
    }
    return i;
  }
  calculateCircumference(t) {
    var e = this._cachedMeta.total;
    return 0 < e && !isNaN(t) ? TAU * (Math.abs(t) / e) : 0;
  }
  getLabelAndValue(t) {
    var e = this._cachedMeta,
      i = this.chart,
      a = i.data.labels || [],
      e = formatNumber(e._parsed[t], i.options.locale);
    return { label: a[t] || "", value: e };
  }
  getMaxBorderWidth(t) {
    let e = 0;
    const i = this.chart;
    let a, s, n, r, o;
    if (!t)
      for (a = 0, s = i.data.datasets.length; a < s; ++a)
        if (i.isDatasetVisible(a)) {
          (t = (n = i.getDatasetMeta(a)).data), (r = n.controller);
          break;
        }
    if (!t) return 0;
    for (a = 0, s = t.length; a < s; ++a)
      "inner" !== (o = r.resolveDataElementOptions(a)).borderAlign &&
        (e = Math.max(e, o.borderWidth || 0, o.hoverBorderWidth || 0));
    return e;
  }
  getMaxOffset(i) {
    let a = 0;
    for (let t = 0, e = i.length; t < e; ++t) {
      var s = this.resolveDataElementOptions(t);
      a = Math.max(a, s.offset || 0, s.hoverOffset || 0);
    }
    return a;
  }
  _getRingWeightOffset(e) {
    let i = 0;
    for (let t = 0; t < e; ++t)
      this.chart.isDatasetVisible(t) && (i += this._getRingWeight(t));
    return i;
  }
  _getRingWeight(t) {
    return Math.max(valueOrDefault(this.chart.data.datasets[t].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
}
class LineController extends DatasetController {
  static id = "line";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: !0,
    spanGaps: !1,
  };
  static overrides = {
    scales: { _index_: { type: "category" }, _value_: { type: "linear" } },
  };
  initialize() {
    (this.enableOptionSharing = !0),
      (this.supportsDecimation = !0),
      super.initialize();
  }
  update(t) {
    var e = this._cachedMeta;
    const { dataset: i, data: a = [], _dataset: s } = e;
    var n = this.chart._animationsDisabled;
    let { start: r, count: o } = _getStartAndCountOfVisiblePoints(e, a, n);
    (this._drawStart = r),
      (this._drawCount = o),
      _scaleRangesChanged(e) && ((r = 0), (o = a.length)),
      (i._chart = this.chart),
      (i._datasetIndex = this.index),
      (i._decimated = !!s._decimated),
      (i.points = a);
    const l = this.resolveDatasetElementOptions(t);
    this.options.showLine || (l.borderWidth = 0),
      (l.segment = this.options.segment),
      this.updateElement(i, void 0, { animated: !n, options: l }, t),
      this.updateElements(a, r, o, t);
  }
  updateElements(e, i, t, a) {
    var s = "reset" === a;
    const { iScale: n, vScale: r, _stacked: o, _dataset: l } = this._cachedMeta;
    var { sharedOptions: h, includeOptions: d } = this._getSharedOptions(i, a),
      c = n.axis,
      u = r.axis,
      { spanGaps: g, segment: p } = this.options,
      f = isNumber(g) ? g : Number.POSITIVE_INFINITY,
      m = this.chart._animationsDisabled || s || "none" === a,
      v = i + t,
      x = e.length;
    let b = 0 < i && this.getParsed(i - 1);
    for (let t = 0; t < x; ++t) {
      var _,
        y,
        k,
        S,
        D = e[t];
      const M = m ? D : {};
      t < i || t >= v
        ? (M.skip = !0)
        : ((_ = this.getParsed(t)),
          (y = isNullOrUndef(_[u])),
          (k = M[c] = n.getPixelForValue(_[c], t)),
          (S = M[u] =
            s || y
              ? r.getBasePixel()
              : r.getPixelForValue(o ? this.applyStack(r, _, o) : _[u], t)),
          (M.skip = isNaN(k) || isNaN(S) || y),
          (M.stop = 0 < t && Math.abs(_[c] - b[c]) > f),
          p && ((M.parsed = _), (M.raw = l.data[t])),
          d &&
            (M.options =
              h || this.resolveDataElementOptions(t, D.active ? "active" : a)),
          m || this.updateElement(D, t, M, a),
          (b = _));
    }
  }
  getMaxOverflow() {
    var t = this._cachedMeta,
      e = t.dataset,
      e = (e.options && e.options.borderWidth) || 0;
    const i = t.data || [];
    if (!i.length) return e;
    var t = i[0].size(this.resolveDataElementOptions(0)),
      a = i[i.length - 1].size(this.resolveDataElementOptions(i.length - 1));
    return Math.max(e, t, a) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis),
      super.draw();
  }
}
class PolarAreaController extends DatasetController {
  static id = "polarArea";
  static defaults = {
    dataElementType: "arc",
    animation: { animateRotate: !0, animateScale: !0 },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "startAngle",
          "endAngle",
          "innerRadius",
          "outerRadius",
        ],
      },
    },
    indexAxis: "r",
    startAngle: 0,
  };
  static overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(s) {
            const t = s.data;
            if (t.labels.length && t.datasets.length) {
              const { pointStyle: n, color: r } = s.legend.options["labels"];
              return t.labels.map((t, e) => {
                const i = s.getDatasetMeta(0);
                var a = i.controller.getStyle(e);
                return {
                  text: t,
                  fillStyle: a.backgroundColor,
                  strokeStyle: a.borderColor,
                  fontColor: r,
                  lineWidth: a.borderWidth,
                  pointStyle: n,
                  hidden: !s.getDataVisibility(e),
                  index: e,
                };
              });
            }
            return [];
          },
        },
        onClick(t, e, i) {
          i.chart.toggleDataVisibility(e.index), i.chart.update();
        },
      },
    },
    scales: {
      r: {
        type: "radialLinear",
        angleLines: { display: !1 },
        beginAtZero: !0,
        grid: { circular: !0 },
        pointLabels: { display: !1 },
        startAngle: 0,
      },
    },
  };
  constructor(t, e) {
    super(t, e), (this.innerRadius = void 0), (this.outerRadius = void 0);
  }
  getLabelAndValue(t) {
    var e = this._cachedMeta,
      i = this.chart,
      a = i.data.labels || [],
      e = formatNumber(e._parsed[t].r, i.options.locale);
    return { label: a[t] || "", value: e };
  }
  parseObjectData(t, e, i, a) {
    return _parseObjectDataRadialScale.bind(this)(t, e, i, a);
  }
  update(t) {
    var e = this._cachedMeta.data;
    this._updateRadius(), this.updateElements(e, 0, e.length, t);
  }
  getMinMax() {
    const t = this._cachedMeta,
      a = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    return (
      t.data.forEach((t, e) => {
        var i = this.getParsed(e).r;
        !isNaN(i) &&
          this.chart.getDataVisibility(e) &&
          (i < a.min && (a.min = i), i > a.max && (a.max = i));
      }),
      a
    );
  }
  _updateRadius() {
    const t = this.chart;
    var e = t.chartArea,
      i = t.options,
      e = Math.min(e.right - e.left, e.bottom - e.top),
      e = Math.max(e / 2, 0),
      i =
        (e -
          Math.max(
            i.cutoutPercentage ? (e / 100) * i.cutoutPercentage : 1,
            0
          )) /
        t.getVisibleDatasetCount();
    (this.outerRadius = e - i * this.index),
      (this.innerRadius = this.outerRadius - i);
  }
  updateElements(a, t, e, s) {
    var n = "reset" === s;
    const r = this.chart;
    var o = r.options.animation;
    const l = this._cachedMeta.rScale;
    var h = l.xCenter,
      d = l.yCenter,
      c = l.getIndexAngle(0) - 0.5 * PI;
    let u = c,
      g;
    var p = 360 / this.countVisibleElements();
    for (g = 0; g < t; ++g) u += this._computeAngle(g, s, p);
    for (g = t; g < t + e; g++) {
      var f = a[g];
      let t = u,
        e = u + this._computeAngle(g, s, p),
        i = r.getDataVisibility(g)
          ? l.getDistanceFromCenterForValue(this.getParsed(g).r)
          : 0;
      (u = e), n && (o.animateScale && (i = 0), o.animateRotate && (t = e = c));
      var m = {
        x: h,
        y: d,
        innerRadius: 0,
        outerRadius: i,
        startAngle: t,
        endAngle: e,
        options: this.resolveDataElementOptions(g, f.active ? "active" : s),
      };
      this.updateElement(f, g, m, s);
    }
  }
  countVisibleElements() {
    const t = this._cachedMeta;
    let i = 0;
    return (
      t.data.forEach((t, e) => {
        !isNaN(this.getParsed(e).r) && this.chart.getDataVisibility(e) && i++;
      }),
      i
    );
  }
  _computeAngle(t, e, i) {
    return this.chart.getDataVisibility(t)
      ? toRadians(this.resolveDataElementOptions(t, e).angle || i)
      : 0;
  }
}
class PieController extends DoughnutController {
  static id = "pie";
  static defaults = {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: "100%",
  };
}
class RadarController extends DatasetController {
  static id = "radar";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    indexAxis: "r",
    showLine: !0,
    elements: { line: { fill: "start" } },
  };
  static overrides = {
    aspectRatio: 1,
    scales: { r: { type: "radialLinear" } },
  };
  getLabelAndValue(t) {
    const e = this._cachedMeta.vScale;
    var i = this.getParsed(t);
    return {
      label: e.getLabels()[t],
      value: "" + e.getLabelForValue(i[e.axis]),
    };
  }
  parseObjectData(t, e, i, a) {
    return _parseObjectDataRadialScale.bind(this)(t, e, i, a);
  }
  update(t) {
    const e = this._cachedMeta,
      i = e.dataset;
    var a = e.data || [],
      s = e.iScale.getLabels();
    if (((i.points = a), "resize" !== t)) {
      const n = this.resolveDatasetElementOptions(t);
      this.options.showLine || (n.borderWidth = 0);
      s = { _loop: !0, _fullLoop: s.length === a.length, options: n };
      this.updateElement(i, void 0, s, t);
    }
    this.updateElements(a, 0, a.length, t);
  }
  updateElements(e, i, a, s) {
    const n = this._cachedMeta.rScale;
    var r = "reset" === s;
    for (let t = i; t < i + a; t++) {
      var o = e[t],
        l = this.resolveDataElementOptions(t, o.active ? "active" : s),
        h = n.getPointPositionForValue(t, this.getParsed(t).r),
        d = r ? n.xCenter : h.x,
        c = r ? n.yCenter : h.y,
        h = {
          x: d,
          y: c,
          angle: h.angle,
          skip: isNaN(d) || isNaN(c),
          options: l,
        };
      this.updateElement(o, t, h, s);
    }
  }
}
class ScatterController extends DatasetController {
  static id = "scatter";
  static defaults = {
    datasetElementType: !1,
    dataElementType: "point",
    showLine: !1,
    fill: !1,
  };
  static overrides = {
    interaction: { mode: "point" },
    scales: { x: { type: "linear" }, y: { type: "linear" } },
  };
  getLabelAndValue(t) {
    var e = this._cachedMeta,
      i = this.chart.data.labels || [];
    const { xScale: a, yScale: s } = e;
    var e = this.getParsed(t),
      n = a.getLabelForValue(e.x),
      e = s.getLabelForValue(e.y);
    return { label: i[t] || "", value: "(" + n + ", " + e + ")" };
  }
  update(t) {
    var e = this._cachedMeta,
      { data: i = [] } = e,
      a = this.chart._animationsDisabled;
    let { start: s, count: n } = _getStartAndCountOfVisiblePoints(e, i, a);
    if (
      ((this._drawStart = s),
      (this._drawCount = n),
      _scaleRangesChanged(e) && ((s = 0), (n = i.length)),
      this.options.showLine)
    ) {
      const { dataset: r, _dataset: o } = e,
        l =
          ((r._chart = this.chart),
          (r._datasetIndex = this.index),
          (r._decimated = !!o._decimated),
          (r.points = i),
          this.resolveDatasetElementOptions(t));
      (l.segment = this.options.segment),
        this.updateElement(r, void 0, { animated: !a, options: l }, t);
    }
    this.updateElements(i, s, n, t);
  }
  addElements() {
    var t = this.options["showLine"];
    !this.datasetElementType &&
      t &&
      (this.datasetElementType = this.chart.registry.getElement("line")),
      super.addElements();
  }
  updateElements(e, i, a, s) {
    var n = "reset" === s;
    const { iScale: r, vScale: o, _stacked: l, _dataset: h } = this._cachedMeta;
    var t = this.resolveDataElementOptions(i, s),
      d = this.getSharedOptions(t),
      c = this.includeOptions(s, d),
      u = r.axis,
      g = o.axis,
      { spanGaps: p, segment: f } = this.options,
      m = isNumber(p) ? p : Number.POSITIVE_INFINITY,
      v = this.chart._animationsDisabled || n || "none" === s;
    let x = 0 < i && this.getParsed(i - 1);
    for (let t = i; t < i + a; ++t) {
      var b = e[t],
        _ = this.getParsed(t);
      const D = v ? b : {};
      var y = isNullOrUndef(_[g]),
        k = (D[u] = r.getPixelForValue(_[u], t)),
        S = (D[g] =
          n || y
            ? o.getBasePixel()
            : o.getPixelForValue(l ? this.applyStack(o, _, l) : _[g], t));
      (D.skip = isNaN(k) || isNaN(S) || y),
        (D.stop = 0 < t && Math.abs(_[u] - x[u]) > m),
        f && ((D.parsed = _), (D.raw = h.data[t])),
        c &&
          (D.options =
            d || this.resolveDataElementOptions(t, b.active ? "active" : s)),
        v || this.updateElement(b, t, D, s),
        (x = _);
    }
    this.updateSharedOptions(d, s, t);
  }
  getMaxOverflow() {
    var t = this._cachedMeta;
    const i = t.data || [];
    if (!this.options.showLine) {
      let e = 0;
      for (let t = i.length - 1; 0 <= t; --t)
        e = Math.max(e, i[t].size(this.resolveDataElementOptions(t)) / 2);
      return 0 < e && e;
    }
    (t = t.dataset), (t = (t.options && t.options.borderWidth) || 0);
    if (!i.length) return t;
    var e = i[0].size(this.resolveDataElementOptions(0)),
      a = i[i.length - 1].size(this.resolveDataElementOptions(i.length - 1));
    return Math.max(t, e, a) / 2;
  }
}
var controllers = Object.freeze({
  __proto__: null,
  BarController: BarController,
  BubbleController: BubbleController,
  DoughnutController: DoughnutController,
  LineController: LineController,
  PieController: PieController,
  PolarAreaController: PolarAreaController,
  RadarController: RadarController,
  ScatterController: ScatterController,
});
function abstract() {
  throw new Error(
    "This method is not implemented: Check that a complete date adapter is provided."
  );
}
class DateAdapterBase {
  static override(t) {
    Object.assign(DateAdapterBase.prototype, t);
  }
  options;
  constructor(t) {
    this.options = t || {};
  }
  init() {}
  formats() {
    return abstract();
  }
  parse() {
    return abstract();
  }
  format() {
    return abstract();
  }
  add() {
    return abstract();
  }
  diff() {
    return abstract();
  }
  startOf() {
    return abstract();
  }
  endOf() {
    return abstract();
  }
}
var adapters = { _date: DateAdapterBase };
function binarySearch(t, e, i, a) {
  var { controller: t, data: s, _sorted: n } = t,
    r = t._cachedMeta.iScale;
  if (r && e === r.axis && "r" !== e && n && s.length) {
    const o = r._reversePixels ? _rlookupByKey : _lookupByKey;
    if (!a) return o(s, e, i);
    if (t._sharedOptions) {
      const l = s[0];
      n = "function" == typeof l.getRange && l.getRange(e);
      if (n)
        return (
          (r = o(s, e, i - n)), (a = o(s, e, i + n)), { lo: r.lo, hi: a.hi }
        );
    }
  }
  return { lo: 0, hi: s.length - 1 };
}
function evaluateInteractionItems(t, i, e, a, s) {
  var n = t.getSortedVisibleDatasetMetas(),
    r = e[i];
  for (let t = 0, e = n.length; t < e; ++t) {
    var { index: o, data: l } = n[t],
      { lo: h, hi: d } = binarySearch(n[t], i, r, s);
    for (let t = h; t <= d; ++t) {
      var c = l[t];
      c.skip || a(c, o, t);
    }
  }
}
function getDistanceMetricForAxis(t) {
  const a = -1 !== t.indexOf("x"),
    s = -1 !== t.indexOf("y");
  return function (t, e) {
    var i = a ? Math.abs(t.x - e.x) : 0,
      t = s ? Math.abs(t.y - e.y) : 0;
    return Math.sqrt(Math.pow(i, 2) + Math.pow(t, 2));
  };
}
function getIntersectItems(a, s, t, n, r) {
  const o = [];
  if (!r && !a.isPointInArea(s)) return o;
  return (
    evaluateInteractionItems(
      a,
      t,
      s,
      function (t, e, i) {
        (r || _isPointInArea(t, a.chartArea, 0)) &&
          t.inRange(s.x, s.y, n) &&
          o.push({ element: t, datasetIndex: e, index: i });
      },
      !0
    ),
    o
  );
}
function getNearestRadialItems(t, r, e, o) {
  let l = [];
  return (
    evaluateInteractionItems(t, e, r, function (t, e, i) {
      var { startAngle: a, endAngle: s } = t.getProps(
          ["startAngle", "endAngle"],
          o
        ),
        n = getAngleFromPoint(t, { x: r.x, y: r.y })["angle"];
      _angleBetween(n, a, s) &&
        l.push({ element: t, datasetIndex: e, index: i });
    }),
    l
  );
}
function getNearestCartesianItems(n, r, t, o, l, h) {
  let d = [];
  const c = getDistanceMetricForAxis(t);
  let u = Number.POSITIVE_INFINITY;
  return (
    evaluateInteractionItems(n, t, r, function (t, e, i) {
      var a,
        s = t.inRange(r.x, r.y, l);
      (o && !s) ||
        ((a = t.getCenterPoint(l)),
        (h || n.isPointInArea(a) || s) &&
          ((s = c(r, a)) < u
            ? ((d = [{ element: t, datasetIndex: e, index: i }]), (u = s))
            : s === u && d.push({ element: t, datasetIndex: e, index: i })));
    }),
    d
  );
}
function getNearestItems(t, e, i, a, s, n) {
  return n || t.isPointInArea(e)
    ? "r" !== i || a
      ? getNearestCartesianItems(t, e, i, a, s, n)
      : getNearestRadialItems(t, e, i, s)
    : [];
}
function getAxisItems(t, a, s, e, n) {
  const r = [],
    o = "x" === s ? "inXRange" : "inYRange";
  let l = !1;
  return (
    evaluateInteractionItems(t, s, a, (t, e, i) => {
      t[o](a[s], n) &&
        (r.push({ element: t, datasetIndex: e, index: i }),
        (l = l || t.inRange(a.x, a.y, n)));
    }),
    e && !l ? [] : r
  );
}
var Interaction = {
  evaluateInteractionItems: evaluateInteractionItems,
  modes: {
    index(t, e, i, a) {
      var e = getRelativePosition(e, t),
        s = i.axis || "x",
        n = i.includeInvisible || !1;
      const r = i.intersect
          ? getIntersectItems(t, e, s, a, n)
          : getNearestItems(t, e, s, !1, a, n),
        o = [];
      return r.length
        ? (t.getSortedVisibleDatasetMetas().forEach((t) => {
            var e = r[0].index,
              i = t.data[e];
            i &&
              !i.skip &&
              o.push({ element: i, datasetIndex: t.index, index: e });
          }),
          o)
        : [];
    },
    dataset(t, e, i, a) {
      var e = getRelativePosition(e, t),
        s = i.axis || "xy",
        n = i.includeInvisible || !1;
      let r = i.intersect
        ? getIntersectItems(t, e, s, a, n)
        : getNearestItems(t, e, s, !1, a, n);
      if (0 < r.length) {
        var o = r[0].datasetIndex,
          l = t.getDatasetMeta(o).data;
        r = [];
        for (let t = 0; t < l.length; ++t)
          r.push({ element: l[t], datasetIndex: o, index: t });
      }
      return r;
    },
    point(t, e, i, a) {
      return getIntersectItems(
        t,
        getRelativePosition(e, t),
        i.axis || "xy",
        a,
        i.includeInvisible || !1
      );
    },
    nearest(t, e, i, a) {
      var e = getRelativePosition(e, t),
        s = i.axis || "xy",
        n = i.includeInvisible || !1;
      return getNearestItems(t, e, s, i.intersect, a, n);
    },
    x(t, e, i, a) {
      return getAxisItems(t, getRelativePosition(e, t), "x", i.intersect, a);
    },
    y(t, e, i, a) {
      return getAxisItems(t, getRelativePosition(e, t), "y", i.intersect, a);
    },
  },
};
const STATIC_POSITIONS = ["left", "top", "right", "bottom"];
function filterByPosition(t, e) {
  return t.filter((t) => t.pos === e);
}
function filterDynamicPositionByAxis(t, e) {
  return t.filter(
    (t) => -1 === STATIC_POSITIONS.indexOf(t.pos) && t.box.axis === e
  );
}
function sortByWeight(t, a) {
  return t.sort((t, e) => {
    var i = a ? e : t,
      t = a ? t : e;
    return i.weight === t.weight ? i.index - t.index : i.weight - t.weight;
  });
}
function wrapBoxes(t) {
  const e = [];
  let i, a, s, n, r, o;
  for (i = 0, a = (t || []).length; i < a; ++i)
    ({
      position: n,
      options: { stack: r, stackWeight: o = 1 },
    } = s =
      t[i]),
      e.push({
        index: i,
        box: s,
        pos: n,
        horizontal: s.isHorizontal(),
        weight: s.weight,
        stack: r && n + r,
        stackWeight: o,
      });
  return e;
}
function buildStacks(t) {
  const e = {};
  for (const n of t) {
    var { stack: i, pos: a, stackWeight: s } = n;
    if (i && STATIC_POSITIONS.includes(a)) {
      const r = e[i] || (e[i] = { count: 0, placed: 0, weight: 0, size: 0 });
      r.count++, (r.weight += s);
    }
  }
  return e;
}
function setLayoutDims(t, e) {
  var i = buildStacks(t),
    { vBoxMaxWidth: a, hBoxMaxHeight: s } = e;
  let n, r, o;
  for (n = 0, r = t.length; n < r; ++n) {
    var l = (o = t[n]).box["fullSize"],
      h = i[o.stack],
      h = h && o.stackWeight / h.weight;
    o.horizontal
      ? ((o.width = h ? h * a : l && e.availableWidth), (o.height = s))
      : ((o.width = a), (o.height = h ? h * s : l && e.availableHeight));
  }
  return i;
}
function buildLayoutBoxes(t) {
  const e = wrapBoxes(t);
  t = sortByWeight(
    e.filter((t) => t.box.fullSize),
    !0
  );
  const i = sortByWeight(filterByPosition(e, "left"), !0),
    a = sortByWeight(filterByPosition(e, "right")),
    s = sortByWeight(filterByPosition(e, "top"), !0);
  var n = sortByWeight(filterByPosition(e, "bottom")),
    r = filterDynamicPositionByAxis(e, "x"),
    o = filterDynamicPositionByAxis(e, "y");
  return {
    fullSize: t,
    leftAndTop: i.concat(s),
    rightAndBottom: a.concat(o).concat(n).concat(r),
    chartArea: filterByPosition(e, "chartArea"),
    vertical: i.concat(a).concat(o),
    horizontal: s.concat(n).concat(r),
  };
}
function getCombinedMax(t, e, i, a) {
  return Math.max(t[i], e[i]) + Math.max(t[a], e[a]);
}
function updateMaxPadding(t, e) {
  (t.top = Math.max(t.top, e.top)),
    (t.left = Math.max(t.left, e.left)),
    (t.bottom = Math.max(t.bottom, e.bottom)),
    (t.right = Math.max(t.right, e.right));
}
function updateDims(t, e, i, a) {
  const { pos: s, box: n } = i;
  var r = t.maxPadding;
  if (!isObject(s)) {
    i.size && (t[s] -= i.size);
    const l = a[i.stack] || { size: 0, count: 1 };
    (l.size = Math.max(l.size, i.horizontal ? n.height : n.width)),
      (i.size = l.size / l.count),
      (t[s] += i.size);
  }
  n.getPadding && updateMaxPadding(r, n.getPadding());
  var a = Math.max(0, e.outerWidth - getCombinedMax(r, t, "left", "right")),
    e = Math.max(0, e.outerHeight - getCombinedMax(r, t, "top", "bottom")),
    r = a !== t.w,
    o = e !== t.h;
  return (
    (t.w = a),
    (t.h = e),
    i.horizontal ? { same: r, other: o } : { same: o, other: r }
  );
}
function handleMaxPadding(i) {
  const a = i.maxPadding;
  function t(t) {
    var e = Math.max(a[t] - i[t], 0);
    return (i[t] += e), e;
  }
  (i.y += t("top")), (i.x += t("left")), t("right"), t("bottom");
}
function getMargins(t, i) {
  const a = i.maxPadding;
  function e(t) {
    const e = { left: 0, top: 0, right: 0, bottom: 0 };
    return (
      t.forEach((t) => {
        e[t] = Math.max(i[t], a[t]);
      }),
      e
    );
  }
  return e(t ? ["left", "right"] : ["top", "bottom"]);
}
function fitBoxes(t, e, i, a) {
  const s = [];
  let n, r, o, l, h, d;
  for (n = 0, r = t.length, h = 0; n < r; ++n) {
    (o = t[n]),
      (l = o.box).update(
        o.width || e.w,
        o.height || e.h,
        getMargins(o.horizontal, e)
      );
    var { same: c, other: u } = updateDims(e, i, o, a);
    (h |= c && s.length), (d = d || u), l.fullSize || s.push(o);
  }
  return (h && fitBoxes(s, e, i, a)) || d;
}
function setBoxDims(t, e, i, a, s) {
  (t.top = i),
    (t.left = e),
    (t.right = e + a),
    (t.bottom = i + s),
    (t.width = a),
    (t.height = s);
}
function placeBoxes(t, e, i, a) {
  var s = i.padding;
  let { x: n, y: r } = e;
  for (const c of t) {
    var o = c.box;
    const u = a[c.stack] || { count: 1, placed: 0, weight: 1 };
    var l,
      h,
      d = c.stackWeight / u.weight || 1;
    c.horizontal
      ? ((h = e.w * d),
        (l = u.size || o.height),
        defined(u.start) && (r = u.start),
        o.fullSize
          ? setBoxDims(o, s.left, r, i.outerWidth - s.right - s.left, l)
          : setBoxDims(o, e.left + u.placed, r, h, l),
        (u.start = r),
        (u.placed += h),
        (r = o.bottom))
      : ((l = e.h * d),
        (h = u.size || o.width),
        defined(u.start) && (n = u.start),
        o.fullSize
          ? setBoxDims(o, n, s.top, h, i.outerHeight - s.bottom - s.top)
          : setBoxDims(o, n, e.top + u.placed, h, l),
        (u.start = n),
        (u.placed += l),
        (n = o.right));
  }
  (e.x = n), (e.y = r);
}
var layouts = {
  addBox(t, e) {
    t.boxes || (t.boxes = []),
      (e.fullSize = e.fullSize || !1),
      (e.position = e.position || "top"),
      (e.weight = e.weight || 0),
      (e._layers =
        e._layers ||
        function () {
          return [
            {
              z: 0,
              draw(t) {
                e.draw(t);
              },
            },
          ];
        }),
      t.boxes.push(e);
  },
  removeBox(t, e) {
    e = t.boxes ? t.boxes.indexOf(e) : -1;
    -1 !== e && t.boxes.splice(e, 1);
  },
  configure(t, e, i) {
    (e.fullSize = i.fullSize), (e.position = i.position), (e.weight = i.weight);
  },
  update(i, t, e, a) {
    if (i) {
      var s = toPadding(i.options.layout.padding),
        n = Math.max(t - s.width, 0),
        r = Math.max(e - s.height, 0),
        o = buildLayoutBoxes(i.boxes);
      const d = o.vertical;
      var l = o.horizontal,
        h =
          (each(i.boxes, (t) => {
            "function" == typeof t.beforeLayout && t.beforeLayout();
          }),
          d.reduce(
            (t, e) =>
              e.box.options && !1 === e.box.options.display ? t : t + 1,
            0
          ) || 1),
        t = Object.freeze({
          outerWidth: t,
          outerHeight: e,
          padding: s,
          availableWidth: n,
          availableHeight: r,
          vBoxMaxWidth: n / 2 / h,
          hBoxMaxHeight: r / 2,
        }),
        e = Object.assign({}, s);
      updateMaxPadding(e, toPadding(a));
      const c = Object.assign(
        { maxPadding: e, w: n, h: r, x: s.left, y: s.top },
        s
      );
      h = setLayoutDims(d.concat(l), t);
      fitBoxes(o.fullSize, c, t, h),
        fitBoxes(d, c, t, h),
        fitBoxes(l, c, t, h) && fitBoxes(d, c, t, h),
        handleMaxPadding(c),
        placeBoxes(o.leftAndTop, c, t, h),
        (c.x += c.w),
        (c.y += c.h),
        placeBoxes(o.rightAndBottom, c, t, h),
        (i.chartArea = {
          left: c.left,
          top: c.top,
          right: c.left + c.w,
          bottom: c.top + c.h,
          height: c.h,
          width: c.w,
        }),
        each(o.chartArea, (t) => {
          const e = t.box;
          Object.assign(e, i.chartArea),
            e.update(c.w, c.h, { left: 0, top: 0, right: 0, bottom: 0 });
        });
    }
  },
};
class BasePlatform {
  acquireContext(t, e) {}
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, e, i) {}
  removeEventListener(t, e, i) {}
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, e, i, a) {
    return (
      (e = Math.max(0, e || t.width)),
      (i = i || t.height),
      { width: e, height: Math.max(0, a ? Math.floor(e / a) : i) }
    );
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {}
}
class BasicPlatform extends BasePlatform {
  acquireContext(t) {
    return (t && t.getContext && t.getContext("2d")) || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const EXPANDO_KEY = "$chartjs",
  EVENT_TYPES = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup",
    pointerenter: "mouseenter",
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointerleave: "mouseout",
    pointerout: "mouseout",
  },
  isNullOrEmpty = (t) => null === t || "" === t;
function initCanvas(t, e) {
  const i = t.style;
  var a = t.getAttribute("height"),
    s = t.getAttribute("width");
  return (
    (t[EXPANDO_KEY] = {
      initial: {
        height: a,
        width: s,
        style: { display: i.display, height: i.height, width: i.width },
      },
    }),
    (i.display = i.display || "block"),
    (i.boxSizing = i.boxSizing || "border-box"),
    isNullOrEmpty(s) &&
      void 0 !== (s = readUsedSize(t, "width")) &&
      (t.width = s),
    isNullOrEmpty(a) &&
      ("" === t.style.height
        ? (t.height = t.width / (e || 2))
        : void 0 !== (s = readUsedSize(t, "height")) && (t.height = s)),
    t
  );
}
const eventListenerOptions = !!supportsEventListenerOptions && { passive: !0 };
function addListener(t, e, i) {
  t.addEventListener(e, i, eventListenerOptions);
}
function removeListener(t, e, i) {
  t.canvas.removeEventListener(e, i, eventListenerOptions);
}
function fromNativeEvent(t, e) {
  var i = EVENT_TYPES[t.type] || t.type,
    { x: a, y: s } = getRelativePosition(t, e);
  return {
    type: i,
    chart: e,
    native: t,
    x: void 0 !== a ? a : null,
    y: void 0 !== s ? s : null,
  };
}
function nodeListContains(t, e) {
  for (const i of t) if (i === e || i.contains(e)) return !0;
}
function createAttachObserver(t, e, a) {
  const s = t.canvas,
    i = new MutationObserver((t) => {
      let e = !1;
      for (const i of t)
        e =
          (e = e || nodeListContains(i.addedNodes, s)) &&
          !nodeListContains(i.removedNodes, s);
      e && a();
    });
  return i.observe(document, { childList: !0, subtree: !0 }), i;
}
function createDetachObserver(t, e, a) {
  const s = t.canvas,
    i = new MutationObserver((t) => {
      let e = !1;
      for (const i of t)
        e =
          (e = e || nodeListContains(i.removedNodes, s)) &&
          !nodeListContains(i.addedNodes, s);
      e && a();
    });
  return i.observe(document, { childList: !0, subtree: !0 }), i;
}
const drpListeningCharts = new Map();
let oldDevicePixelRatio = 0;
function onWindowResize() {
  const i = window.devicePixelRatio;
  i !== oldDevicePixelRatio &&
    ((oldDevicePixelRatio = i),
    drpListeningCharts.forEach((t, e) => {
      e.currentDevicePixelRatio !== i && t();
    }));
}
function listenDevicePixelRatioChanges(t, e) {
  drpListeningCharts.size || window.addEventListener("resize", onWindowResize),
    drpListeningCharts.set(t, e);
}
function unlistenDevicePixelRatioChanges(t) {
  drpListeningCharts.delete(t),
    drpListeningCharts.size ||
      window.removeEventListener("resize", onWindowResize);
}
function createResizeObserver(t, e, a) {
  var i = t.canvas;
  const s = i && _getParentNode(i);
  if (s) {
    const n = throttled((t, e) => {
        var i = s.clientWidth;
        a(t, e), i < s.clientWidth && a();
      }, window),
      r = new ResizeObserver((t) => {
        var t = t[0],
          e = t.contentRect.width,
          t = t.contentRect.height;
        (0 === e && 0 === t) || n(e, t);
      });
    return r.observe(s), listenDevicePixelRatioChanges(t, n), r;
  }
}
function releaseObserver(t, e, i) {
  i && i.disconnect(), "resize" === e && unlistenDevicePixelRatioChanges(t);
}
function createProxyAndListen(e, t, i) {
  var a = e.canvas,
    s = throttled((t) => {
      null !== e.ctx && i(fromNativeEvent(t, e));
    }, e);
  return addListener(a, t, s), s;
}
class DomPlatform extends BasePlatform {
  acquireContext(t, e) {
    var i = t && t.getContext && t.getContext("2d");
    return i && i.canvas === t ? (initCanvas(t, e), i) : null;
  }
  releaseContext(t) {
    const i = t.canvas;
    if (!i[EXPANDO_KEY]) return !1;
    const a = i[EXPANDO_KEY].initial,
      e =
        (["height", "width"].forEach((t) => {
          var e = a[t];
          isNullOrUndef(e) ? i.removeAttribute(t) : i.setAttribute(t, e);
        }),
        a.style || {});
    return (
      Object.keys(e).forEach((t) => {
        i.style[t] = e[t];
      }),
      (i.width = i.width),
      delete i[EXPANDO_KEY],
      !0
    );
  }
  addEventListener(t, e, i) {
    this.removeEventListener(t, e);
    const a = t.$proxies || (t.$proxies = {});
    const s =
      {
        attach: createAttachObserver,
        detach: createDetachObserver,
        resize: createResizeObserver,
      }[e] || createProxyAndListen;
    a[e] = s(t, e, i);
  }
  removeEventListener(t, e) {
    const i = t.$proxies || (t.$proxies = {});
    var a = i[e];
    if (a) {
      const s =
        {
          attach: releaseObserver,
          detach: releaseObserver,
          resize: releaseObserver,
        }[e] || removeListener;
      s(t, e, a), (i[e] = void 0);
    }
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, i, a) {
    return getMaximumSize(t, e, i, a);
  }
  isAttached(t) {
    t = _getParentNode(t);
    return !(!t || !t.isConnected);
  }
}
function _detectPlatform(t) {
  return !_isDomSupported() ||
    ("undefined" != typeof OffscreenCanvas && t instanceof OffscreenCanvas)
    ? BasicPlatform
    : DomPlatform;
}
class Element {
  static defaults = {};
  static defaultRoutes = void 0;
  x;
  y;
  active = !1;
  options;
  $animations;
  tooltipPosition(t) {
    var { x: t, y: e } = this.getProps(["x", "y"], t);
    return { x: t, y: e };
  }
  hasValue() {
    return isNumber(this.x) && isNumber(this.y);
  }
  getProps(t, e) {
    const i = this.$animations;
    if (!e || !i) return this;
    const a = {};
    return (
      t.forEach((t) => {
        a[t] = i[t] && i[t].active() ? i[t]._to : this[t];
      }),
      a
    );
  }
}
function autoSkip(i, a) {
  var s = i.options.ticks,
    i = determineMaxTicks(i),
    i = Math.min(s.maxTicksLimit || i, i),
    n = s.major.enabled ? getMajorIndices(a) : [],
    s = n.length,
    r = n[0],
    o = n[s - 1],
    l = [];
  if (i < s) return skipMajors(a, l, n, s / i), l;
  var h = calculateSpacing(n, a, i);
  if (0 < s) {
    let t, e;
    i = 1 < s ? Math.round((o - r) / (s - 1)) : null;
    for (
      skip(a, l, h, isNullOrUndef(i) ? 0 : r - i, r), t = 0, e = s - 1;
      t < e;
      t++
    )
      skip(a, l, h, n[t], n[t + 1]);
    return skip(a, l, h, o, isNullOrUndef(i) ? a.length : o + i), l;
  }
  return skip(a, l, h), l;
}
function determineMaxTicks(t) {
  var e = t.options.offset,
    i = t._tickSize(),
    e = t._length / i + (e ? 0 : 1),
    t = t._maxLength / i;
  return Math.floor(Math.min(e, t));
}
function calculateSpacing(t, e, i) {
  var t = getEvenSpacing(t),
    a = e.length / i;
  if (!t) return Math.max(a, 1);
  var s = _factorize(t);
  for (let t = 0, e = s.length - 1; t < e; t++) {
    var n = s[t];
    if (a < n) return n;
  }
  return Math.max(a, 1);
}
function getMajorIndices(t) {
  const e = [];
  let i, a;
  for (i = 0, a = t.length; i < a; i++) t[i].major && e.push(i);
  return e;
}
function skipMajors(t, e, i, a) {
  let s = 0,
    n = i[0],
    r;
  for (a = Math.ceil(a), r = 0; r < t.length; r++)
    r === n && (e.push(t[r]), s++, (n = i[s * a]));
}
function skip(t, e, i, a, s) {
  var n = valueOrDefault(a, 0),
    r = Math.min(valueOrDefault(s, t.length), t.length);
  let o = 0,
    l,
    h,
    d;
  for (
    i = Math.ceil(i), s && (i = (l = s - a) / Math.floor(l / i)), d = n;
    d < 0;

  )
    o++, (d = Math.round(n + o * i));
  for (h = Math.max(n, 0); h < r; h++)
    h === d && (e.push(t[h]), o++, (d = Math.round(n + o * i)));
}
function getEvenSpacing(t) {
  var e = t.length;
  let i, a;
  if (e < 2) return !1;
  for (a = t[0], i = 1; i < e; ++i) if (t[i] - t[i - 1] !== a) return !1;
  return a;
}
const reverseAlign = (t) =>
    "left" === t ? "right" : "right" === t ? "left" : t,
  offsetFromEdge = (t, e, i) =>
    "top" === e || "left" === e ? t[e] + i : t[e] - i,
  getTicksLimit = (t, e) => Math.min(e || t, t);
function sample(t, e) {
  const i = [];
  var a = t.length / e,
    s = t.length;
  let n = 0;
  for (; n < s; n += a) i.push(t[Math.floor(n)]);
  return i;
}
function getPixelForGridLine(t, e, i) {
  var a = t.ticks.length,
    s = Math.min(e, a - 1),
    n = t._startPixel,
    r = t._endPixel;
  let o = t.getPixelForTick(s),
    l;
  if (
    !(
      i &&
      ((l =
        1 === a
          ? Math.max(o - n, r - o)
          : 0 === e
          ? (t.getPixelForTick(1) - o) / 2
          : (o - t.getPixelForTick(s - 1)) / 2),
      (o += s < e ? l : -l) < n - 1e-6 || o > r + 1e-6)
    )
  )
    return o;
}
function garbageCollect(t, s) {
  each(t, (t) => {
    const e = t.gc;
    var i = e.length / 2;
    let a;
    if (s < i) {
      for (a = 0; a < i; ++a) delete t.data[e[a]];
      e.splice(0, i);
    }
  });
}
function getTickMarkLength(t) {
  return t.drawTicks ? t.tickLength : 0;
}
function getTitleHeight(t, e) {
  if (!t.display) return 0;
  var e = toFont(t.font, e),
    i = toPadding(t.padding);
  return (isArray(t.text) ? t.text.length : 1) * e.lineHeight + i.height;
}
function createScaleContext(t, e) {
  return createContext(t, { scale: e, type: "scale" });
}
function createTickContext(t, e, i) {
  return createContext(t, { tick: i, index: e, type: "tick" });
}
function titleAlign(t, e, i) {
  let a = _toLeftRightCenter(t);
  return (a =
    (i && "right" !== e) || (!i && "right" === e) ? reverseAlign(a) : a);
}
function titleArgs(t, e, i, a) {
  var { top: s, left: n, bottom: r, right: o, chart: l } = t;
  const { chartArea: h, scales: d } = l;
  let c = 0,
    u,
    g,
    p;
  var f,
    m,
    l = r - s,
    v = o - n;
  return (
    t.isHorizontal()
      ? ((g = _alignStartEnd(a, n, o)),
        (p = isObject(i)
          ? ((m = i[(f = Object.keys(i)[0])]), d[f].getPixelForValue(m) + l - e)
          : "center" === i
          ? (h.bottom + h.top) / 2 + l - e
          : offsetFromEdge(t, i, e)),
        (u = o - n))
      : ((g = isObject(i)
          ? ((m = i[(f = Object.keys(i)[0])]), d[f].getPixelForValue(m) - v + e)
          : "center" === i
          ? (h.left + h.right) / 2 - v + e
          : offsetFromEdge(t, i, e)),
        (p = _alignStartEnd(a, r, s)),
        (c = "left" === i ? -HALF_PI : HALF_PI)),
    { titleX: g, titleY: p, maxWidth: u, rotation: c }
  );
}
class Scale extends Element {
  constructor(t) {
    super(),
      (this.id = t.id),
      (this.type = t.type),
      (this.options = void 0),
      (this.ctx = t.ctx),
      (this.chart = t.chart),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
      (this.maxWidth = void 0),
      (this.maxHeight = void 0),
      (this.paddingTop = void 0),
      (this.paddingBottom = void 0),
      (this.paddingLeft = void 0),
      (this.paddingRight = void 0),
      (this.axis = void 0),
      (this.labelRotation = void 0),
      (this.min = void 0),
      (this.max = void 0),
      (this._range = void 0),
      (this.ticks = []),
      (this._gridLineItems = null),
      (this._labelItems = null),
      (this._labelSizes = null),
      (this._length = 0),
      (this._maxLength = 0),
      (this._longestTextCache = {}),
      (this._startPixel = void 0),
      (this._endPixel = void 0),
      (this._reversePixels = !1),
      (this._userMax = void 0),
      (this._userMin = void 0),
      (this._suggestedMax = void 0),
      (this._suggestedMin = void 0),
      (this._ticksLength = 0),
      (this._borderValue = 0),
      (this._cache = {}),
      (this._dataLimitsCached = !1),
      (this.$context = void 0);
  }
  init(t) {
    (this.options = t.setContext(this.getContext())),
      (this.axis = t.axis),
      (this._userMin = this.parse(t.min)),
      (this._userMax = this.parse(t.max)),
      (this._suggestedMin = this.parse(t.suggestedMin)),
      (this._suggestedMax = this.parse(t.suggestedMax));
  }
  parse(t, e) {
    return t;
  }
  getUserBounds() {
    var { _userMin: t, _userMax: e, _suggestedMin: i, _suggestedMax: a } = this,
      t = finiteOrDefault(t, Number.POSITIVE_INFINITY),
      e = finiteOrDefault(e, Number.NEGATIVE_INFINITY),
      i = finiteOrDefault(i, Number.POSITIVE_INFINITY),
      a = finiteOrDefault(a, Number.NEGATIVE_INFINITY);
    return {
      min: finiteOrDefault(t, i),
      max: finiteOrDefault(e, a),
      minDefined: isNumberFinite(t),
      maxDefined: isNumberFinite(e),
    };
  }
  getMinMax(i) {
    let { min: a, max: s, minDefined: n, maxDefined: r } = this.getUserBounds();
    var o;
    if (n && r) return { min: a, max: s };
    const l = this.getMatchingVisibleMetas();
    for (let t = 0, e = l.length; t < e; ++t)
      (o = l[t].controller.getMinMax(this, i)),
        n || (a = Math.min(a, o.min)),
        r || (s = Math.max(s, o.max));
    return (
      (a = r && a > s ? s : a),
      (s = n && a > s ? a : s),
      {
        min: finiteOrDefault(a, finiteOrDefault(s, a)),
        max: finiteOrDefault(s, finiteOrDefault(a, s)),
      }
    );
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0,
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    var t = this.chart.data;
    return (
      this.options.labels ||
      (this.isHorizontal() ? t.xLabels : t.yLabels) ||
      t.labels ||
      []
    );
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    (this._cache = {}), (this._dataLimitsCached = !1);
  }
  beforeUpdate() {
    callback(this.options.beforeUpdate, [this]);
  }
  update(t, e, i) {
    var { beginAtZero: a, grace: s, ticks: n } = this.options,
      r = n.sampleSize,
      t =
        (this.beforeUpdate(),
        (this.maxWidth = t),
        (this.maxHeight = e),
        (this._margins = i =
          Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, i)),
        (this.ticks = null),
        (this._labelSizes = null),
        (this._gridLineItems = null),
        (this._labelItems = null),
        this.beforeSetDimensions(),
        this.setDimensions(),
        this.afterSetDimensions(),
        (this._maxLength = this.isHorizontal()
          ? this.width + i.left + i.right
          : this.height + i.top + i.bottom),
        this._dataLimitsCached ||
          (this.beforeDataLimits(),
          this.determineDataLimits(),
          this.afterDataLimits(),
          (this._range = _addGrace(this, s, a)),
          (this._dataLimitsCached = !0)),
        this.beforeBuildTicks(),
        (this.ticks = this.buildTicks() || []),
        this.afterBuildTicks(),
        r < this.ticks.length);
    this._convertTicksToLabels(t ? sample(this.ticks, r) : this.ticks),
      this.configure(),
      this.beforeCalculateLabelRotation(),
      this.calculateLabelRotation(),
      this.afterCalculateLabelRotation(),
      n.display &&
        (n.autoSkip || "auto" === n.source) &&
        ((this.ticks = autoSkip(this, this.ticks)),
        (this._labelSizes = null),
        this.afterAutoSkip()),
      t && this._convertTicksToLabels(this.ticks),
      this.beforeFit(),
      this.fit(),
      this.afterFit(),
      this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse,
      e,
      i;
    this.isHorizontal()
      ? ((e = this.left), (i = this.right))
      : ((e = this.top), (i = this.bottom), (t = !t)),
      (this._startPixel = e),
      (this._endPixel = i),
      (this._reversePixels = t),
      (this._length = i - e),
      (this._alignToPixels = this.options.alignToPixels);
  }
  afterUpdate() {
    callback(this.options.afterUpdate, [this]);
  }
  beforeSetDimensions() {
    callback(this.options.beforeSetDimensions, [this]);
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth),
        (this.left = 0),
        (this.right = this.width))
      : ((this.height = this.maxHeight),
        (this.top = 0),
        (this.bottom = this.height)),
      (this.paddingLeft = 0),
      (this.paddingTop = 0),
      (this.paddingRight = 0),
      (this.paddingBottom = 0);
  }
  afterSetDimensions() {
    callback(this.options.afterSetDimensions, [this]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()),
      callback(this.options[t], [this]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {}
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    callback(this.options.beforeTickToLabelConversion, [this]);
  }
  generateTickLabels(t) {
    var e = this.options.ticks;
    let i, a, s;
    for (i = 0, a = t.length; i < a; i++)
      (s = t[i]).label = callback(e.callback, [s.value, i, t], this);
  }
  afterTickToLabelConversion() {
    callback(this.options.afterTickToLabelConversion, [this]);
  }
  beforeCalculateLabelRotation() {
    callback(this.options.beforeCalculateLabelRotation, [this]);
  }
  calculateLabelRotation() {
    var t,
      e,
      i,
      a,
      s = this.options,
      n = s.ticks,
      r = getTicksLimit(this.ticks.length, s.ticks.maxTicksLimit),
      o = n.minRotation || 0,
      l = n.maxRotation;
    let h = o;
    !this._isVisible() || !n.display || l <= o || r <= 1 || !this.isHorizontal()
      ? (this.labelRotation = o)
      : ((e = (t = this._getLabelSizes()).widest.width),
        (i = t.highest.height),
        (a = _limitValue(this.chart.width - e, 0, this.maxWidth)),
        (s.offset ? this.maxWidth / r : a / (r - 1)) < e + 6 &&
          ((a = a / (r - (s.offset ? 0.5 : 1))),
          (r =
            this.maxHeight -
            getTickMarkLength(s.grid) -
            n.padding -
            getTitleHeight(s.title, this.chart.options.font)),
          (n = Math.sqrt(e * e + i * i)),
          (h = toDegrees(
            Math.min(
              Math.asin(_limitValue((t.highest.height + 6) / a, -1, 1)),
              Math.asin(_limitValue(r / n, -1, 1)) -
                Math.asin(_limitValue(i / n, -1, 1))
            )
          )),
          (h = Math.max(o, Math.min(l, h)))),
        (this.labelRotation = h));
  }
  afterCalculateLabelRotation() {
    callback(this.options.afterCalculateLabelRotation, [this]);
  }
  afterAutoSkip() {}
  beforeFit() {
    callback(this.options.beforeFit, [this]);
  }
  fit() {
    const t = { width: 0, height: 0 };
    var e,
      i,
      a,
      s,
      n,
      {
        chart: r,
        options: { ticks: o, title: l, grid: h },
      } = this,
      d = this._isVisible(),
      c = this.isHorizontal();
    d &&
      ((d = getTitleHeight(l, r.options.font)),
      c
        ? ((t.width = this.maxWidth), (t.height = getTickMarkLength(h) + d))
        : ((t.height = this.maxHeight), (t.width = getTickMarkLength(h) + d)),
      o.display &&
        this.ticks.length &&
        (({ first: l, last: h, widest: d, highest: e } = this._getLabelSizes()),
        (i = 2 * o.padding),
        (s = toRadians(this.labelRotation)),
        (a = Math.cos(s)),
        (s = Math.sin(s)),
        c
          ? ((n = o.mirror ? 0 : s * d.width + a * e.height),
            (t.height = Math.min(this.maxHeight, t.height + n + i)))
          : ((n = o.mirror ? 0 : a * d.width + s * e.height),
            (t.width = Math.min(this.maxWidth, t.width + n + i))),
        this._calculatePadding(l, h, s, a))),
      this._handleMargins(),
      c
        ? ((this.width = this._length =
            r.width - this._margins.left - this._margins.right),
          (this.height = t.height))
        : ((this.width = t.width),
          (this.height = this._length =
            r.height - this._margins.top - this._margins.bottom));
  }
  _calculatePadding(i, a, s, n) {
    var {
        ticks: { align: r, padding: o },
        position: l,
      } = this.options,
      h = 0 !== this.labelRotation,
      l = "top" !== l && "x" === this.axis;
    if (this.isHorizontal()) {
      var d = this.getPixelForTick(0) - this.left,
        c = this.right - this.getPixelForTick(this.ticks.length - 1);
      let t = 0,
        e = 0;
      h
        ? (e = l
            ? ((t = n * i.width), s * a.height)
            : ((t = s * i.height), n * a.width))
        : "start" === r
        ? (e = a.width)
        : "end" === r
        ? (t = i.width)
        : "inner" !== r && ((t = i.width / 2), (e = a.width / 2)),
        (this.paddingLeft = Math.max(
          ((t - d + o) * this.width) / (this.width - d),
          0
        )),
        (this.paddingRight = Math.max(
          ((e - c + o) * this.width) / (this.width - c),
          0
        ));
    } else {
      let t = a.height / 2,
        e = i.height / 2;
      "start" === r
        ? ((t = 0), (e = i.height))
        : "end" === r && ((t = a.height), (e = 0)),
        (this.paddingTop = t + o),
        (this.paddingBottom = e + o);
    }
  }
  _handleMargins() {
    this._margins &&
      ((this._margins.left = Math.max(this.paddingLeft, this._margins.left)),
      (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
      (this._margins.right = Math.max(this.paddingRight, this._margins.right)),
      (this._margins.bottom = Math.max(
        this.paddingBottom,
        this._margins.bottom
      )));
  }
  afterFit() {
    callback(this.options.afterFit, [this]);
  }
  isHorizontal() {
    var { axis: t, position: e } = this.options;
    return "top" === e || "bottom" === e || "x" === t;
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let e, i;
    for (e = 0, i = t.length; e < i; e++)
      isNullOrUndef(t[e].label) && (t.splice(e, 1), i--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let e = this._labelSizes;
    if (!e) {
      var i = this.options.ticks.sampleSize;
      let t = this.ticks;
      i < t.length && (t = sample(t, i)),
        (this._labelSizes = e =
          this._computeLabelSizes(
            t,
            t.length,
            this.options.ticks.maxTicksLimit
          ));
    }
    return e;
  }
  _computeLabelSizes(t, e, i) {
    const { ctx: a, _longestTextCache: s } = this,
      n = [],
      r = [];
    var o = Math.floor(e / getTicksLimit(e, i));
    let l = 0,
      h = 0,
      d,
      c,
      u,
      g,
      p,
      f,
      m,
      v,
      x,
      b,
      _;
    for (d = 0; d < e; d += o) {
      if (
        ((g = t[d].label),
        (p = this._resolveTickFontOptions(d)),
        (a.font = f = p.string),
        (m = s[f] = s[f] || { data: {}, gc: [] }),
        (v = p.lineHeight),
        (x = b = 0),
        isNullOrUndef(g) || isArray(g))
      ) {
        if (isArray(g))
          for (c = 0, u = g.length; c < u; ++c)
            (_ = g[c]),
              isNullOrUndef(_) ||
                isArray(_) ||
                ((x = _measureText(a, m.data, m.gc, x, _)), (b += v));
      } else (x = _measureText(a, m.data, m.gc, x, g)), (b = v);
      n.push(x), r.push(b), (l = Math.max(x, l)), (h = Math.max(b, h));
    }
    garbageCollect(s, e);
    var i = n.indexOf(l),
      y = r.indexOf(h),
      k = (t) => ({ width: n[t] || 0, height: r[t] || 0 });
    return {
      first: k(0),
      last: k(e - 1),
      widest: k(i),
      highest: k(y),
      widths: n,
      heights: r,
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, e) {
    return NaN;
  }
  getValueForPixel(t) {}
  getPixelForTick(t) {
    var e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    t = this._startPixel + t * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, t, 0) : t);
  }
  getDecimalForPixel(t) {
    t = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - t : t;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    var { min: t, max: e } = this;
    return t < 0 && e < 0 ? e : 0 < t && 0 < e ? t : 0;
  }
  getContext(t) {
    var e = this.ticks || [];
    if (0 <= t && t < e.length) {
      const i = e[t];
      return (
        i.$context || (i.$context = createTickContext(this.getContext(), t, i))
      );
    }
    return (
      this.$context ||
      (this.$context = createScaleContext(this.chart.getContext(), this))
    );
  }
  _tickSize() {
    var t = this.options.ticks,
      e = toRadians(this.labelRotation),
      i = Math.abs(Math.cos(e)),
      e = Math.abs(Math.sin(e)),
      a = this._getLabelSizes(),
      t = t.autoSkipPadding || 0,
      s = a ? a.widest.width + t : 0,
      a = a ? a.highest.height + t : 0;
    return this.isHorizontal()
      ? s * e < a * i
        ? s / i
        : a / e
      : a * e < s * i
      ? a / i
      : s / e;
  }
  _isVisible() {
    var t = this.options.display;
    return "auto" !== t ? !!t : 0 < this.getMatchingVisibleMetas().length;
  }
  _computeGridLineItems(t) {
    var e = this.axis;
    const i = this.chart;
    var a = this.options;
    const { grid: s, position: n, border: r } = a;
    var o = s.offset,
      l = this.isHorizontal(),
      h = this.ticks.length + (o ? 1 : 0),
      d = getTickMarkLength(s);
    const c = [];
    var u = r.setContext(this.getContext());
    const g = u.display ? u.width : 0;
    function p(t) {
      return _alignPixel(i, t, g);
    }
    var f,
      m,
      u = g / 2;
    let v, x, b, _, y, k, S, D, M, P, w, A;
    "top" === n
      ? ((v = p(this.bottom)),
        (k = this.bottom - d),
        (D = v - u),
        (P = p(t.top) + u),
        (A = t.bottom))
      : "bottom" === n
      ? ((v = p(this.top)),
        (P = t.top),
        (A = p(t.bottom) - u),
        (k = v + u),
        (D = this.top + d))
      : "left" === n
      ? ((v = p(this.right)),
        (y = this.right - d),
        (S = v - u),
        (M = p(t.left) + u),
        (w = t.right))
      : "right" === n
      ? ((v = p(this.left)),
        (M = t.left),
        (w = p(t.right) - u),
        (y = v + u),
        (S = this.left + d))
      : "x" === e
      ? ("center" === n
          ? (v = p((t.top + t.bottom) / 2 + 0.5))
          : isObject(n) &&
            ((m = n[(f = Object.keys(n)[0])]),
            (v = p(this.chart.scales[f].getPixelForValue(m)))),
        (P = t.top),
        (A = t.bottom),
        (k = v + u),
        (D = k + d))
      : "y" === e &&
        ("center" === n
          ? (v = p((t.left + t.right) / 2))
          : isObject(n) &&
            ((m = n[(f = Object.keys(n)[0])]),
            (v = p(this.chart.scales[f].getPixelForValue(m)))),
        (y = v - u),
        (S = y - d),
        (M = t.left),
        (w = t.right));
    var e = valueOrDefault(a.ticks.maxTicksLimit, h),
      C = Math.max(1, Math.ceil(h / e));
    for (x = 0; x < h; x += C) {
      var O = this.getContext(x),
        L = s.setContext(O),
        O = r.setContext(O),
        T = L.lineWidth,
        E = L.color,
        I = O.dash || [],
        O = O.dashOffset,
        R = L.tickWidth,
        F = L.tickColor,
        B = L.tickBorderDash || [],
        L = L.tickBorderDashOffset;
      void 0 !== (b = getPixelForGridLine(this, x, o)) &&
        ((_ = _alignPixel(i, b, T)),
        l ? (y = S = M = w = _) : (k = D = P = A = _),
        c.push({
          tx1: y,
          ty1: k,
          tx2: S,
          ty2: D,
          x1: M,
          y1: P,
          x2: w,
          y2: A,
          width: T,
          color: E,
          borderDash: I,
          borderDashOffset: O,
          tickWidth: R,
          tickColor: F,
          tickBorderDash: B,
          tickBorderDashOffset: L,
        }));
    }
    return (this._ticksLength = h), (this._borderValue = v), c;
  }
  _computeLabelItems(t) {
    var e = this.axis,
      i = this.options;
    const { position: a, ticks: s } = i;
    var n,
      r = this.isHorizontal(),
      o = this.ticks,
      { align: l, crossAlign: h, padding: d, mirror: c } = s,
      i = getTickMarkLength(i.grid),
      u = i + d,
      d = c ? -d : u,
      g = -toRadians(this.labelRotation);
    const p = [];
    let f,
      m,
      v,
      x,
      b,
      _,
      y,
      k,
      S,
      D,
      M,
      P = "middle";
    "top" === a
      ? ((b = this.bottom - d), (_ = this._getXAxisLabelAlignment()))
      : "bottom" === a
      ? ((b = this.top + d), (_ = this._getXAxisLabelAlignment()))
      : "left" === a
      ? ((d = this._getYAxisLabelAlignment(i)), (_ = d.textAlign), (x = d.x))
      : "right" === a
      ? ((d = this._getYAxisLabelAlignment(i)), (_ = d.textAlign), (x = d.x))
      : "x" === e
      ? ("center" === a
          ? (b = (t.top + t.bottom) / 2 + u)
          : isObject(a) &&
            ((n = a[(d = Object.keys(a)[0])]),
            (b = this.chart.scales[d].getPixelForValue(n) + u)),
        (_ = this._getXAxisLabelAlignment()))
      : "y" === e &&
        ("center" === a
          ? (x = (t.left + t.right) / 2 - u)
          : isObject(a) &&
            ((n = a[(d = Object.keys(a)[0])]),
            (x = this.chart.scales[d].getPixelForValue(n))),
        (_ = this._getYAxisLabelAlignment(i).textAlign)),
      "y" === e &&
        ("start" === l ? (P = "top") : "end" === l && (P = "bottom"));
    var w = this._getLabelSizes();
    for (f = 0, m = o.length; f < m; ++f) {
      v = o[f].label;
      var A = s.setContext(this.getContext(f)),
        C =
          ((y = this.getPixelForTick(f) + s.labelOffset),
          (S = (k = this._resolveTickFontOptions(f)).lineHeight),
          (D = isArray(v) ? v.length : 1) / 2),
        O = A.color,
        L = A.textStrokeColor,
        T = A.textStrokeWidth;
      let t = _;
      r
        ? ((x = y),
          "inner" === _ &&
            (t =
              f === m - 1
                ? this.options.reverse
                  ? "left"
                  : "right"
                : 0 === f
                ? this.options.reverse
                  ? "right"
                  : "left"
                : "center"),
          (M =
            "top" === a
              ? "near" === h || 0 != g
                ? -D * S + S / 2
                : "center" === h
                ? -w.highest.height / 2 - C * S + S
                : -w.highest.height + S / 2
              : "near" === h || 0 != g
              ? S / 2
              : "center" === h
              ? w.highest.height / 2 - C * S
              : w.highest.height - D * S),
          c && (M *= -1),
          0 == g || A.showLabelBackdrop || (x += (S / 2) * Math.sin(g)))
        : ((b = y), (M = ((1 - D) * S) / 2));
      let i;
      if (A.showLabelBackdrop) {
        var C = toPadding(A.backdropPadding),
          E = w.heights[f],
          I = w.widths[f];
        let t = M - C.top,
          e = 0 - C.left;
        switch (P) {
          case "middle":
            t -= E / 2;
            break;
          case "bottom":
            t -= E;
        }
        switch (_) {
          case "center":
            e -= I / 2;
            break;
          case "right":
            e -= I;
        }
        i = {
          left: e,
          top: t,
          width: I + C.width,
          height: E + C.height,
          color: A.backdropColor,
        };
      }
      p.push({
        label: v,
        font: k,
        textOffset: M,
        options: {
          rotation: g,
          color: O,
          strokeColor: L,
          strokeWidth: T,
          textAlign: t,
          textBaseline: P,
          translation: [x, b],
          backdrop: i,
        },
      });
    }
    return p;
  }
  _getXAxisLabelAlignment() {
    var { position: t, ticks: e } = this.options;
    if (-toRadians(this.labelRotation)) return "top" === t ? "left" : "right";
    let i = "center";
    return (
      "start" === e.align
        ? (i = "left")
        : "end" === e.align
        ? (i = "right")
        : "inner" === e.align && (i = "inner"),
      i
    );
  }
  _getYAxisLabelAlignment(t) {
    var {
        position: e,
        ticks: { crossAlign: i, mirror: a, padding: s },
      } = this.options,
      t = t + s,
      n = this._getLabelSizes().widest.width;
    let r, o;
    return (
      "left" === e
        ? a
          ? ((o = this.right + s),
            "near" === i
              ? (r = "left")
              : "center" === i
              ? ((r = "center"), (o += n / 2))
              : ((r = "right"), (o += n)))
          : ((o = this.right - t),
            "near" === i
              ? (r = "right")
              : "center" === i
              ? ((r = "center"), (o -= n / 2))
              : ((r = "left"), (o = this.left)))
        : "right" === e
        ? a
          ? ((o = this.left + s),
            "near" === i
              ? (r = "right")
              : "center" === i
              ? ((r = "center"), (o -= n / 2))
              : ((r = "left"), (o -= n)))
          : ((o = this.left + t),
            "near" === i
              ? (r = "left")
              : "center" === i
              ? ((r = "center"), (o += n / 2))
              : ((r = "right"), (o = this.right)))
        : (r = "right"),
      { textAlign: r, x: o }
    );
  }
  _computeLabelArea() {
    var t, e;
    if (!this.options.ticks.mirror)
      return (
        (t = this.chart),
        (e = this.options.position),
        "left" === e || "right" === e
          ? { top: 0, left: this.left, bottom: t.height, right: this.right }
          : "top" === e || "bottom" === e
          ? { top: this.top, left: 0, bottom: this.bottom, right: t.width }
          : void 0
      );
  }
  drawBackground() {
    const {
      ctx: t,
      options: { backgroundColor: e },
      left: i,
      top: a,
      width: s,
      height: n,
    } = this;
    e && (t.save(), (t.fillStyle = e), t.fillRect(i, a, s, n), t.restore());
  }
  getLineWidthForValue(e) {
    const t = this.options.grid;
    if (!this._isVisible() || !t.display) return 0;
    const i = this.ticks;
    var a = i.findIndex((t) => t.value === e);
    return 0 <= a ? t.setContext(this.getContext(a)).lineWidth : 0;
  }
  drawGrid(t) {
    var e = this.options.grid;
    const a = this.ctx;
    var i =
      this._gridLineItems ||
      (this._gridLineItems = this._computeGridLineItems(t));
    let s, n;
    var r = (t, e, i) => {
      i.width &&
        i.color &&
        (a.save(),
        (a.lineWidth = i.width),
        (a.strokeStyle = i.color),
        a.setLineDash(i.borderDash || []),
        (a.lineDashOffset = i.borderDashOffset),
        a.beginPath(),
        a.moveTo(t.x, t.y),
        a.lineTo(e.x, e.y),
        a.stroke(),
        a.restore());
    };
    if (e.display)
      for (s = 0, n = i.length; s < n; ++s) {
        var o = i[s];
        e.drawOnChartArea && r({ x: o.x1, y: o.y1 }, { x: o.x2, y: o.y2 }, o),
          e.drawTicks &&
            r(
              { x: o.tx1, y: o.ty1 },
              { x: o.tx2, y: o.ty2 },
              {
                color: o.tickColor,
                width: o.tickWidth,
                borderDash: o.tickBorderDash,
                borderDashOffset: o.tickBorderDashOffset,
              }
            );
      }
  }
  drawBorder() {
    const {
      chart: s,
      ctx: n,
      options: { border: t, grid: r },
    } = this;
    var o = t.setContext(this.getContext()),
      l = t.display ? o.width : 0;
    if (l) {
      var h = r.setContext(this.getContext(0)).lineWidth,
        d = this._borderValue;
      let t, e, i, a;
      this.isHorizontal()
        ? ((t = _alignPixel(s, this.left, l) - l / 2),
          (e = _alignPixel(s, this.right, h) + h / 2),
          (i = a = d))
        : ((i = _alignPixel(s, this.top, l) - l / 2),
          (a = _alignPixel(s, this.bottom, h) + h / 2),
          (t = e = d)),
        n.save(),
        (n.lineWidth = o.width),
        (n.strokeStyle = o.color),
        n.beginPath(),
        n.moveTo(t, i),
        n.lineTo(e, a),
        n.stroke(),
        n.restore();
    }
  }
  drawLabels(t) {
    if (this.options.ticks.display) {
      var e = this.ctx,
        i = this._computeLabelArea(),
        t = (i && clipArea(e, i), this.getLabelItems(t));
      for (const o of t) {
        var a = o.options,
          s = o.font,
          n = o.label,
          r = o.textOffset;
        renderText(e, n, 0, r, s, a);
      }
      i && unclipArea(e);
    }
  }
  drawTitle() {
    var {
      ctx: e,
      options: { position: i, title: a, reverse: s },
    } = this;
    if (a.display) {
      var n = toFont(a.font),
        r = toPadding(a.padding),
        o = a.align;
      let t = n.lineHeight / 2;
      "bottom" === i || "center" === i || isObject(i)
        ? ((t += r.bottom),
          isArray(a.text) && (t += n.lineHeight * (a.text.length - 1)))
        : (t += r.top);
      var {
        titleX: r,
        titleY: l,
        maxWidth: h,
        rotation: d,
      } = titleArgs(this, t, i, o);
      renderText(e, a.text, 0, 0, n, {
        color: a.color,
        maxWidth: h,
        rotation: d,
        textAlign: titleAlign(o, i, s),
        textBaseline: "middle",
        translation: [r, l],
      });
    }
  }
  draw(t) {
    this._isVisible() &&
      (this.drawBackground(),
      this.drawGrid(t),
      this.drawBorder(),
      this.drawTitle(),
      this.drawLabels(t));
  }
  _layers() {
    var t = this.options,
      e = (t.ticks && t.ticks.z) || 0,
      i = valueOrDefault(t.grid && t.grid.z, -1),
      t = valueOrDefault(t.border && t.border.z, 0);
    return this._isVisible() && this.draw === Scale.prototype.draw
      ? [
          {
            z: i,
            draw: (t) => {
              this.drawBackground(), this.drawGrid(t), this.drawTitle();
            },
          },
          {
            z: t,
            draw: () => {
              this.drawBorder();
            },
          },
          {
            z: e,
            draw: (t) => {
              this.drawLabels(t);
            },
          },
        ]
      : [
          {
            z: e,
            draw: (t) => {
              this.draw(t);
            },
          },
        ];
  }
  getMatchingVisibleMetas(t) {
    var e = this.chart.getSortedVisibleDatasetMetas(),
      i = this.axis + "AxisID";
    const a = [];
    let s, n;
    for (s = 0, n = e.length; s < n; ++s) {
      var r = e[s];
      r[i] !== this.id || (t && r.type !== t) || a.push(r);
    }
    return a;
  }
  _resolveTickFontOptions(t) {
    t = this.options.ticks.setContext(this.getContext(t));
    return toFont(t.font);
  }
  _maxDigits() {
    var t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class TypedRegistry {
  constructor(t, e, i) {
    (this.type = t),
      (this.scope = e),
      (this.override = i),
      (this.items = Object.create(null));
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(
      this.type.prototype,
      t.prototype
    );
  }
  register(t) {
    var e = Object.getPrototypeOf(t);
    let i;
    isIChartComponent(e) && (i = this.register(e));
    const a = this.items;
    var e = t.id,
      s = this.scope + "." + e;
    if (e)
      return (
        e in a ||
          (registerDefaults((a[e] = t), s, i),
          this.override && defaults.override(t.id, t.overrides)),
        s
      );
    throw new Error("class does not have id: " + t);
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items;
    var t = t.id,
      i = this.scope;
    t in e && delete e[t],
      i &&
        t in defaults[i] &&
        (delete defaults[i][t], this.override && delete overrides[t]);
  }
}
function registerDefaults(t, e, i) {
  i = merge(Object.create(null), [
    i ? defaults.get(i) : {},
    defaults.get(e),
    t.defaults,
  ]);
  defaults.set(e, i),
    t.defaultRoutes && routeDefaults(e, t.defaultRoutes),
    t.descriptors && defaults.describe(e, t.descriptors);
}
function routeDefaults(r, o) {
  Object.keys(o).forEach((t) => {
    const e = t.split(".");
    var i = e.pop(),
      a = [r].concat(e).join(".");
    const s = o[t].split(".");
    var t = s.pop(),
      n = s.join(".");
    defaults.route(a, i, n, t);
  });
}
function isIChartComponent(t) {
  return "id" in t && "defaults" in t;
}
class Registry {
  constructor() {
    (this.controllers = new TypedRegistry(DatasetController, "datasets", !0)),
      (this.elements = new TypedRegistry(Element, "elements")),
      (this.plugins = new TypedRegistry(Object, "plugins")),
      (this.scales = new TypedRegistry(Scale, "scales")),
      (this._typedRegistries = [this.controllers, this.scales, this.elements]);
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(i, t, a) {
    [...t].forEach((t) => {
      const e = a || this._getRegistryForType(t);
      a || e.isForType(t) || (e === this.plugins && t.id)
        ? this._exec(i, e, t)
        : each(t, (t) => {
            var e = a || this._getRegistryForType(t);
            this._exec(i, e, t);
          });
    });
  }
  _exec(t, e, i) {
    var a = _capitalize(t);
    callback(i["before" + a], [], i), e[t](i), callback(i["after" + a], [], i);
  }
  _getRegistryForType(e) {
    for (let t = 0; t < this._typedRegistries.length; t++) {
      const i = this._typedRegistries[t];
      if (i.isForType(e)) return i;
    }
    return this.plugins;
  }
  _get(t, e, i) {
    e = e.get(t);
    if (void 0 === e)
      throw new Error('"' + t + '" is not a registered ' + i + ".");
    return e;
  }
}
var registry = new Registry();
class PluginService {
  constructor() {
    this._init = [];
  }
  notify(t, e, i, a) {
    "beforeInit" === e &&
      ((this._init = this._createDescriptors(t, !0)),
      this._notify(this._init, t, "install"));
    (a = a ? this._descriptors(t).filter(a) : this._descriptors(t)),
      (i = this._notify(a, t, e, i));
    return (
      "afterDestroy" === e &&
        (this._notify(a, t, "stop"), this._notify(this._init, t, "uninstall")),
      i
    );
  }
  _notify(t, e, i, a) {
    a = a || {};
    for (const o of t) {
      var s = o.plugin,
        n = s[i],
        r = [e, a, o.options];
      if (!1 === callback(n, r, s) && a.cancelable) return !1;
    }
    return !0;
  }
  invalidate() {
    isNullOrUndef(this._cache) ||
      ((this._oldCache = this._cache), (this._cache = void 0));
  }
  _descriptors(t) {
    if (this._cache) return this._cache;
    var e = (this._cache = this._createDescriptors(t));
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    var i = t && t.config,
      a = valueOrDefault(i.options && i.options.plugins, {}),
      i = allPlugins(i);
    return !1 !== a || e ? createDescriptors(t, i, a, e) : [];
  }
  _notifyStateChanges(t) {
    var e = this._oldCache || [],
      i = this._cache,
      a = (t, i) =>
        t.filter((e) => !i.some((t) => e.plugin.id === t.plugin.id));
    this._notify(a(e, i), t, "stop"), this._notify(a(i, e), t, "start");
  }
}
function allPlugins(t) {
  const e = {},
    i = [];
  var a = Object.keys(registry.plugins.items);
  for (let t = 0; t < a.length; t++) i.push(registry.getPlugin(a[t]));
  var s = t.plugins || [];
  for (let t = 0; t < s.length; t++) {
    var n = s[t];
    -1 === i.indexOf(n) && (i.push(n), (e[n.id] = !0));
  }
  return { plugins: i, localIds: e };
}
function getOpts(t, e) {
  return e || !1 !== t ? (!0 === t ? {} : t) : null;
}
function createDescriptors(t, { plugins: e, localIds: i }, a, s) {
  const n = [];
  var r = t.getContext();
  for (const h of e) {
    var o = h.id,
      l = getOpts(a[o], s);
    null !== l &&
      n.push({
        plugin: h,
        options: pluginOpts(t.config, { plugin: h, local: i[o] }, l, r),
      });
  }
  return n;
}
function pluginOpts(t, { plugin: e, local: i }, a, s) {
  var n = t.pluginScopeKeys(e);
  const r = t.getOptionScopes(a, n);
  return (
    i && e.defaults && r.push(e.defaults),
    t.createResolver(r, s, [""], { scriptable: !1, indexable: !1, allKeys: !0 })
  );
}
function getIndexAxis(t, e) {
  var i = defaults.datasets[t] || {};
  return (
    ((e.datasets || {})[t] || {}).indexAxis || e.indexAxis || i.indexAxis || "x"
  );
}
function getAxisFromDefaultScaleID(t, e) {
  let i = t;
  return (
    "_index_" === t ? (i = e) : "_value_" === t && (i = "x" === e ? "y" : "x"),
    i
  );
}
function getDefaultScaleIDFromAxis(t, e) {
  return t === e ? "_index_" : "_value_";
}
function idMatchesAxis(t) {
  if ("x" === t || "y" === t || "r" === t) return t;
}
function axisFromPosition(t) {
  return "top" === t || "bottom" === t
    ? "x"
    : "left" === t || "right" === t
    ? "y"
    : void 0;
}
function determineAxis(t, ...e) {
  if (idMatchesAxis(t)) return t;
  for (const a of e) {
    var i =
      a.axis ||
      axisFromPosition(a.position) ||
      (1 < t.length && idMatchesAxis(t[0].toLowerCase()));
    if (i) return i;
  }
  throw new Error(
    `Cannot determine type of '${t}' axis. Please provide 'axis' or 'position' option.`
  );
}
function getAxisFromDataset(t, e, i) {
  if (i[e + "AxisID"] === t) return { axis: e };
}
function retrieveAxisFromDatasets(e, t) {
  if (t.data && t.data.datasets) {
    t = t.data.datasets.filter((t) => t.xAxisID === e || t.yAxisID === e);
    if (t.length)
      return (
        getAxisFromDataset(e, "x", t[0]) || getAxisFromDataset(e, "y", t[0])
      );
  }
  return {};
}
function mergeScaleConfig(r, e) {
  const n = overrides[r.type] || { scales: {} },
    o = e.scales || {},
    l = getIndexAxis(r.type, e),
    h = Object.create(null);
  return (
    Object.keys(o).forEach((t) => {
      var e = o[t];
      if (!isObject(e))
        return console.error("Invalid scale configuration for scale: " + t);
      if (e._proxy)
        return console.warn(
          "Ignoring resolver passed as options for scale: " + t
        );
      var i = determineAxis(
          t,
          e,
          retrieveAxisFromDatasets(t, r),
          defaults.scales[e.type]
        ),
        a = getDefaultScaleIDFromAxis(i, l),
        s = n.scales || {};
      h[t] = mergeIf(Object.create(null), [{ axis: i }, e, s[i], s[a]]);
    }),
    r.data.datasets.forEach((a) => {
      var t = a.type || r.type;
      const s = a.indexAxis || getIndexAxis(t, e),
        n = (overrides[t] || {}).scales || {};
      Object.keys(n).forEach((t) => {
        var e = getAxisFromDefaultScaleID(t, s),
          i = a[e + "AxisID"] || e;
        (h[i] = h[i] || Object.create(null)),
          mergeIf(h[i], [{ axis: e }, o[i], n[t]]);
      });
    }),
    Object.keys(h).forEach((t) => {
      t = h[t];
      mergeIf(t, [defaults.scales[t.type], defaults.scale]);
    }),
    h
  );
}
function initOptions(t) {
  const e = t.options || (t.options = {});
  (e.plugins = valueOrDefault(e.plugins, {})),
    (e.scales = mergeScaleConfig(t, e));
}
function initData(t) {
  return (
    ((t = t || {}).datasets = t.datasets || []), (t.labels = t.labels || []), t
  );
}
function initConfig(t) {
  return ((t = t || {}).data = initData(t.data)), initOptions(t), t;
}
const keyCache = new Map(),
  keysCached = new Set();
function cachedKeys(t, e) {
  let i = keyCache.get(t);
  return i || ((i = e()), keyCache.set(t, i), keysCached.add(i)), i;
}
const addIfFound = (t, e, i) => {
  e = resolveObjectKey(e, i);
  void 0 !== e && t.add(e);
};
class Config {
  constructor(t) {
    (this._config = initConfig(t)),
      (this._scopeCache = new Map()),
      (this._resolverCache = new Map());
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = initData(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    var t = this._config;
    this.clearCache(), initOptions(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return cachedKeys(t, () => [["datasets." + t, ""]]);
  }
  datasetAnimationScopeKeys(t, e) {
    return cachedKeys(t + ".transition." + e, () => [
      [`datasets.${t}.transitions.` + e, "transitions." + e],
      ["datasets." + t, ""],
    ]);
  }
  datasetElementScopeKeys(t, e) {
    return cachedKeys(t + "-" + e, () => [
      [`datasets.${t}.elements.` + e, "datasets." + t, "elements." + e, ""],
    ]);
  }
  pluginScopeKeys(t) {
    const e = t.id;
    return cachedKeys(this.type + "-plugin-" + e, () => [
      ["plugins." + e, ...(t.additionalOptionScopes || [])],
    ]);
  }
  _cachedScopes(t, e) {
    const i = this._scopeCache;
    let a = i.get(t);
    return (a && !e) || ((a = new Map()), i.set(t, a)), a;
  }
  getOptionScopes(e, t, i) {
    const { options: a, type: s } = this,
      n = this._cachedScopes(e, i);
    i = n.get(t);
    if (i) return i;
    const r = new Set(),
      o =
        (t.forEach((t) => {
          e && (r.add(e), t.forEach((t) => addIfFound(r, e, t))),
            t.forEach((t) => addIfFound(r, a, t)),
            t.forEach((t) => addIfFound(r, overrides[s] || {}, t)),
            t.forEach((t) => addIfFound(r, defaults, t)),
            t.forEach((t) => addIfFound(r, descriptors, t));
        }),
        Array.from(r));
    return (
      0 === o.length && o.push(Object.create(null)),
      keysCached.has(t) && n.set(t, o),
      o
    );
  }
  chartOptionScopes() {
    var { options: t, type: e } = this;
    return [
      t,
      overrides[e] || {},
      defaults.datasets[e] || {},
      { type: e },
      defaults,
      descriptors,
    ];
  }
  resolveNamedOptions(t, e, i, a = [""]) {
    const s = { $shared: !0 };
    var { resolver: a, subPrefixes: n } = getResolver(
      this._resolverCache,
      t,
      a
    );
    let r = a;
    needContext(a, e) &&
      ((s.$shared = !1),
      (i = isFunction(i) ? i() : i),
      (t = this.createResolver(t, i, n)),
      (r = _attachContext(a, i, t)));
    for (const o of e) s[o] = r[o];
    return s;
  }
  createResolver(t, e, i = [""], a) {
    t = getResolver(this._resolverCache, t, i).resolver;
    return isObject(e) ? _attachContext(t, e, void 0, a) : t;
  }
}
function getResolver(t, e, i) {
  let a = t.get(e);
  a || ((a = new Map()), t.set(e, a));
  t = i.join();
  let s = a.get(t);
  return (
    s ||
      ((e = _createResolver(e, i)),
      (s = {
        resolver: e,
        subPrefixes: i.filter((t) => !t.toLowerCase().includes("hover")),
      }),
      a.set(t, s)),
    s
  );
}
const hasFunction = (i) =>
  isObject(i) &&
  Object.getOwnPropertyNames(i).reduce((t, e) => t || isFunction(i[e]), !1);
function needContext(t, e) {
  const { isScriptable: i, isIndexable: a } = _descriptors(t);
  for (const o of e) {
    var s = i(o),
      n = a(o),
      r = (n || s) && t[o];
    if ((s && (isFunction(r) || hasFunction(r))) || (n && isArray(r)))
      return !0;
  }
  return !1;
}
var version = "4.3.0";
const KNOWN_POSITIONS = ["top", "bottom", "left", "right", "chartArea"];
function positionIsHorizontal(t, e) {
  return (
    "top" === t ||
    "bottom" === t ||
    (-1 === KNOWN_POSITIONS.indexOf(t) && "x" === e)
  );
}
function compare2Level(i, a) {
  return function (t, e) {
    return t[i] === e[i] ? t[a] - e[a] : t[i] - e[i];
  };
}
function onAnimationsComplete(t) {
  const e = t.chart;
  var i = e.options.animation;
  e.notifyPlugins("afterRender"), callback(i && i.onComplete, [t], e);
}
function onAnimationProgress(t) {
  var e = t.chart,
    i = e.options.animation;
  callback(i && i.onProgress, [t], e);
}
function getCanvas(t) {
  return (
    _isDomSupported() && "string" == typeof t
      ? (t = document.getElementById(t))
      : t && t.length && (t = t[0]),
    (t = t && t.canvas ? t.canvas : t)
  );
}
const instances = {},
  getChart = (t) => {
    const e = getCanvas(t);
    return Object.values(instances)
      .filter((t) => t.canvas === e)
      .pop();
  };
function moveNumericKeys(t, e, i) {
  for (const n of Object.keys(t)) {
    var a,
      s = +n;
    e <= s && ((a = t[n]), delete t[n], (0 < i || e < s) && (t[s + i] = a));
  }
}
function determineLastEvent(t, e, i, a) {
  return i && "mouseout" !== t.type ? (a ? e : t) : null;
}
function getDatasetArea(t) {
  var { xScale: t, yScale: e } = t;
  if (t && e)
    return { left: t.left, right: t.right, top: e.top, bottom: e.bottom };
}
class Chart {
  static defaults = defaults;
  static instances = instances;
  static overrides = overrides;
  static registry = registry;
  static version = version;
  static getChart = getChart;
  static register(...t) {
    registry.add(...t), invalidatePlugins();
  }
  static unregister(...t) {
    registry.remove(...t), invalidatePlugins();
  }
  constructor(t, e) {
    const i = (this.config = new Config(e));
    (e = getCanvas(t)), (t = getChart(e));
    if (t)
      throw new Error(
        "Canvas is already in use. Chart with ID '" +
          t.id +
          "' must be destroyed before the canvas with ID '" +
          t.canvas.id +
          "' can be reused."
      );
    var t = i.createResolver(i.chartOptionScopes(), this.getContext()),
      e =
        ((this.platform = new (i.platform || _detectPlatform(e))()),
        this.platform.updateConfig(i),
        this.platform.acquireContext(e, t.aspectRatio)),
      a = e && e.canvas,
      s = a && a.height,
      n = a && a.width;
    (this.id = uid()),
      (this.ctx = e),
      (this.canvas = a),
      (this.width = n),
      (this.height = s),
      (this._options = t),
      (this._aspectRatio = this.aspectRatio),
      (this._layers = []),
      (this._metasets = []),
      (this._stacks = void 0),
      (this.boxes = []),
      (this.currentDevicePixelRatio = void 0),
      (this.chartArea = void 0),
      (this._active = []),
      (this._lastEvent = void 0),
      (this._listeners = {}),
      (this._responsiveListeners = void 0),
      (this._sortedMetasets = []),
      (this.scales = {}),
      (this._plugins = new PluginService()),
      (this.$proxies = {}),
      (this._hiddenIndices = {}),
      (this.attached = !1),
      (this._animationsDisabled = void 0),
      (this.$context = void 0),
      (this._doResize = debounce((t) => this.update(t), t.resizeDelay || 0)),
      (this._dataChanges = []),
      (instances[this.id] = this),
      e && a
        ? (animator.listen(this, "complete", onAnimationsComplete),
          animator.listen(this, "progress", onAnimationProgress),
          this._initialize(),
          this.attached && this.update())
        : console.error(
            "Failed to create chart: can't acquire context from the given item"
          );
  }
  get aspectRatio() {
    var {
      options: { aspectRatio: t, maintainAspectRatio: e },
      width: i,
      height: a,
      _aspectRatio: s,
    } = this;
    return isNullOrUndef(t) ? (e && s ? s : a ? i / a : null) : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  get registry() {
    return registry;
  }
  _initialize() {
    return (
      this.notifyPlugins("beforeInit"),
      this.options.responsive
        ? this.resize()
        : retinaScale(this, this.options.devicePixelRatio),
      this.bindEvents(),
      this.notifyPlugins("afterInit"),
      this
    );
  }
  clear() {
    return clearCanvas(this.canvas, this.ctx), this;
  }
  stop() {
    return animator.stop(this), this;
  }
  resize(t, e) {
    animator.running(this)
      ? (this._resizeBeforeDraw = { width: t, height: e })
      : this._resize(t, e);
  }
  _resize(t, e) {
    var i = this.options,
      a = this.canvas,
      s = i.maintainAspectRatio && this.aspectRatio,
      a = this.platform.getMaximumSize(a, t, e, s),
      t = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
      e = this.width ? "resize" : "attach";
    (this.width = a.width),
      (this.height = a.height),
      (this._aspectRatio = this.aspectRatio),
      retinaScale(this, t, !0) &&
        (this.notifyPlugins("resize", { size: a }),
        callback(i.onResize, [this, a], this),
        this.attached && this._doResize(e) && this.render());
  }
  ensureScalesHaveIDs() {
    var t = this.options.scales || {};
    each(t, (t, e) => {
      t.id = e;
    });
  }
  buildOrUpdateScales() {
    const o = this.options,
      a = o.scales,
      l = this.scales,
      h = Object.keys(l).reduce((t, e) => ((t[e] = !1), t), {});
    let t = [];
    a &&
      (t = t.concat(
        Object.keys(a).map((t) => {
          var e = a[t],
            t = determineAxis(t, e),
            i = "r" === t,
            t = "x" === t;
          return {
            options: e,
            dposition: i ? "chartArea" : t ? "bottom" : "left",
            dtype: i ? "radialLinear" : t ? "category" : "linear",
          };
        })
      )),
      each(t, (t) => {
        const e = t.options;
        var i = e.id,
          a = determineAxis(i, e),
          s = valueOrDefault(e.type, t.dtype);
        (void 0 !== e.position &&
          positionIsHorizontal(e.position, a) ===
            positionIsHorizontal(t.dposition)) ||
          (e.position = t.dposition),
          (h[i] = !0);
        let n = null;
        if (i in l && l[i].type === s) n = l[i];
        else {
          const r = registry.getScale(s);
          (n = new r({ id: i, type: s, ctx: this.ctx, chart: this })),
            (l[n.id] = n);
        }
        n.init(e, o);
      }),
      each(h, (t, e) => {
        t || delete l[e];
      }),
      each(l, (t) => {
        layouts.configure(this, t, t.options), layouts.addBox(this, t);
      });
  }
  _updateMetasets() {
    const t = this._metasets;
    var e = this.data.datasets.length,
      i = t.length;
    if ((t.sort((t, e) => t.index - e.index), e < i)) {
      for (let t = e; t < i; ++t) this._destroyDatasetMeta(t);
      t.splice(e, i - e);
    }
    this._sortedMetasets = t.slice(0).sort(compare2Level("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const {
      _metasets: t,
      data: { datasets: i },
    } = this;
    t.length > i.length && delete this._stacks,
      t.forEach((e, t) => {
        0 === i.filter((t) => t === e._dataset).length &&
          this._destroyDatasetMeta(t);
      });
  }
  buildOrUpdateControllers() {
    const e = [];
    var i = this.data.datasets;
    let a, t;
    for (this._removeUnreferencedMetasets(), a = 0, t = i.length; a < t; a++) {
      var s = i[a];
      let t = this.getDatasetMeta(a);
      var n = s.type || this.config.type;
      if (
        (t.type &&
          t.type !== n &&
          (this._destroyDatasetMeta(a), (t = this.getDatasetMeta(a))),
        (t.type = n),
        (t.indexAxis = s.indexAxis || getIndexAxis(n, this.options)),
        (t.order = s.order || 0),
        (t.index = a),
        (t.label = "" + s.label),
        (t.visible = this.isDatasetVisible(a)),
        t.controller)
      )
        t.controller.updateIndex(a), t.controller.linkScales();
      else {
        const r = registry.getController(n);
        var { datasetElementType: s, dataElementType: n } =
          defaults.datasets[n];
        Object.assign(r, {
          dataElementType: registry.getElement(n),
          datasetElementType: s && registry.getElement(s),
        }),
          (t.controller = new r(this, a)),
          e.push(t.controller);
      }
    }
    return this._updateMetasets(), e;
  }
  _resetElements() {
    each(
      this.data.datasets,
      (t, e) => {
        this.getDatasetMeta(e).controller.reset();
      },
      this
    );
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const e = this.config;
    e.update();
    var a = (this._options = e.createResolver(
        e.chartOptionScopes(),
        this.getContext()
      )),
      s = (this._animationsDisabled = !a.animation);
    if (
      (this._updateScales(),
      this._checkEventBindings(),
      this._updateHiddenIndices(),
      this._plugins.invalidate(),
      !1 !== this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }))
    ) {
      const r = this.buildOrUpdateControllers();
      this.notifyPlugins("beforeElementsUpdate");
      let i = 0;
      for (let t = 0, e = this.data.datasets.length; t < e; t++) {
        const o = this.getDatasetMeta(t)["controller"];
        var n = !s && -1 === r.indexOf(o);
        o.buildOrUpdateElements(n), (i = Math.max(+o.getMaxOverflow(), i));
      }
      (i = this._minPadding = a.layout.autoPadding ? i : 0),
        this._updateLayout(i),
        s ||
          each(r, (t) => {
            t.reset();
          }),
        this._updateDatasets(t),
        this.notifyPlugins("afterUpdate", { mode: t }),
        this._layers.sort(compare2Level("z", "_idx"));
      var { _active: a, _lastEvent: t } = this;
      t
        ? this._eventHandler(t, !0)
        : a.length && this._updateHoverStyles(a, a, !0),
        this.render();
    }
  }
  _updateScales() {
    each(this.scales, (t) => {
      layouts.removeBox(this, t);
    }),
      this.ensureScalesHaveIDs(),
      this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    var t = this.options,
      e = new Set(Object.keys(this._listeners)),
      i = new Set(t.events);
    (setsEqual(e, i) && !!this._responsiveListeners === t.responsive) ||
      (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    var t,
      e,
      i,
      a = this["_hiddenIndices"];
    for ({ method: t, start: e, count: i } of this._getUniformDataChanges() ||
      []) {
      var s = "_removeElements" === t ? -i : i;
      moveNumericKeys(a, e, s);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (t && t.length) {
      this._dataChanges = [];
      var e = this.data.datasets.length,
        i = (e) =>
          new Set(
            t
              .filter((t) => t[0] === e)
              .map((t, e) => e + "," + t.splice(1).join(","))
          ),
        a = i(0);
      for (let t = 1; t < e; t++) if (!setsEqual(a, i(t))) return;
      return Array.from(a)
        .map((t) => t.split(","))
        .map((t) => ({ method: t[1], start: +t[2], count: +t[3] }));
    }
  }
  _updateLayout(t) {
    if (!1 !== this.notifyPlugins("beforeLayout", { cancelable: !0 })) {
      layouts.update(this, this.width, this.height, t);
      t = this.chartArea;
      const e = t.width <= 0 || t.height <= 0;
      (this._layers = []),
        each(
          this.boxes,
          (t) => {
            (e && "chartArea" === t.position) ||
              (t.configure && t.configure(), this._layers.push(...t._layers()));
          },
          this
        ),
        this._layers.forEach((t, e) => {
          t._idx = e;
        }),
        this.notifyPlugins("afterLayout");
    }
  }
  _updateDatasets(i) {
    if (
      !1 !==
      this.notifyPlugins("beforeDatasetsUpdate", { mode: i, cancelable: !0 })
    ) {
      for (let t = 0, e = this.data.datasets.length; t < e; ++t)
        this.getDatasetMeta(t).controller.configure();
      for (let t = 0, e = this.data.datasets.length; t < e; ++t)
        this._updateDataset(t, isFunction(i) ? i({ datasetIndex: t }) : i);
      this.notifyPlugins("afterDatasetsUpdate", { mode: i });
    }
  }
  _updateDataset(t, e) {
    const i = this.getDatasetMeta(t),
      a = { meta: i, index: t, mode: e, cancelable: !0 };
    !1 !== this.notifyPlugins("beforeDatasetUpdate", a) &&
      (i.controller._update(e),
      (a.cancelable = !1),
      this.notifyPlugins("afterDatasetUpdate", a));
  }
  render() {
    !1 !== this.notifyPlugins("beforeRender", { cancelable: !0 }) &&
      (animator.has(this)
        ? this.attached && !animator.running(this) && animator.start(this)
        : (this.draw(), onAnimationsComplete({ chart: this })));
  }
  draw() {
    let t;
    var e, i;
    if (
      (this._resizeBeforeDraw &&
        (({ width: e, height: i } = this._resizeBeforeDraw),
        this._resize(e, i),
        (this._resizeBeforeDraw = null)),
      this.clear(),
      !(this.width <= 0 || this.height <= 0) &&
        !1 !== this.notifyPlugins("beforeDraw", { cancelable: !0 }))
    ) {
      const a = this._layers;
      for (t = 0; t < a.length && a[t].z <= 0; ++t) a[t].draw(this.chartArea);
      for (this._drawDatasets(); t < a.length; ++t) a[t].draw(this.chartArea);
      this.notifyPlugins("afterDraw");
    }
  }
  _getSortedDatasetMetas(t) {
    var e = this._sortedMetasets;
    const i = [];
    let a, s;
    for (a = 0, s = e.length; a < s; ++a) {
      var n = e[a];
      (t && !n.visible) || i.push(n);
    }
    return i;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (!1 !== this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 })) {
      var e = this.getSortedVisibleDatasetMetas();
      for (let t = e.length - 1; 0 <= t; --t) this._drawDataset(e[t]);
      this.notifyPlugins("afterDatasetsDraw");
    }
  }
  _drawDataset(t) {
    var e = this.ctx,
      i = t._clip,
      a = !i.disabled,
      s = getDatasetArea(t) || this.chartArea;
    const n = { meta: t, index: t.index, cancelable: !0 };
    !1 !== this.notifyPlugins("beforeDatasetDraw", n) &&
      (a &&
        clipArea(e, {
          left: !1 === i.left ? 0 : s.left - i.left,
          right: !1 === i.right ? this.width : s.right + i.right,
          top: !1 === i.top ? 0 : s.top - i.top,
          bottom: !1 === i.bottom ? this.height : s.bottom + i.bottom,
        }),
      t.controller.draw(),
      a && unclipArea(e),
      (n.cancelable = !1),
      this.notifyPlugins("afterDatasetDraw", n));
  }
  isPointInArea(t) {
    return _isPointInArea(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, i, a) {
    const s = Interaction.modes[e];
    return "function" == typeof s ? s(this, t, i, a) : [];
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t],
      i = this._metasets;
    let a = i.filter((t) => t && t._dataset === e).pop();
    return (
      a ||
        ((a = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null,
          order: (e && e.order) || 0,
          index: t,
          _dataset: e,
          _parsed: [],
          _sorted: !1,
        }),
        i.push(a)),
      a
    );
  }
  getContext() {
    return (
      this.$context ||
      (this.$context = createContext(null, { chart: this, type: "chart" }))
    );
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    var e = this.data.datasets[t];
    if (!e) return !1;
    t = this.getDatasetMeta(t);
    return "boolean" == typeof t.hidden ? !t.hidden : !e.hidden;
  }
  setDatasetVisibility(t, e) {
    const i = this.getDatasetMeta(t);
    i.hidden = !e;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(e, t, i) {
    const a = i ? "show" : "hide",
      s = this.getDatasetMeta(e),
      n = s.controller._resolveAnimations(void 0, a);
    defined(t)
      ? ((s.data[t].hidden = !i), this.update())
      : (this.setDatasetVisibility(e, i),
        n.update(s, { visible: i }),
        this.update((t) => (t.datasetIndex === e ? a : void 0)));
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1);
  }
  show(t, e) {
    this._updateVisibility(t, e, !0);
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t];
    e && e.controller && e.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, e;
    for (
      this.stop(), animator.remove(this), t = 0, e = this.data.datasets.length;
      t < e;
      ++t
    )
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    var { canvas: t, ctx: e } = this;
    this._stop(),
      this.config.clearCache(),
      t &&
        (this.unbindEvents(),
        clearCanvas(t, e),
        this.platform.releaseContext(e),
        (this.canvas = null),
        (this.ctx = null)),
      delete instances[this.id],
      this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(),
      this.options.responsive
        ? this.bindResponsiveEvents()
        : (this.attached = !0);
  }
  bindUserEvents() {
    const i = this._listeners,
      a = this.platform,
      e = (t, e) => {
        a.addEventListener(this, t, e), (i[t] = e);
      },
      s = (t, e, i) => {
        (t.offsetX = e), (t.offsetY = i), this._eventHandler(t);
      };
    each(this.options.events, (t) => e(t, s));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const i = this._responsiveListeners,
      a = this.platform,
      t = (t, e) => {
        a.addEventListener(this, t, e), (i[t] = e);
      },
      e = (t, e) => {
        i[t] && (a.removeEventListener(this, t, e), delete i[t]);
      },
      s = (t, e) => {
        this.canvas && this.resize(t, e);
      };
    let n;
    const r = () => {
      e("attach", r),
        (this.attached = !0),
        this.resize(),
        t("resize", s),
        t("detach", n);
    };
    (n = () => {
      (this.attached = !1),
        e("resize", s),
        this._stop(),
        this._resize(0, 0),
        t("attach", r);
    }),
      (a.isAttached(this.canvas) ? r : n)();
  }
  unbindEvents() {
    each(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }),
      (this._listeners = {}),
      each(this._responsiveListeners, (t, e) => {
        this.platform.removeEventListener(this, e, t);
      }),
      (this._responsiveListeners = void 0);
  }
  updateHoverStyle(t, e, i) {
    var a = i ? "set" : "remove";
    let s, n, r, o;
    for (
      "dataset" === e &&
        (s = this.getDatasetMeta(t[0].datasetIndex)).controller[
          "_" + a + "DatasetHoverStyle"
        ](),
        r = 0,
        o = t.length;
      r < o;
      ++r
    ) {
      const l = (n = t[r]) && this.getDatasetMeta(n.datasetIndex).controller;
      l && l[a + "HoverStyle"](n.element, n.datasetIndex, n.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    var e = this._active || [],
      t = t.map(({ datasetIndex: t, index: e }) => {
        var i = this.getDatasetMeta(t);
        if (i) return { datasetIndex: t, element: i.data[e], index: e };
        throw new Error("No dataset found at index " + t);
      });
    _elementsEqual(t, e) ||
      ((this._active = t),
      (this._lastEvent = null),
      this._updateHoverStyles(t, e));
  }
  notifyPlugins(t, e, i) {
    return this._plugins.notify(this, t, e, i);
  }
  isPluginEnabled(e) {
    return 1 === this._plugins._cache.filter((t) => t.plugin.id === e).length;
  }
  _updateHoverStyles(t, e, i) {
    var a = this.options.hover,
      s = (t, i) =>
        t.filter(
          (e) =>
            !i.some(
              (t) => e.datasetIndex === t.datasetIndex && e.index === t.index
            )
        ),
      n = s(e, t),
      i = i ? t : s(t, e);
    n.length && this.updateHoverStyle(n, a.mode, !1),
      i.length && a.mode && this.updateHoverStyle(i, a.mode, !0);
  }
  _eventHandler(e, t) {
    const i = {
      event: e,
      replay: t,
      cancelable: !0,
      inChartArea: this.isPointInArea(e),
    };
    var a = (t) =>
      (t.options.events || this.options.events).includes(e.native.type);
    if (!1 !== this.notifyPlugins("beforeEvent", i, a))
      return (
        (t = this._handleEvent(e, t, i.inChartArea)),
        (i.cancelable = !1),
        this.notifyPlugins("afterEvent", i, a),
        (t || i.changed) && this.render(),
        this
      );
  }
  _handleEvent(t, e, i) {
    var { _active: a = [], options: s } = this,
      n = this._getActiveElements(t, a, i, e),
      r = _isClickEvent(t),
      o = determineLastEvent(t, this._lastEvent, i, r),
      i =
        (i &&
          ((this._lastEvent = null),
          callback(s.onHover, [t, n, this], this),
          r && callback(s.onClick, [t, n, this], this)),
        !_elementsEqual(n, a));
    return (
      (i || e) && ((this._active = n), this._updateHoverStyles(n, a, e)),
      (this._lastEvent = o),
      i
    );
  }
  _getActiveElements(t, e, i, a) {
    if ("mouseout" === t.type) return [];
    if (!i) return e;
    i = this.options.hover;
    return this.getElementsAtEventForMode(t, i.mode, i, a);
  }
}
function invalidatePlugins() {
  return each(Chart.instances, (t) => t._plugins.invalidate());
}
function clipArc(t, e, i) {
  var {
      startAngle: e,
      pixelMargin: a,
      x: s,
      y: n,
      outerRadius: r,
      innerRadius: o,
    } = e,
    l = a / r;
  t.beginPath(),
    t.arc(s, n, r, e - l, i + l),
    a < o
      ? t.arc(s, n, o, i + (l = a / o), e - l, !0)
      : t.arc(s, n, a, i + HALF_PI, e - HALF_PI),
    t.closePath(),
    t.clip();
}
function toRadiusCorners(t) {
  return _readValueToProps(t, [
    "outerStart",
    "outerEnd",
    "innerStart",
    "innerEnd",
  ]);
}
function parseBorderRadius$1(t, e, i, a) {
  t = toRadiusCorners(t.options.borderRadius);
  const s = (i - e) / 2;
  var e = Math.min(s, (a * e) / 2),
    n = (t) => {
      var e = ((i - Math.min(s, t)) * a) / 2;
      return _limitValue(t, 0, Math.min(s, e));
    };
  return {
    outerStart: n(t.outerStart),
    outerEnd: n(t.outerEnd),
    innerStart: _limitValue(t.innerStart, 0, e),
    innerEnd: _limitValue(t.innerEnd, 0, e),
  };
}
function rThetaToXY(t, e, i, a) {
  return { x: i + t * Math.cos(e), y: a + t * Math.sin(e) };
}
function pathArc(t, e, i, a, s, n) {
  var { x: r, y: o, startAngle: l, pixelMargin: h, innerRadius: d } = e,
    c = Math.max(e.outerRadius + a + i - h, 0),
    h = 0 < d ? d + a + i + h : 0;
  let u = 0;
  var g = s - l,
    d =
      (a &&
        ((d = ((0 < d ? d - a : 0) + (0 < c ? c - a : 0)) / 2),
        (u = (g - (0 != d ? (g * d) / (d + a) : g)) / 2)),
      Math.max(0.001, g * c - i / PI) / c),
    a = (g - d) / 2,
    i = l + a + u,
    g = s - a - u,
    {
      outerStart: d,
      outerEnd: l,
      innerStart: s,
      innerEnd: a,
    } = parseBorderRadius$1(e, h, c, g - i),
    e = c - d,
    p = c - l,
    f = i + d / e,
    m = g - l / p,
    v = h + s,
    x = h + a,
    b = i + s / v,
    _ = g - a / x;
  t.beginPath(),
    n
      ? (t.arc(r, o, c, f, (n = (f + m) / 2)),
        t.arc(r, o, c, n, m),
        0 < l &&
          ((n = rThetaToXY(p, m, r, o)), t.arc(n.x, n.y, l, m, g + HALF_PI)),
        (p = rThetaToXY(x, g, r, o)),
        t.lineTo(p.x, p.y),
        0 < a &&
          ((n = rThetaToXY(x, _, r, o)),
          t.arc(n.x, n.y, a, g + HALF_PI, _ + Math.PI)),
        t.arc(r, o, h, g - a / h, (l = (g - a / h + (i + s / h)) / 2), !0),
        t.arc(r, o, h, l, i + s / h, !0),
        0 < s &&
          ((p = rThetaToXY(v, b, r, o)),
          t.arc(p.x, p.y, s, b + Math.PI, i - HALF_PI)),
        (x = rThetaToXY(e, i, r, o)),
        t.lineTo(x.x, x.y),
        0 < d &&
          ((n = rThetaToXY(e, f, r, o)), t.arc(n.x, n.y, d, i - HALF_PI, f)))
      : (t.moveTo(r, o),
        (_ = Math.cos(f) * c + r),
        (g = Math.sin(f) * c + o),
        t.lineTo(_, g),
        (a = Math.cos(m) * c + r),
        (l = Math.sin(m) * c + o),
        t.lineTo(a, l)),
    t.closePath();
}
function drawArc(e, t, i, a, s) {
  var { fullCircles: n, startAngle: r, circumference: o } = t;
  let l = t.endAngle;
  if (n) {
    pathArc(e, t, i, a, l, s);
    for (let t = 0; t < n; ++t) e.fill();
    isNaN(o) || (l = r + (o % TAU || TAU));
  }
  return pathArc(e, t, i, a, l, s), e.fill(), l;
}
function drawBorder(e, i, a, s, n) {
  var { fullCircles: r, startAngle: o, circumference: l, options: h } = i,
    {
      borderWidth: d,
      borderJoinStyle: c,
      borderDash: u,
      borderDashOffset: g,
    } = h,
    h = "inner" === h.borderAlign;
  if (d) {
    e.setLineDash(u || []),
      (e.lineDashOffset = g),
      h
        ? ((e.lineWidth = 2 * d), (e.lineJoin = c || "round"))
        : ((e.lineWidth = d), (e.lineJoin = c || "bevel"));
    let t = i.endAngle;
    if (r) {
      pathArc(e, i, a, s, t, n);
      for (let t = 0; t < r; ++t) e.stroke();
      isNaN(l) || (t = o + (l % TAU || TAU));
    }
    h && clipArc(e, i, t), r || (pathArc(e, i, a, s, t, n), e.stroke());
  }
}
class ArcElement extends Element {
  static id = "arc";
  static defaults = {
    borderAlign: "center",
    borderColor: "#fff",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: void 0,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0,
    circular: !0,
  };
  static defaultRoutes = { backgroundColor: "backgroundColor" };
  static descriptors = {
    _scriptable: !0,
    _indexable: (t) => "borderDash" !== t,
  };
  circumference;
  endAngle;
  fullCircles;
  innerRadius;
  outerRadius;
  pixelMargin;
  startAngle;
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.circumference = void 0),
      (this.startAngle = void 0),
      (this.endAngle = void 0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.pixelMargin = 0),
      (this.fullCircles = 0),
      t && Object.assign(this, t);
  }
  inRange(t, e, i) {
    var a = this.getProps(["x", "y"], i),
      { angle: a, distance: t } = getAngleFromPoint(a, { x: t, y: e }),
      {
        startAngle: e,
        endAngle: i,
        innerRadius: s,
        outerRadius: n,
        circumference: r,
      } = this.getProps(
        [
          "startAngle",
          "endAngle",
          "innerRadius",
          "outerRadius",
          "circumference",
        ],
        i
      ),
      o = (this.options.spacing + this.options.borderWidth) / 2,
      r = valueOrDefault(r, i - e),
      r = TAU <= r || _angleBetween(a, e, i),
      a = _isBetween(t, s + o, n + o);
    return r && a;
  }
  getCenterPoint(t) {
    var {
        x: t,
        y: e,
        startAngle: i,
        endAngle: a,
        innerRadius: s,
        outerRadius: n,
      } = this.getProps(
        ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"],
        t
      ),
      { offset: r, spacing: o } = this.options,
      i = (i + a) / 2,
      a = (s + n + o + r) / 2;
    return { x: t + Math.cos(i) * a, y: e + Math.sin(i) * a };
  }
  tooltipPosition(t) {
    return this.getCenterPoint(t);
  }
  draw(t) {
    var e,
      { options: i, circumference: a } = this,
      s = (i.offset || 0) / 4,
      n = (i.spacing || 0) / 2,
      r = i.circular;
    (this.pixelMargin = "inner" === i.borderAlign ? 0.33 : 0),
      (this.fullCircles = TAU < a ? Math.floor(a / TAU) : 0),
      0 === a ||
        this.innerRadius < 0 ||
        this.outerRadius < 0 ||
        (t.save(),
        (e = (this.startAngle + this.endAngle) / 2),
        t.translate(Math.cos(e) * s, Math.sin(e) * s),
        (e = s * (1 - Math.sin(Math.min(PI, a || 0)))),
        (t.fillStyle = i.backgroundColor),
        (t.strokeStyle = i.borderColor),
        drawArc(t, this, e, n, r),
        drawBorder(t, this, e, n, r),
        t.restore());
  }
}
function setStyle(t, e, i = e) {
  (t.lineCap = valueOrDefault(i.borderCapStyle, e.borderCapStyle)),
    t.setLineDash(valueOrDefault(i.borderDash, e.borderDash)),
    (t.lineDashOffset = valueOrDefault(i.borderDashOffset, e.borderDashOffset)),
    (t.lineJoin = valueOrDefault(i.borderJoinStyle, e.borderJoinStyle)),
    (t.lineWidth = valueOrDefault(i.borderWidth, e.borderWidth)),
    (t.strokeStyle = valueOrDefault(i.borderColor, e.borderColor));
}
function lineTo(t, e, i) {
  t.lineTo(i.x, i.y);
}
function getLineMethod(t) {
  return t.stepped
    ? _steppedLineTo
    : t.tension || "monotone" === t.cubicInterpolationMode
    ? _bezierCurveTo
    : lineTo;
}
function pathVars(t, e, i = {}) {
  var t = t.length,
    { start: i = 0, end: a = t - 1 } = i,
    { start: s, end: n } = e,
    r = Math.max(i, s),
    o = Math.min(a, n);
  return {
    count: t,
    start: r,
    loop: e.loop,
    ilen: o < r && !((i < s && a < s) || (n < i && n < a)) ? t + o - r : o - r,
  };
}
function pathSegment(t, e, i, a) {
  var { points: s, options: n } = e,
    { count: r, start: o, loop: e, ilen: l } = pathVars(s, i, a);
  const h = getLineMethod(n);
  let { move: d = !0, reverse: c } = a || {},
    u,
    g,
    p;
  for (u = 0; u <= l; ++u)
    (g = s[(o + (c ? l - u : u)) % r]).skip ||
      (d ? (t.moveTo(g.x, g.y), (d = !1)) : h(t, p, g, c, n.stepped), (p = g));
  return e && ((g = s[(o + (c ? l : 0)) % r]), h(t, p, g, c, n.stepped)), !!e;
}
function fastPathSegment(t, e, i, a) {
  var s = e.points;
  const { count: n, start: r, ilen: o } = pathVars(s, i, a),
    { move: l = !0, reverse: h } = a || {};
  let d = 0,
    c = 0,
    u,
    g,
    p,
    f,
    m,
    v;
  var x,
    b,
    _,
    y = (t) => (r + (h ? o - t : t)) % n,
    k = () => {
      f !== m && (t.lineTo(d, m), t.lineTo(d, f), t.lineTo(d, v));
    };
  for (l && ((g = s[y(0)]), t.moveTo(g.x, g.y)), u = 0; u <= o; ++u)
    (g = s[y(u)]).skip ||
      ((x = g.x),
      (b = g.y),
      (_ = 0 | x) === p
        ? (b < f ? (f = b) : b > m && (m = b), (d = (c * d + x) / ++c))
        : (k(), t.lineTo(x, b), (p = _), (c = 0), (f = m = b)),
      (v = b));
  k();
}
function _getSegmentMethod(t) {
  var e = t.options,
    i = e.borderDash && e.borderDash.length;
  return !(
    t._decimated ||
    t._loop ||
    e.tension ||
    "monotone" === e.cubicInterpolationMode ||
    e.stepped ||
    i
  )
    ? fastPathSegment
    : pathSegment;
}
function _getInterpolationMethod(t) {
  return t.stepped
    ? _steppedInterpolation
    : t.tension || "monotone" === t.cubicInterpolationMode
    ? _bezierInterpolation
    : _pointInLine;
}
function strokePathWithCache(t, e, i, a) {
  let s = e._path;
  s || ((s = e._path = new Path2D()), e.path(s, i, a) && s.closePath()),
    setStyle(t, e.options),
    t.stroke(s);
}
function strokePathDirect(t, e, i, a) {
  var { segments: s, options: n } = e;
  const r = _getSegmentMethod(e);
  for (const o of s)
    setStyle(t, n, o.style),
      t.beginPath(),
      r(t, e, o, { start: i, end: i + a - 1 }) && t.closePath(),
      t.stroke();
}
const usePath2D = "function" == typeof Path2D;
function draw(t, e, i, a) {
  (usePath2D && !e.options.segment ? strokePathWithCache : strokePathDirect)(
    t,
    e,
    i,
    a
  );
}
class LineElement extends Element {
  static id = "line";
  static defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: "default",
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  static descriptors = {
    _scriptable: !0,
    _indexable: (t) => "borderDash" !== t && "fill" !== t,
  };
  constructor(t) {
    super(),
      (this.animated = !0),
      (this.options = void 0),
      (this._chart = void 0),
      (this._loop = void 0),
      (this._fullLoop = void 0),
      (this._path = void 0),
      (this._points = void 0),
      (this._segments = void 0),
      (this._decimated = !1),
      (this._pointsUpdated = !1),
      (this._datasetIndex = void 0),
      t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    var i,
      a = this.options;
    (!a.tension && "monotone" !== a.cubicInterpolationMode) ||
      a.stepped ||
      this._pointsUpdated ||
      ((i = a.spanGaps ? this._loop : this._fullLoop),
      _updateBezierControlPoints(this._points, a, t, i, e),
      (this._pointsUpdated = !0));
  }
  set points(t) {
    (this._points = t),
      delete this._segments,
      delete this._path,
      (this._pointsUpdated = !1);
  }
  get points() {
    return this._points;
  }
  get segments() {
    return (
      this._segments ||
      (this._segments = _computeSegments(this, this.options.segment))
    );
  }
  first() {
    var t = this.segments,
      e = this.points;
    return t.length && e[t[0].start];
  }
  last() {
    var t = this.segments,
      e = this.points,
      i = t.length;
    return i && e[t[i - 1].end];
  }
  interpolate(i, a) {
    var s = this.options,
      n = i[a],
      r = this.points,
      o = _boundSegments(this, { property: a, start: n, end: n });
    if (o.length) {
      const c = [],
        u = _getInterpolationMethod(s);
      let t, e;
      for (t = 0, e = o.length; t < e; ++t) {
        var { start: l, end: h } = o[t],
          l = r[l],
          h = r[h];
        if (l === h) c.push(l);
        else {
          var d = Math.abs((n - l[a]) / (h[a] - l[a]));
          const g = u(l, h, d, s.stepped);
          (g[a] = i[a]), c.push(g);
        }
      }
      return 1 === c.length ? c[0] : c;
    }
  }
  pathSegment(t, e, i) {
    const a = _getSegmentMethod(this);
    return a(t, this, e, i);
  }
  path(t, e, i) {
    var a = this.segments;
    const s = _getSegmentMethod(this);
    let n = this._loop;
    (e = e || 0), (i = i || this.points.length - e);
    for (const r of a) n &= s(t, this, r, { start: e, end: e + i - 1 });
    return !!n;
  }
  draw(t, e, i, a) {
    var s = this.options || {};
    (this.points || []).length &&
      s.borderWidth &&
      (t.save(), draw(t, this, i, a), t.restore()),
      this.animated && ((this._pointsUpdated = !1), (this._path = void 0));
  }
}
function inRange$1(t, e, i, a) {
  var s = t.options,
    { [i]: t } = t.getProps([i], a);
  return Math.abs(e - t) < s.radius + s.hitRadius;
}
class PointElement extends Element {
  static id = "point";
  parsed;
  skip;
  stop;
  static defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0,
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.parsed = void 0),
      (this.skip = void 0),
      (this.stop = void 0),
      t && Object.assign(this, t);
  }
  inRange(t, e, i) {
    var a = this.options,
      { x: i, y: s } = this.getProps(["x", "y"], i);
    return (
      Math.pow(t - i, 2) + Math.pow(e - s, 2) <
      Math.pow(a.hitRadius + a.radius, 2)
    );
  }
  inXRange(t, e) {
    return inRange$1(this, t, "x", e);
  }
  inYRange(t, e) {
    return inRange$1(this, t, "y", e);
  }
  getCenterPoint(t) {
    var { x: t, y: e } = this.getProps(["x", "y"], t);
    return { x: t, y: e };
  }
  size(t) {
    var e = (t = t || this.options || {}).radius || 0;
    return (
      2 *
      ((e = Math.max(e, (e && t.hoverRadius) || 0)) +
        ((e && t.borderWidth) || 0))
    );
  }
  draw(t, e) {
    var i = this.options;
    this.skip ||
      i.radius < 0.1 ||
      !_isPointInArea(this, e, this.size(i) / 2) ||
      ((t.strokeStyle = i.borderColor),
      (t.lineWidth = i.borderWidth),
      (t.fillStyle = i.backgroundColor),
      drawPoint(t, i, this.x, this.y));
  }
  getRange() {
    var t = this.options || {};
    return t.radius + t.hitRadius;
  }
}
function getBarBounds(t, e) {
  var {
    x: e,
    y: i,
    base: a,
    width: s,
    height: n,
  } = t.getProps(["x", "y", "base", "width", "height"], e);
  let r, o, l, h, d;
  return (
    (h = t.horizontal
      ? ((d = n / 2),
        (r = Math.min(e, a)),
        (o = Math.max(e, a)),
        (l = i - d),
        i + d)
      : ((d = s / 2),
        (r = e - d),
        (o = e + d),
        (l = Math.min(i, a)),
        Math.max(i, a))),
    { left: r, top: l, right: o, bottom: h }
  );
}
function skipOrLimit(t, e, i, a) {
  return t ? 0 : _limitValue(e, i, a);
}
function parseBorderWidth(t, e, i) {
  var a = t.options.borderWidth,
    t = t.borderSkipped,
    a = toTRBL(a);
  return {
    t: skipOrLimit(t.top, a.top, 0, i),
    r: skipOrLimit(t.right, a.right, 0, e),
    b: skipOrLimit(t.bottom, a.bottom, 0, i),
    l: skipOrLimit(t.left, a.left, 0, e),
  };
}
function parseBorderRadius(t, e, i) {
  var a = t.getProps(["enableBorderRadius"])["enableBorderRadius"],
    s = t.options.borderRadius,
    n = toTRBLCorners(s),
    e = Math.min(e, i),
    i = t.borderSkipped,
    t = a || isObject(s);
  return {
    topLeft: skipOrLimit(!t || i.top || i.left, n.topLeft, 0, e),
    topRight: skipOrLimit(!t || i.top || i.right, n.topRight, 0, e),
    bottomLeft: skipOrLimit(!t || i.bottom || i.left, n.bottomLeft, 0, e),
    bottomRight: skipOrLimit(!t || i.bottom || i.right, n.bottomRight, 0, e),
  };
}
function boundingRects(t) {
  var e = getBarBounds(t),
    i = e.right - e.left,
    a = e.bottom - e.top,
    s = parseBorderWidth(t, i / 2, a / 2),
    t = parseBorderRadius(t, i / 2, a / 2);
  return {
    outer: { x: e.left, y: e.top, w: i, h: a, radius: t },
    inner: {
      x: e.left + s.l,
      y: e.top + s.t,
      w: i - s.l - s.r,
      h: a - s.t - s.b,
      radius: {
        topLeft: Math.max(0, t.topLeft - Math.max(s.t, s.l)),
        topRight: Math.max(0, t.topRight - Math.max(s.t, s.r)),
        bottomLeft: Math.max(0, t.bottomLeft - Math.max(s.b, s.l)),
        bottomRight: Math.max(0, t.bottomRight - Math.max(s.b, s.r)),
      },
    },
  };
}
function inRange(t, e, i, a) {
  var s = null === e,
    n = null === i,
    t = t && !(s && n) && getBarBounds(t, a);
  return (
    t &&
    (s || _isBetween(e, t.left, t.right)) &&
    (n || _isBetween(i, t.top, t.bottom))
  );
}
function hasRadius(t) {
  return t.topLeft || t.topRight || t.bottomLeft || t.bottomRight;
}
function addNormalRectPath(t, e) {
  t.rect(e.x, e.y, e.w, e.h);
}
function inflateRect(t, e, i = {}) {
  var a = t.x !== i.x ? -e : 0,
    s = t.y !== i.y ? -e : 0,
    n = (t.x + t.w !== i.x + i.w ? e : 0) - a,
    i = (t.y + t.h !== i.y + i.h ? e : 0) - s;
  return { x: t.x + a, y: t.y + s, w: t.w + n, h: t.h + i, radius: t.radius };
}
class BarElement extends Element {
  static id = "bar";
  static defaults = {
    borderSkipped: "start",
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: "auto",
    pointStyle: void 0,
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  };
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.horizontal = void 0),
      (this.base = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.inflateAmount = void 0),
      t && Object.assign(this, t);
  }
  draw(t) {
    var {
        inflateAmount: e,
        options: { borderColor: i, backgroundColor: a },
      } = this,
      { inner: s, outer: n } = boundingRects(this);
    const r = hasRadius(n.radius) ? addRoundedRectPath : addNormalRectPath;
    t.save(),
      (n.w === s.w && n.h === s.h) ||
        (t.beginPath(),
        r(t, inflateRect(n, e, s)),
        t.clip(),
        r(t, inflateRect(s, -e, n)),
        (t.fillStyle = i),
        t.fill("evenodd")),
      t.beginPath(),
      r(t, inflateRect(s, e)),
      (t.fillStyle = a),
      t.fill(),
      t.restore();
  }
  inRange(t, e, i) {
    return inRange(this, t, e, i);
  }
  inXRange(t, e) {
    return inRange(this, t, null, e);
  }
  inYRange(t, e) {
    return inRange(this, null, t, e);
  }
  getCenterPoint(t) {
    var {
      x: t,
      y: e,
      base: i,
      horizontal: a,
    } = this.getProps(["x", "y", "base", "horizontal"], t);
    return { x: a ? (t + i) / 2 : t, y: a ? e : (e + i) / 2 };
  }
  getRange(t) {
    return "x" === t ? this.width / 2 : this.height / 2;
  }
}
var elements = Object.freeze({
  __proto__: null,
  ArcElement: ArcElement,
  BarElement: BarElement,
  LineElement: LineElement,
  PointElement: PointElement,
});
const BORDER_COLORS = [
    "rgb(54, 162, 235)",
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ],
  BACKGROUND_COLORS = BORDER_COLORS.map((t) =>
    t.replace("rgb(", "rgba(").replace(")", ", 0.5)")
  );
function getBorderColor(t) {
  return BORDER_COLORS[t % BORDER_COLORS.length];
}
function getBackgroundColor(t) {
  return BACKGROUND_COLORS[t % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(t, e) {
  return (
    (t.borderColor = getBorderColor(e)),
    (t.backgroundColor = getBackgroundColor(e)),
    ++e
  );
}
function colorizeDoughnutDataset(t, e) {
  return (t.backgroundColor = t.data.map(() => getBorderColor(e++))), e;
}
function colorizePolarAreaDataset(t, e) {
  return (t.backgroundColor = t.data.map(() => getBackgroundColor(e++))), e;
}
function getColorizer(i) {
  let a = 0;
  return (t, e) => {
    e = i.getDatasetMeta(e).controller;
    e instanceof DoughnutController
      ? (a = colorizeDoughnutDataset(t, a))
      : e instanceof PolarAreaController
      ? (a = colorizePolarAreaDataset(t, a))
      : e && (a = colorizeDefaultDataset(t, a));
  };
}
function containsColorsDefinitions(t) {
  let e;
  for (e in t) if (t[e].borderColor || t[e].backgroundColor) return !0;
  return !1;
}
function containsColorsDefinition(t) {
  return t && (t.borderColor || t.backgroundColor);
}
var plugin_colors = {
  id: "colors",
  defaults: { enabled: !0, forceOverride: !1 },
  beforeLayout(t, e, i) {
    if (i.enabled) {
      const {
        data: { datasets: s },
        options: n,
      } = t.config;
      var a = n["elements"];
      (!i.forceOverride &&
        (containsColorsDefinitions(s) ||
          containsColorsDefinition(n) ||
          (a && containsColorsDefinitions(a)))) ||
        ((i = getColorizer(t)), s.forEach(i));
    }
  },
};
function lttbDecimation(a, s, n, t, e) {
  var i = e.samples || t;
  if (n <= i) return a.slice(s, s + n);
  const r = [];
  var o = (n - 2) / (i - 2);
  let l = 0;
  e = s + n - 1;
  let h = s,
    d,
    c,
    u,
    g,
    p;
  for (r[l++] = a[h], d = 0; d < i - 2; d++) {
    let t = 0,
      e = 0,
      i;
    var f = Math.floor((d + 1) * o) + 1 + s,
      m = Math.min(Math.floor((d + 2) * o) + 1, n) + s,
      v = m - f;
    for (i = f; i < m; i++) (t += a[i].x), (e += a[i].y);
    (t /= v), (e /= v);
    var f = Math.floor(d * o) + 1 + s,
      x = Math.min(Math.floor((d + 1) * o) + 1, n) + s,
      { x: b, y: _ } = a[h];
    for (u = -1, i = f; i < x; i++)
      (g = 0.5 * Math.abs((b - t) * (a[i].y - _) - (b - a[i].x) * (e - _))) >
        u && ((u = g), (c = a[i]), (p = i));
    (r[l++] = c), (h = p);
  }
  return (r[l++] = a[e]), r;
}
function minMaxDecimation(t, e, i, a) {
  let s = 0,
    n = 0,
    r,
    o,
    l,
    h,
    d,
    c,
    u,
    g,
    p,
    f;
  const m = [];
  var v = t[e].x,
    x = t[e + i - 1].x - v;
  for (r = e; r < e + i; ++r) {
    (l = (((o = t[r]).x - v) / x) * a), (h = o.y);
    var b,
      _,
      y,
      k = 0 | l;
    k === d
      ? (h < p ? ((p = h), (c = r)) : h > f && ((f = h), (u = r)),
        (s = (n * s + o.x) / ++n))
      : ((b = r - 1),
        isNullOrUndef(c) ||
          isNullOrUndef(u) ||
          ((_ = Math.min(c, u)),
          (y = Math.max(c, u)),
          _ !== g && _ !== b && m.push({ ...t[_], x: s }),
          y !== g && y !== b && m.push({ ...t[y], x: s })),
        0 < r && b !== g && m.push(t[b]),
        m.push(o),
        (d = k),
        (n = 0),
        (p = f = h),
        (c = u = g = r));
  }
  return m;
}
function cleanDecimatedDataset(t) {
  var e;
  t._decimated &&
    ((e = t._data),
    delete t._decimated,
    delete t._data,
    Object.defineProperty(t, "data", {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: e,
    }));
}
function cleanDecimatedData(t) {
  t.data.datasets.forEach((t) => {
    cleanDecimatedDataset(t);
  });
}
function getStartAndCountOfVisiblePointsSimplified(t, e) {
  var i = e.length;
  let a = 0,
    s;
  const n = t["iScale"];
  var { min: t, max: r, minDefined: o, maxDefined: l } = n.getUserBounds();
  return (
    o && (a = _limitValue(_lookupByKey(e, n.axis, t).lo, 0, i - 1)),
    (s = l ? _limitValue(_lookupByKey(e, n.axis, r).hi + 1, a, i) - a : i - a),
    { start: a, count: s }
  );
}
var plugin_decimation = {
  id: "decimation",
  defaults: { algorithm: "min-max", enabled: !1 },
  beforeElementsUpdate: (o, t, l) => {
    if (l.enabled) {
      const h = o.width;
      o.data.datasets.forEach((e, t) => {
        var { _data: i, indexAxis: a } = e,
          t = o.getDatasetMeta(t),
          s = i || e.data;
        if (
          "y" !== resolve([a, o.options.indexAxis]) &&
          t.controller.supportsDecimation
        ) {
          a = o.scales[t.xAxisID];
          if (
            ("linear" === a.type || "time" === a.type) &&
            !o.options.parsing
          ) {
            var { start: n, count: r } =
              getStartAndCountOfVisiblePointsSimplified(t, s);
            if (r <= (l.threshold || 4 * h)) cleanDecimatedDataset(e);
            else {
              isNullOrUndef(i) &&
                ((e._data = s),
                delete e.data,
                Object.defineProperty(e, "data", {
                  configurable: !0,
                  enumerable: !0,
                  get: function () {
                    return this._decimated;
                  },
                  set: function (t) {
                    this._data = t;
                  },
                }));
              let t;
              switch (l.algorithm) {
                case "lttb":
                  t = lttbDecimation(s, n, r, h, l);
                  break;
                case "min-max":
                  t = minMaxDecimation(s, n, r, h);
                  break;
                default:
                  throw new Error(
                    `Unsupported decimation algorithm '${l.algorithm}'`
                  );
              }
              e._decimated = t;
            }
          }
        }
      });
    } else cleanDecimatedData(o);
  },
  destroy(t) {
    cleanDecimatedData(t);
  },
};
function _segments(t, e, i) {
  var a = t.segments,
    s = t.points,
    n = e.points;
  const r = [];
  for (const c of a) {
    var { start: o, end: l } = c,
      l = _findSegmentEnd(o, l, s),
      h = _getBounds(i, s[o], s[l], c.loop);
    if (e.segments)
      for (const u of _boundSegments(e, h)) {
        var d = _getBounds(i, n[u.start], n[u.end], u.loop);
        for (const g of _boundSegment(c, s, d))
          r.push({
            source: g,
            target: u,
            start: { [i]: _getEdge(h, d, "start", Math.max) },
            end: { [i]: _getEdge(h, d, "end", Math.min) },
          });
      }
    else r.push({ source: c, target: h, start: s[o], end: s[l] });
  }
  return r;
}
function _getBounds(i, a, s, t) {
  if (!t) {
    let t = a[i],
      e = s[i];
    return (
      "angle" === i && ((t = _normalizeAngle(t)), (e = _normalizeAngle(e))),
      { property: i, start: t, end: e }
    );
  }
}
function _pointsFromSegments(t, e) {
  const { x: i = null, y: a = null } = t || {},
    s = e.points,
    n = [];
  return (
    e.segments.forEach(({ start: t, end: e }) => {
      e = _findSegmentEnd(t, e, s);
      (t = s[t]), (e = s[e]);
      null !== a
        ? (n.push({ x: t.x, y: a }), n.push({ x: e.x, y: a }))
        : null !== i && (n.push({ x: i, y: t.y }), n.push({ x: i, y: e.y }));
    }),
    n
  );
}
function _findSegmentEnd(t, e, i) {
  for (; t < e; e--) {
    var a = i[e];
    if (!isNaN(a.x) && !isNaN(a.y)) break;
  }
  return e;
}
function _getEdge(t, e, i, a) {
  return t && e ? a(t[i], e[i]) : t ? t[i] : e ? e[i] : 0;
}
function _createBoundaryLine(t, e) {
  let i = [],
    a = !1;
  return (i = isArray(t) ? ((a = !0), t) : _pointsFromSegments(t, e)).length
    ? new LineElement({
        points: i,
        options: { tension: 0 },
        _loop: a,
        _fullLoop: a,
      })
    : null;
}
function _shouldApplyFill(t) {
  return t && !1 !== t.fill;
}
function _resolveTarget(t, e, i) {
  var a;
  let s = t[e].fill;
  const n = [e];
  if (!i) return s;
  for (; !1 !== s && -1 === n.indexOf(s); ) {
    if (!isNumberFinite(s)) return s;
    if (!(a = t[s])) return !1;
    if (a.visible) return s;
    n.push(s), (s = a.fill);
  }
  return !1;
}
function _decodeFill(t, e, i) {
  t = parseFillOption(t);
  if (isObject(t)) return !isNaN(t.value) && t;
  var a = parseFloat(t);
  return isNumberFinite(a) && Math.floor(a) === a
    ? decodeTargetIndex(t[0], e, a, i)
    : 0 <= ["origin", "start", "end", "stack", "shape"].indexOf(t) && t;
}
function decodeTargetIndex(t, e, i, a) {
  return (
    !((i = "-" !== t && "+" !== t ? i : e + i) === e || i < 0 || a <= i) && i
  );
}
function _getTargetPixel(t, e) {
  let i = null;
  return (
    "start" === t
      ? (i = e.bottom)
      : "end" === t
      ? (i = e.top)
      : isObject(t)
      ? (i = e.getPixelForValue(t.value))
      : e.getBasePixel && (i = e.getBasePixel()),
    i
  );
}
function _getTargetValue(t, e, i) {
  let a;
  return (a =
    "start" === t
      ? i
      : "end" === t
      ? e.options.reverse
        ? e.min
        : e.max
      : isObject(t)
      ? t.value
      : e.getBaseValue());
}
function parseFillOption(t) {
  var t = t.options,
    e = t.fill;
  let i = valueOrDefault(e && e.target, e);
  return (
    !1 !== (i = void 0 === i ? !!t.backgroundColor : i) &&
    null !== i &&
    (!0 === i ? "origin" : i)
  );
}
function _buildStackLine(t) {
  var { scale: t, index: e, line: i } = t,
    a = [],
    s = i.segments,
    n = i.points;
  const r = getLinesBelow(t, e);
  r.push(_createBoundaryLine({ x: null, y: t.bottom }, i));
  for (let t = 0; t < s.length; t++) {
    var o = s[t];
    for (let t = o.start; t <= o.end; t++) addPointsBelow(a, n[t], r);
  }
  return new LineElement({ points: a, options: {} });
}
function getLinesBelow(t, e) {
  const i = [];
  var a = t.getMatchingVisibleMetas("line");
  for (let t = 0; t < a.length; t++) {
    var s = a[t];
    if (s.index === e) break;
    s.hidden || i.unshift(s.dataset);
  }
  return i;
}
function addPointsBelow(e, i, a) {
  const s = [];
  for (let t = 0; t < a.length; t++) {
    var { first: n, last: r, point: o } = findPoint(a[t], i, "x");
    if (!(!o || (n && r)))
      if (n) s.unshift(o);
      else if ((e.push(o), !r)) break;
  }
  e.push(...s);
}
function findPoint(t, e, i) {
  e = t.interpolate(e, i);
  if (!e) return {};
  var a = e[i],
    s = t.segments,
    n = t.points;
  let r = !1,
    o = !1;
  for (let t = 0; t < s.length; t++) {
    var l = s[t],
      h = n[l.start][i],
      l = n[l.end][i];
    if (_isBetween(a, h, l)) {
      (r = a === h), (o = a === l);
      break;
    }
  }
  return { first: r, last: o, point: e };
}
class simpleArc {
  constructor(t) {
    (this.x = t.x), (this.y = t.y), (this.radius = t.radius);
  }
  pathSegment(t, e, i) {
    var { x: a, y: s, radius: n } = this;
    return (
      t.arc(a, s, n, (e = e || { start: 0, end: TAU }).end, e.start, !0),
      !i.bounds
    );
  }
  interpolate(t) {
    var { x: e, y: i, radius: a } = this,
      t = t.angle;
    return { x: e + Math.cos(t) * a, y: i + Math.sin(t) * a, angle: t };
  }
}
function _getTarget(t) {
  var { chart: e, fill: i, line: a } = t;
  if (isNumberFinite(i)) return getLineByIndex(e, i);
  if ("stack" === i) return _buildStackLine(t);
  if ("shape" === i) return !0;
  e = computeBoundary(t);
  return e instanceof simpleArc ? e : _createBoundaryLine(e, a);
}
function getLineByIndex(t, e) {
  var i = t.getDatasetMeta(e);
  return i && t.isDatasetVisible(e) ? i.dataset : null;
}
function computeBoundary(t) {
  return (
    (t.scale || {}).getPointPositionForValue
      ? computeCircularBoundary
      : computeLinearBoundary
  )(t);
}
function computeLinearBoundary(t) {
  const { scale: e = {}, fill: i } = t;
  var a,
    t = _getTargetPixel(i, e);
  return isNumberFinite(t)
    ? { x: (a = e.isHorizontal()) ? t : null, y: a ? null : t }
    : null;
}
function computeCircularBoundary(t) {
  const { scale: e, fill: i } = t;
  var t = e.options,
    a = e.getLabels().length,
    s = t.reverse ? e.max : e.min,
    n = _getTargetValue(i, e, s);
  const r = [];
  if (t.grid.circular)
    return (
      (t = e.getPointPositionForValue(0, s)),
      new simpleArc({
        x: t.x,
        y: t.y,
        radius: e.getDistanceFromCenterForValue(n),
      })
    );
  for (let t = 0; t < a; ++t) r.push(e.getPointPositionForValue(t, n));
  return r;
}
function _drawfill(t, e, i) {
  var a = _getTarget(e),
    { line: e, scale: s, axis: n } = e,
    r = e.options,
    o = r.fill,
    r = r.backgroundColor,
    { above: o = r, below: r = r } = o || {};
  a &&
    e.points.length &&
    (clipArea(t, i),
    doFill(t, {
      line: e,
      target: a,
      above: o,
      below: r,
      area: i,
      scale: s,
      axis: n,
    }),
    unclipArea(t));
}
function doFill(t, e) {
  var { line: i, target: a, above: s, below: n, area: r, scale: o } = e,
    e = i._loop ? "angle" : e.axis;
  t.save(),
    "x" === e &&
      n !== s &&
      (clipVertical(t, a, r.top),
      fill(t, { line: i, target: a, color: s, scale: o, property: e }),
      t.restore(),
      t.save(),
      clipVertical(t, a, r.bottom)),
    fill(t, { line: i, target: a, color: n, scale: o, property: e }),
    t.restore();
}
function clipVertical(t, e, i) {
  var { segments: a, points: s } = e;
  let n = !0,
    r = !1;
  t.beginPath();
  for (const d of a) {
    var { start: o, end: l } = d,
      h = s[o],
      o = s[_findSegmentEnd(o, l, s)];
    n ? (t.moveTo(h.x, h.y), (n = !1)) : (t.lineTo(h.x, i), t.lineTo(h.x, h.y)),
      (r = !!e.pathSegment(t, d, { move: r }))
        ? t.closePath()
        : t.lineTo(o.x, i);
  }
  t.lineTo(e.first().x, i), t.closePath(), t.clip();
}
function fill(e, t) {
  const { line: i, target: a, property: s, color: n, scale: r } = t;
  var o, l, h, d;
  for ({ source: o, target: l, start: h, end: d } of _segments(i, a, s)) {
    var { style: { backgroundColor: c = n } = {} } = o,
      u = !0 !== a,
      c =
        (e.save(),
        (e.fillStyle = c),
        clipBounds(e, r, u && _getBounds(s, h, d)),
        e.beginPath(),
        !!i.pathSegment(e, o));
    let t;
    u &&
      (c ? e.closePath() : interpolatedLineTo(e, a, d, s),
      (u = !!a.pathSegment(e, l, { move: c, reverse: !0 })),
      (t = c && u) || interpolatedLineTo(e, a, h, s)),
      e.closePath(),
      e.fill(t ? "evenodd" : "nonzero"),
      e.restore();
  }
}
function clipBounds(t, e, i) {
  var { top: e, bottom: a } = e.chart.chartArea,
    { property: i, start: s, end: n } = i || {};
  "x" === i && (t.beginPath(), t.rect(s, e, n - s, a - e), t.clip());
}
function interpolatedLineTo(t, e, i, a) {
  e = e.interpolate(i, a);
  e && t.lineTo(e.x, e.y);
}
var index = {
  id: "filler",
  afterDatasetsUpdate(t, e, i) {
    var a = (t.data.datasets || []).length;
    const s = [];
    let n, r, o, l;
    for (r = 0; r < a; ++r)
      (o = (n = t.getDatasetMeta(r)).dataset),
        (l = null),
        o &&
          o.options &&
          o instanceof LineElement &&
          (l = {
            visible: t.isDatasetVisible(r),
            index: r,
            fill: _decodeFill(o, r, a),
            chart: t,
            axis: n.controller.options.indexAxis,
            scale: n.vScale,
            line: o,
          }),
        (n.$filler = l),
        s.push(l);
    for (r = 0; r < a; ++r)
      (l = s[r]) &&
        !1 !== l.fill &&
        (l.fill = _resolveTarget(s, r, i.propagate));
  },
  beforeDraw(e, t, i) {
    var a = "beforeDraw" === i.drawTime,
      s = e.getSortedVisibleDatasetMetas(),
      n = e.chartArea;
    for (let t = s.length - 1; 0 <= t; --t) {
      const r = s[t].$filler;
      r &&
        (r.line.updateControlPoints(n, r.axis),
        a && r.fill && _drawfill(e.ctx, r, n));
    }
  },
  beforeDatasetsDraw(e, t, i) {
    if ("beforeDatasetsDraw" === i.drawTime) {
      var a = e.getSortedVisibleDatasetMetas();
      for (let t = a.length - 1; 0 <= t; --t) {
        var s = a[t].$filler;
        _shouldApplyFill(s) && _drawfill(e.ctx, s, e.chartArea);
      }
    }
  },
  beforeDatasetDraw(t, e, i) {
    e = e.meta.$filler;
    _shouldApplyFill(e) &&
      "beforeDatasetDraw" === i.drawTime &&
      _drawfill(t.ctx, e, t.chartArea);
  },
  defaults: { propagate: !0, drawTime: "beforeDatasetDraw" },
};
const getBoxSize = (t, e) => {
    let { boxHeight: i = e, boxWidth: a = e } = t;
    return (
      t.usePointStyle &&
        ((i = Math.min(i, e)), (a = t.pointStyleWidth || Math.min(a, e))),
      { boxWidth: a, boxHeight: i, itemHeight: Math.max(e, i) }
    );
  },
  itemsEqual = (t, e) =>
    null !== t &&
    null !== e &&
    t.datasetIndex === e.datasetIndex &&
    t.index === e.index;
class Legend extends Element {
  constructor(t) {
    super(),
      (this._added = !1),
      (this.legendHitBoxes = []),
      (this._hoveredItem = null),
      (this.doughnutMode = !1),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this.legendItems = void 0),
      (this.columnSizes = void 0),
      (this.lineWidths = void 0),
      (this.maxHeight = void 0),
      (this.maxWidth = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this._margins = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0);
  }
  update(t, e, i) {
    (this.maxWidth = t),
      (this.maxHeight = e),
      (this._margins = i),
      this.setDimensions(),
      this.buildLabels(),
      this.fit();
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth),
        (this.left = this._margins.left),
        (this.right = this.width))
      : ((this.height = this.maxHeight),
        (this.top = this._margins.top),
        (this.bottom = this.height));
  }
  buildLabels() {
    const i = this.options.labels || {};
    let t = callback(i.generateLabels, [this.chart], this) || [];
    i.filter && (t = t.filter((t) => i.filter(t, this.chart.data))),
      i.sort && (t = t.sort((t, e) => i.sort(t, e, this.chart.data))),
      this.options.reverse && t.reverse(),
      (this.legendItems = t);
  }
  fit() {
    const { options: i, ctx: a } = this;
    if (i.display) {
      var s = i.labels,
        n = toFont(s.font),
        r = n.size,
        o = this._computeTitleHeight(),
        { boxWidth: s, itemHeight: l } = getBoxSize(s, r);
      let t, e;
      (a.font = n.string),
        this.isHorizontal()
          ? ((t = this.maxWidth), (e = this._fitRows(o, r, s, l) + 10))
          : ((e = this.maxHeight), (t = this._fitCols(o, n, s, l) + 10)),
        (this.width = Math.min(t, i.maxWidth || this.maxWidth)),
        (this.height = Math.min(e, i.maxHeight || this.maxHeight));
    } else this.width = this.height = 0;
  }
  _fitRows(t, i, a, s) {
    const {
        ctx: n,
        maxWidth: r,
        options: {
          labels: { padding: o },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      h = (this.lineWidths = [0]),
      d = s + o;
    let c = t,
      u = ((n.textAlign = "left"), (n.textBaseline = "middle"), -1),
      g = -d;
    return (
      this.legendItems.forEach((t, e) => {
        t = a + i / 2 + n.measureText(t.text).width;
        (0 === e || h[h.length - 1] + t + 2 * o > r) &&
          ((c += d), (h[h.length - (0 < e ? 0 : 1)] = 0), (g += d), u++),
          (l[e] = { left: 0, top: g, row: u, width: t, height: s }),
          (h[h.length - 1] += t + o);
      }),
      c
    );
  }
  _fitCols(t, a, s, n) {
    const {
        ctx: r,
        maxHeight: e,
        options: {
          labels: { padding: o },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      h = (this.columnSizes = []),
      d = e - t;
    let c = o,
      u = 0,
      g = 0,
      p = 0,
      f = 0;
    return (
      this.legendItems.forEach((t, e) => {
        var { itemWidth: t, itemHeight: i } = calculateItemSize(s, a, r, t, n);
        0 < e &&
          g + i + 2 * o > d &&
          ((c += u + o),
          h.push({ width: u, height: g }),
          (p += u + o),
          f++,
          (u = g = 0)),
          (l[e] = { left: p, top: g, col: f, width: t, height: i }),
          (u = Math.max(u, t)),
          (g += i + o);
      }),
      (c += u),
      h.push({ width: u, height: g }),
      c
    );
  }
  adjustHitBoxes() {
    if (this.options.display) {
      var i = this._computeTitleHeight(),
        {
          legendHitBoxes: a,
          options: {
            align: s,
            labels: { padding: n },
            rtl: t,
          },
        } = this;
      const r = getRtlAdapter(t, this.left, this.width);
      if (this.isHorizontal()) {
        let t = 0,
          e = _alignStartEnd(s, this.left + n, this.right - this.lineWidths[t]);
        for (const o of a)
          t !== o.row &&
            ((t = o.row),
            (e = _alignStartEnd(
              s,
              this.left + n,
              this.right - this.lineWidths[t]
            ))),
            (o.top += this.top + i + n),
            (o.left = r.leftForLtr(r.x(e), o.width)),
            (e += o.width + n);
      } else {
        let t = 0,
          e = _alignStartEnd(
            s,
            this.top + i + n,
            this.bottom - this.columnSizes[t].height
          );
        for (const l of a)
          l.col !== t &&
            ((t = l.col),
            (e = _alignStartEnd(
              s,
              this.top + i + n,
              this.bottom - this.columnSizes[t].height
            ))),
            (l.top = e),
            (l.left += this.left + n),
            (l.left = r.leftForLtr(r.x(l.left), l.width)),
            (e += l.height + n);
      }
    }
  }
  isHorizontal() {
    return (
      "top" === this.options.position || "bottom" === this.options.position
    );
  }
  draw() {
    var t;
    this.options.display &&
      ((t = this.ctx), clipArea(t, this), this._draw(), unclipArea(t));
  }
  _draw() {
    const { options: u, columnSizes: g, lineWidths: p, ctx: f } = this,
      { align: m, labels: v } = u,
      x = defaults.color,
      b = getRtlAdapter(u.rtl, this.left, this.width),
      _ = toFont(v.font),
      y = v["padding"],
      k = _.size,
      S = k / 2;
    let D;
    this.drawTitle(),
      (f.textAlign = b.textAlign("left")),
      (f.textBaseline = "middle"),
      (f.lineWidth = 0.5),
      (f.font = _.string);
    const { boxWidth: M, boxHeight: P, itemHeight: w } = getBoxSize(v, k),
      A = this.isHorizontal(),
      C = this._computeTitleHeight(),
      O =
        ((D = A
          ? {
              x: _alignStartEnd(m, this.left + y, this.right - p[0]),
              y: this.top + y + C,
              line: 0,
            }
          : {
              x: this.left + y,
              y: _alignStartEnd(m, this.top + C + y, this.bottom - g[0].height),
              line: 0,
            }),
        overrideTextDirection(this.ctx, u.textDirection),
        w + y);
    this.legendItems.forEach((t, e) => {
      (f.strokeStyle = t.fontColor), (f.fillStyle = t.fontColor);
      var i = f.measureText(t.text).width,
        a = b.textAlign(t.textAlign || (t.textAlign = v.textAlign)),
        i = M + S + i;
      let s = D.x,
        n = D.y;
      b.setWidth(this.width),
        A
          ? 0 < e &&
            s + i + y > this.right &&
            ((n = D.y += O),
            D.line++,
            (s = D.x =
              _alignStartEnd(m, this.left + y, this.right - p[D.line])))
          : 0 < e &&
            n + O > this.bottom &&
            ((s = D.x = s + g[D.line].width + y),
            D.line++,
            (n = D.y =
              _alignStartEnd(
                m,
                this.top + C + y,
                this.bottom - g[D.line].height
              )));
      var r,
        o,
        l,
        h,
        d,
        c,
        e = b.x(s);
      (e = e),
        (h = n),
        (d = t),
        isNaN(M) ||
          M <= 0 ||
          isNaN(P) ||
          P < 0 ||
          (f.save(),
          (r = valueOrDefault(d.lineWidth, 1)),
          (f.fillStyle = valueOrDefault(d.fillStyle, x)),
          (f.lineCap = valueOrDefault(d.lineCap, "butt")),
          (f.lineDashOffset = valueOrDefault(d.lineDashOffset, 0)),
          (f.lineJoin = valueOrDefault(d.lineJoin, "miter")),
          (f.lineWidth = r),
          (f.strokeStyle = valueOrDefault(d.strokeStyle, x)),
          f.setLineDash(valueOrDefault(d.lineDash, [])),
          v.usePointStyle
            ? ((o = {
                radius: (P * Math.SQRT2) / 2,
                pointStyle: d.pointStyle,
                rotation: d.rotation,
                borderWidth: r,
              }),
              (l = b.xPlus(e, M / 2)),
              (c = h + S),
              drawPointLegend(f, o, l, c, v.pointStyleWidth && M))
            : ((o = h + Math.max((k - P) / 2, 0)),
              (l = b.leftForLtr(e, M)),
              (c = toTRBLCorners(d.borderRadius)),
              f.beginPath(),
              Object.values(c).some((t) => 0 !== t)
                ? addRoundedRectPath(f, { x: l, y: o, w: M, h: P, radius: c })
                : f.rect(l, o, M, P),
              f.fill(),
              0 !== r && f.stroke()),
          f.restore()),
        (s = _textX(a, s + M + S, A ? s + i : this.right, u.rtl)),
        (h = b.x(s)),
        (e = n),
        (d = t),
        renderText(f, d.text, h, e + w / 2, _, {
          strikethrough: d.hidden,
          textAlign: b.textAlign(d.textAlign),
        }),
        A
          ? (D.x += i + y)
          : "string" != typeof t.text
          ? ((c = _.lineHeight), (D.y += calculateLegendItemHeight(t, c)))
          : (D.y += O);
    }),
      restoreTextDirection(this.ctx, u.textDirection);
  }
  drawTitle() {
    var a = this.options,
      s = a.title,
      n = toFont(s.font),
      r = toPadding(s.padding);
    if (s.display) {
      const h = getRtlAdapter(a.rtl, this.left, this.width),
        d = this.ctx;
      var o = s.position,
        l = n.size / 2,
        r = r.top + l;
      let t,
        e = this.left,
        i = this.width;
      this.isHorizontal()
        ? ((i = Math.max(...this.lineWidths)),
          (t = this.top + r),
          (e = _alignStartEnd(a.align, e, this.right - i)))
        : ((l = this.columnSizes.reduce((t, e) => Math.max(t, e.height), 0)),
          (t =
            r +
            _alignStartEnd(
              a.align,
              this.top,
              this.bottom - l - a.labels.padding - this._computeTitleHeight()
            )));
      r = _alignStartEnd(o, e, e + i);
      (d.textAlign = h.textAlign(_toLeftRightCenter(o))),
        (d.textBaseline = "middle"),
        (d.strokeStyle = s.color),
        (d.fillStyle = s.color),
        (d.font = n.string),
        renderText(d, s.text, r, t, n);
    }
  }
  _computeTitleHeight() {
    var t = this.options.title,
      e = toFont(t.font),
      i = toPadding(t.padding);
    return t.display ? e.lineHeight + i.height : 0;
  }
  _getLegendItemAt(t, e) {
    let i, a, s;
    if (
      _isBetween(t, this.left, this.right) &&
      _isBetween(e, this.top, this.bottom)
    )
      for (s = this.legendHitBoxes, i = 0; i < s.length; ++i)
        if (
          ((a = s[i]),
          _isBetween(t, a.left, a.left + a.width) &&
            _isBetween(e, a.top, a.top + a.height))
        )
          return this.legendItems[i];
    return null;
  }
  handleEvent(t) {
    var e,
      i,
      a,
      s = this.options;
    isListened(t.type, s) &&
      ((e = this._getLegendItemAt(t.x, t.y)),
      "mousemove" === t.type || "mouseout" === t.type
        ? ((i = this._hoveredItem),
          (a = itemsEqual(i, e)),
          i && !a && callback(s.onLeave, [t, i, this], this),
          (this._hoveredItem = e) &&
            !a &&
            callback(s.onHover, [t, e, this], this))
        : e && callback(s.onClick, [t, e, this], this));
  }
}
function calculateItemSize(t, e, i, a, s) {
  return {
    itemWidth: calculateItemWidth(a, t, e, i),
    itemHeight: calculateItemHeight(s, a, e.lineHeight),
  };
}
function calculateItemWidth(t, e, i, a) {
  let s = t.text;
  return (
    s &&
      "string" != typeof s &&
      (s = s.reduce((t, e) => (t.length > e.length ? t : e))),
    e + i.size / 2 + a.measureText(s).width
  );
}
function calculateItemHeight(t, e, i) {
  let a = t;
  return (a = "string" != typeof e.text ? calculateLegendItemHeight(e, i) : a);
}
function calculateLegendItemHeight(t, e) {
  return e * (t.text ? t.text.length + 0.5 : 0);
}
function isListened(t, e) {
  return (
    !(("mousemove" !== t && "mouseout" !== t) || (!e.onHover && !e.onLeave)) ||
    !(!e.onClick || ("click" !== t && "mouseup" !== t))
  );
}
var plugin_legend = {
  id: "legend",
  _element: Legend,
  start(t, e, i) {
    var a = (t.legend = new Legend({ ctx: t.ctx, options: i, chart: t }));
    layouts.configure(t, a, i), layouts.addBox(t, a);
  },
  stop(t) {
    layouts.removeBox(t, t.legend), delete t.legend;
  },
  beforeUpdate(t, e, i) {
    const a = t.legend;
    layouts.configure(t, a, i), (a.options = i);
  },
  afterUpdate(t) {
    const e = t.legend;
    e.buildLabels(), e.adjustHitBoxes();
  },
  afterEvent(t, e) {
    e.replay || t.legend.handleEvent(e.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(t, e, i) {
      var a = e.datasetIndex;
      const s = i.chart;
      s.isDatasetVisible(a)
        ? (s.hide(a), (e.hidden = !0))
        : (s.show(a), (e.hidden = !1));
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (t) => t.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(t) {
        const a = t.data.datasets,
          {
            usePointStyle: s,
            pointStyle: n,
            textAlign: r,
            color: o,
            useBorderRadius: l,
            borderRadius: h,
          } = t.legend.options["labels"];
        return t._getSortedDatasetMetas().map((t) => {
          var e = t.controller.getStyle(s ? 0 : void 0),
            i = toPadding(e.borderWidth);
          return {
            text: a[t.index].label,
            fillStyle: e.backgroundColor,
            fontColor: o,
            hidden: !t.visible,
            lineCap: e.borderCapStyle,
            lineDash: e.borderDash,
            lineDashOffset: e.borderDashOffset,
            lineJoin: e.borderJoinStyle,
            lineWidth: (i.width + i.height) / 4,
            strokeStyle: e.borderColor,
            pointStyle: n || e.pointStyle,
            rotation: e.rotation,
            textAlign: r || e.textAlign,
            borderRadius: l && (h || e.borderRadius),
            datasetIndex: t.index,
          };
        }, this);
      },
    },
    title: {
      color: (t) => t.chart.options.color,
      display: !1,
      position: "center",
      text: "",
    },
  },
  descriptors: {
    _scriptable: (t) => !t.startsWith("on"),
    labels: {
      _scriptable: (t) => !["generateLabels", "filter", "sort"].includes(t),
    },
  },
};
class Title extends Element {
  constructor(t) {
    super(),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this._padding = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0);
  }
  update(t, e) {
    var i = this.options;
    (this.left = 0),
      (this.top = 0),
      i.display
        ? ((this.width = this.right = t),
          (this.height = this.bottom = e),
          (t = isArray(i.text) ? i.text.length : 1),
          (this._padding = toPadding(i.padding)),
          (e = t * toFont(i.font).lineHeight + this._padding.height),
          this.isHorizontal() ? (this.height = e) : (this.width = e))
        : (this.width = this.height = this.right = this.bottom = 0);
  }
  isHorizontal() {
    var t = this.options.position;
    return "top" === t || "bottom" === t;
  }
  _drawArgs(t) {
    var { top: e, left: i, bottom: a, right: s, options: n } = this,
      r = n.align;
    let o = 0,
      l,
      h,
      d;
    return (
      (l = this.isHorizontal()
        ? ((h = _alignStartEnd(r, i, s)), (d = e + t), s - i)
        : ((o =
            "left" === n.position
              ? ((h = i + t), (d = _alignStartEnd(r, a, e)), -0.5 * PI)
              : ((h = s - t), (d = _alignStartEnd(r, e, a)), 0.5 * PI)),
          a - e)),
      { titleX: h, titleY: d, maxWidth: l, rotation: o }
    );
  }
  draw() {
    var t,
      e,
      i,
      a,
      s,
      n = this.ctx,
      r = this.options;
    r.display &&
      ((e = (t = toFont(r.font)).lineHeight / 2 + this._padding.top),
      ({ titleX: e, titleY: i, maxWidth: a, rotation: s } = this._drawArgs(e)),
      renderText(n, r.text, 0, 0, t, {
        color: r.color,
        maxWidth: a,
        rotation: s,
        textAlign: _toLeftRightCenter(r.align),
        textBaseline: "middle",
        translation: [e, i],
      }));
  }
}
function createTitle(t, e) {
  var i = new Title({ ctx: t.ctx, options: e, chart: t });
  layouts.configure(t, i, e), layouts.addBox(t, i), (t.titleBlock = i);
}
var plugin_title = {
  id: "title",
  _element: Title,
  start(t, e, i) {
    createTitle(t, i);
  },
  stop(t) {
    var e = t.titleBlock;
    layouts.removeBox(t, e), delete t.titleBlock;
  },
  beforeUpdate(t, e, i) {
    const a = t.titleBlock;
    layouts.configure(t, a, i), (a.options = i);
  },
  defaults: {
    align: "center",
    display: !1,
    font: { weight: "bold" },
    fullSize: !0,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3,
  },
  defaultRoutes: { color: "color" },
  descriptors: { _scriptable: !0, _indexable: !1 },
};
const map = new WeakMap();
var plugin_subtitle = {
  id: "subtitle",
  start(t, e, i) {
    var a = new Title({ ctx: t.ctx, options: i, chart: t });
    layouts.configure(t, a, i), layouts.addBox(t, a), map.set(t, a);
  },
  stop(t) {
    layouts.removeBox(t, map.get(t)), map.delete(t);
  },
  beforeUpdate(t, e, i) {
    const a = map.get(t);
    layouts.configure(t, a, i), (a.options = i);
  },
  defaults: {
    align: "center",
    display: !1,
    font: { weight: "normal" },
    fullSize: !0,
    padding: 0,
    position: "top",
    text: "",
    weight: 1500,
  },
  defaultRoutes: { color: "color" },
  descriptors: { _scriptable: !0, _indexable: !1 },
};
const positioners = {
  average(t) {
    if (!t.length) return !1;
    let e,
      i,
      a = 0,
      s = 0,
      n = 0;
    for (e = 0, i = t.length; e < i; ++e) {
      const o = t[e].element;
      var r;
      o &&
        o.hasValue() &&
        ((r = o.tooltipPosition()), (a += r.x), (s += r.y), ++n);
    }
    return { x: a / n, y: s / n };
  },
  nearest(t, e) {
    if (!t.length) return !1;
    let i = e.x,
      a = e.y,
      s = Number.POSITIVE_INFINITY,
      n,
      r,
      o;
    for (n = 0, r = t.length; n < r; ++n) {
      const d = t[n].element;
      var l;
      d &&
        d.hasValue() &&
        ((l = d.getCenterPoint()),
        (l = distanceBetweenPoints(e, l)) < s && ((s = l), (o = d)));
    }
    var h;
    return (
      o && ((h = o.tooltipPosition()), (i = h.x), (a = h.y)), { x: i, y: a }
    );
  },
};
function pushOrConcat(t, e) {
  return e && (isArray(e) ? Array.prototype.push.apply(t, e) : t.push(e)), t;
}
function splitNewlines(t) {
  return ("string" == typeof t || t instanceof String) && -1 < t.indexOf("\n")
    ? t.split("\n")
    : t;
}
function createTooltipItem(t, e) {
  var { element: e, datasetIndex: i, index: a } = e;
  const s = t.getDatasetMeta(i).controller;
  var { label: n, value: r } = s.getLabelAndValue(a);
  return {
    chart: t,
    label: n,
    parsed: s.getParsed(a),
    raw: t.data.datasets[i].data[a],
    formattedValue: r,
    dataset: s.getDataset(),
    dataIndex: a,
    datasetIndex: i,
    element: e,
  };
}
function getTooltipSize(t, e) {
  const i = t.chart.ctx,
    { body: a, footer: s, title: n } = t;
  var { boxWidth: r, boxHeight: o } = e,
    l = toFont(e.bodyFont),
    h = toFont(e.titleFont),
    d = toFont(e.footerFont),
    c = n.length,
    u = s.length,
    g = a.length,
    p = toPadding(e.padding);
  let f = p.height,
    m = 0;
  var v = a.reduce(
    (t, e) => t + e.before.length + e.lines.length + e.after.length,
    0
  );
  (v += t.beforeBody.length + t.afterBody.length),
    c &&
      (f += c * h.lineHeight + (c - 1) * e.titleSpacing + e.titleMarginBottom),
    v &&
      ((c = e.displayColors ? Math.max(o, l.lineHeight) : l.lineHeight),
      (f += g * c + (v - g) * l.lineHeight + (v - 1) * e.bodySpacing)),
    u &&
      (f += e.footerMarginTop + u * d.lineHeight + (u - 1) * e.footerSpacing);
  let x = 0;
  function b(t) {
    m = Math.max(m, i.measureText(t).width + x);
  }
  return (
    i.save(),
    (i.font = h.string),
    each(t.title, b),
    (i.font = l.string),
    each(t.beforeBody.concat(t.afterBody), b),
    (x = e.displayColors ? r + 2 + e.boxPadding : 0),
    each(a, (t) => {
      each(t.before, b), each(t.lines, b), each(t.after, b);
    }),
    (x = 0),
    (i.font = d.string),
    each(t.footer, b),
    i.restore(),
    { width: (m += p.width), height: f }
  );
}
function determineYAlign(t, e) {
  var { y: e, height: i } = e;
  return e < i / 2 ? "top" : e > t.height - i / 2 ? "bottom" : "center";
}
function doesNotFitWithAlign(t, e, i, a) {
  var { x: a, width: s } = a,
    i = i.caretSize + i.caretPadding;
  return (
    ("left" === t && a + s + i > e.width) ||
    ("right" === t && a - s - i < 0) ||
    void 0
  );
}
function determineXAlign(t, e, i, a) {
  var { x: s, width: n } = i,
    {
      width: r,
      chartArea: { left: o, right: l },
    } = t;
  let h = "center";
  return (
    "center" === a
      ? (h = s <= (o + l) / 2 ? "left" : "right")
      : s <= n / 2
      ? (h = "left")
      : r - n / 2 <= s && (h = "right"),
    (h = doesNotFitWithAlign(h, t, e, i) ? "center" : h)
  );
}
function determineAlignment(t, e, i) {
  var a = i.yAlign || e.yAlign || determineYAlign(t, i);
  return {
    xAlign: i.xAlign || e.xAlign || determineXAlign(t, e, i, a),
    yAlign: a,
  };
}
function alignX(t, e) {
  let { x: i, width: a } = t;
  return "right" === e ? (i -= a) : "center" === e && (i -= a / 2), i;
}
function alignY(t, e, i) {
  let { y: a, height: s } = t;
  return "top" === e ? (a += i) : (a -= "bottom" === e ? s + i : s / 2), a;
}
function getBackgroundPoint(t, e, i, a) {
  var { caretSize: t, caretPadding: s, cornerRadius: n } = t,
    { xAlign: i, yAlign: r } = i,
    s = t + s,
    {
      topLeft: n,
      topRight: o,
      bottomLeft: l,
      bottomRight: h,
    } = toTRBLCorners(n);
  let d = alignX(e, i);
  var c = alignY(e, r, s);
  return (
    "center" === r
      ? "left" === i
        ? (d += s)
        : "right" === i && (d -= s)
      : "left" === i
      ? (d -= Math.max(n, l) + t)
      : "right" === i && (d += Math.max(o, h) + t),
    {
      x: _limitValue(d, 0, a.width - e.width),
      y: _limitValue(c, 0, a.height - e.height),
    }
  );
}
function getAlignedX(t, e, i) {
  i = toPadding(i.padding);
  return "center" === e
    ? t.x + t.width / 2
    : "right" === e
    ? t.x + t.width - i.right
    : t.x + i.left;
}
function getBeforeAfterBodyLines(t) {
  return pushOrConcat([], splitNewlines(t));
}
function createTooltipContext(t, e, i) {
  return createContext(t, { tooltip: e, tooltipItems: i, type: "tooltip" });
}
function overrideCallbacks(t, e) {
  e = e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks;
  return e ? t.override(e) : t;
}
const defaultCallbacks = {
  beforeTitle: noop,
  title(t) {
    if (0 < t.length) {
      var t = t[0],
        e = t.chart.data.labels,
        i = e ? e.length : 0;
      if (this && this.options && "dataset" === this.options.mode)
        return t.dataset.label || "";
      if (t.label) return t.label;
      if (0 < i && t.dataIndex < i) return e[t.dataIndex];
    }
    return "";
  },
  afterTitle: noop,
  beforeBody: noop,
  beforeLabel: noop,
  label(t) {
    if (this && this.options && "dataset" === this.options.mode)
      return t.label + ": " + t.formattedValue || t.formattedValue;
    let e = t.dataset.label || "";
    e && (e += ": ");
    t = t.formattedValue;
    return isNullOrUndef(t) || (e += t), e;
  },
  labelColor(t) {
    const e = t.chart.getDatasetMeta(t.datasetIndex);
    t = e.controller.getStyle(t.dataIndex);
    return {
      borderColor: t.borderColor,
      backgroundColor: t.backgroundColor,
      borderWidth: t.borderWidth,
      borderDash: t.borderDash,
      borderDashOffset: t.borderDashOffset,
      borderRadius: 0,
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(t) {
    const e = t.chart.getDatasetMeta(t.datasetIndex);
    t = e.controller.getStyle(t.dataIndex);
    return { pointStyle: t.pointStyle, rotation: t.rotation };
  },
  afterLabel: noop,
  afterBody: noop,
  beforeFooter: noop,
  footer: noop,
  afterFooter: noop,
};
function invokeCallbackWithFallback(t, e, i, a) {
  t = t[e].call(i, a);
  return void 0 === t ? defaultCallbacks[e].call(i, a) : t;
}
class Tooltip extends Element {
  static positioners = positioners;
  constructor(t) {
    super(),
      (this.opacity = 0),
      (this._active = []),
      (this._eventPosition = void 0),
      (this._size = void 0),
      (this._cachedAnimations = void 0),
      (this._tooltipItems = []),
      (this.$animations = void 0),
      (this.$context = void 0),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.dataPoints = void 0),
      (this.title = void 0),
      (this.beforeBody = void 0),
      (this.body = void 0),
      (this.afterBody = void 0),
      (this.footer = void 0),
      (this.xAlign = void 0),
      (this.yAlign = void 0),
      (this.x = void 0),
      (this.y = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this.caretX = void 0),
      (this.caretY = void 0),
      (this.labelColors = void 0),
      (this.labelPointStyles = void 0),
      (this.labelTextColors = void 0);
  }
  initialize(t) {
    (this.options = t),
      (this._cachedAnimations = void 0),
      (this.$context = void 0);
  }
  _resolveAnimations() {
    var t = this._cachedAnimations;
    if (t) return t;
    var t = this.chart,
      e = this.options.setContext(this.getContext()),
      t = e.enabled && t.options.animation && e.animations,
      e = new Animations(this.chart, t);
    return t._cacheable && (this._cachedAnimations = Object.freeze(e)), e;
  }
  getContext() {
    return (
      this.$context ||
      (this.$context = createTooltipContext(
        this.chart.getContext(),
        this,
        this._tooltipItems
      ))
    );
  }
  getTitle(t, e) {
    var e = e["callbacks"],
      i = invokeCallbackWithFallback(e, "beforeTitle", this, t),
      a = invokeCallbackWithFallback(e, "title", this, t),
      e = invokeCallbackWithFallback(e, "afterTitle", this, t),
      t = pushOrConcat([], splitNewlines(i));
    return (
      (t = pushOrConcat(t, splitNewlines(a))), pushOrConcat(t, splitNewlines(e))
    );
  }
  getBeforeBody(t, e) {
    return getBeforeAfterBodyLines(
      invokeCallbackWithFallback(e.callbacks, "beforeBody", this, t)
    );
  }
  getBody(t, e) {
    const a = e["callbacks"],
      s = [];
    return (
      each(t, (t) => {
        var e = { before: [], lines: [], after: [] },
          i = overrideCallbacks(a, t);
        pushOrConcat(
          e.before,
          splitNewlines(invokeCallbackWithFallback(i, "beforeLabel", this, t))
        ),
          pushOrConcat(
            e.lines,
            invokeCallbackWithFallback(i, "label", this, t)
          ),
          pushOrConcat(
            e.after,
            splitNewlines(invokeCallbackWithFallback(i, "afterLabel", this, t))
          ),
          s.push(e);
      }),
      s
    );
  }
  getAfterBody(t, e) {
    return getBeforeAfterBodyLines(
      invokeCallbackWithFallback(e.callbacks, "afterBody", this, t)
    );
  }
  getFooter(t, e) {
    var e = e["callbacks"],
      i = invokeCallbackWithFallback(e, "beforeFooter", this, t),
      a = invokeCallbackWithFallback(e, "footer", this, t),
      e = invokeCallbackWithFallback(e, "afterFooter", this, t),
      t = pushOrConcat([], splitNewlines(i));
    return (
      (t = pushOrConcat(t, splitNewlines(a))), pushOrConcat(t, splitNewlines(e))
    );
  }
  _createItems(a) {
    var t = this._active;
    const s = this.chart.data,
      i = [],
      n = [],
      r = [];
    let e = [],
      o,
      l;
    for (o = 0, l = t.length; o < l; ++o)
      e.push(createTooltipItem(this.chart, t[o]));
    return (
      a.filter && (e = e.filter((t, e, i) => a.filter(t, e, i, s))),
      a.itemSort && (e = e.sort((t, e) => a.itemSort(t, e, s))),
      each(e, (t) => {
        var e = overrideCallbacks(a.callbacks, t);
        i.push(invokeCallbackWithFallback(e, "labelColor", this, t)),
          n.push(invokeCallbackWithFallback(e, "labelPointStyle", this, t)),
          r.push(invokeCallbackWithFallback(e, "labelTextColor", this, t));
      }),
      (this.labelColors = i),
      (this.labelPointStyles = n),
      (this.labelTextColors = r),
      (this.dataPoints = e)
    );
  }
  update(t, e) {
    const i = this.options.setContext(this.getContext());
    var a,
      s,
      n,
      r = this._active;
    let o,
      l = [];
    r.length
      ? ((r = positioners[i.position].call(this, r, this._eventPosition)),
        (l = this._createItems(i)),
        (this.title = this.getTitle(l, i)),
        (this.beforeBody = this.getBeforeBody(l, i)),
        (this.body = this.getBody(l, i)),
        (this.afterBody = this.getAfterBody(l, i)),
        (this.footer = this.getFooter(l, i)),
        (a = this._size = getTooltipSize(this, i)),
        (n = Object.assign({}, r, a)),
        (s = determineAlignment(this.chart, i, n)),
        (n = getBackgroundPoint(i, n, s, this.chart)),
        (this.xAlign = s.xAlign),
        (this.yAlign = s.yAlign),
        (o = {
          opacity: 1,
          x: n.x,
          y: n.y,
          width: a.width,
          height: a.height,
          caretX: r.x,
          caretY: r.y,
        }))
      : 0 !== this.opacity && (o = { opacity: 0 }),
      (this._tooltipItems = l),
      (this.$context = void 0),
      o && this._resolveAnimations().update(this, o),
      t &&
        i.external &&
        i.external.call(this, { chart: this.chart, tooltip: this, replay: e });
  }
  drawCaret(t, e, i, a) {
    t = this.getCaretPosition(t, i, a);
    e.lineTo(t.x1, t.y1), e.lineTo(t.x2, t.y2), e.lineTo(t.x3, t.y3);
  }
  getCaretPosition(t, e, i) {
    var { xAlign: a, yAlign: s } = this,
      { caretSize: i, cornerRadius: n } = i,
      {
        topLeft: n,
        topRight: r,
        bottomLeft: o,
        bottomRight: l,
      } = toTRBLCorners(n),
      { x: t, y: h } = t,
      { width: e, height: d } = e;
    let c, u, g, p, f, m;
    return (
      "center" === s
        ? ((f = h + d / 2),
          (m =
            "left" === a
              ? ((c = t), (u = c - i), (p = f + i), f - i)
              : ((c = t + e), (u = c + i), (p = f - i), f + i)),
          (g = c))
        : ((u =
            "left" === a
              ? t + Math.max(n, o) + i
              : "right" === a
              ? t + e - Math.max(r, l) - i
              : this.caretX),
          (g =
            "top" === s
              ? ((p = h), (f = p - i), (c = u - i), u + i)
              : ((p = h + d), (f = p + i), (c = u + i), u - i)),
          (m = p)),
      { x1: c, x2: u, x3: g, y1: p, y2: f, y3: m }
    );
  }
  drawTitle(t, e, i) {
    var a = this.title,
      s = a.length;
    let n, r, o;
    if (s) {
      const l = getRtlAdapter(i.rtl, this.x, this.width);
      for (
        t.x = getAlignedX(this, i.titleAlign, i),
          e.textAlign = l.textAlign(i.titleAlign),
          e.textBaseline = "middle",
          n = toFont(i.titleFont),
          r = i.titleSpacing,
          e.fillStyle = i.titleColor,
          e.font = n.string,
          o = 0;
        o < s;
        ++o
      )
        e.fillText(a[o], l.x(t.x), t.y + n.lineHeight / 2),
          (t.y += n.lineHeight + r),
          o + 1 === s && (t.y += i.titleMarginBottom - r);
    }
  }
  _drawColorBox(t, e, i, a, s) {
    var n,
      r = this.labelColors[i],
      o = this.labelPointStyles[i],
      { boxHeight: l, boxWidth: h } = s,
      d = toFont(s.bodyFont),
      c = getAlignedX(this, "left", s),
      c = a.x(c),
      d = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0,
      e = e.y + d;
    s.usePointStyle
      ? ((d = {
          radius: Math.min(h, l) / 2,
          pointStyle: o.pointStyle,
          rotation: o.rotation,
          borderWidth: 1,
        }),
        (o = a.leftForLtr(c, h) + h / 2),
        (n = e + l / 2),
        (t.strokeStyle = s.multiKeyBackground),
        (t.fillStyle = s.multiKeyBackground),
        drawPoint(t, d, o, n),
        (t.strokeStyle = r.borderColor),
        (t.fillStyle = r.backgroundColor),
        drawPoint(t, d, o, n))
      : ((t.lineWidth = isObject(r.borderWidth)
          ? Math.max(...Object.values(r.borderWidth))
          : r.borderWidth || 1),
        (t.strokeStyle = r.borderColor),
        t.setLineDash(r.borderDash || []),
        (t.lineDashOffset = r.borderDashOffset || 0),
        (d = a.leftForLtr(c, h)),
        (o = a.leftForLtr(a.xPlus(c, 1), h - 2)),
        (n = toTRBLCorners(r.borderRadius)),
        Object.values(n).some((t) => 0 !== t)
          ? (t.beginPath(),
            (t.fillStyle = s.multiKeyBackground),
            addRoundedRectPath(t, { x: d, y: e, w: h, h: l, radius: n }),
            t.fill(),
            t.stroke(),
            (t.fillStyle = r.backgroundColor),
            t.beginPath(),
            addRoundedRectPath(t, {
              x: o,
              y: e + 1,
              w: h - 2,
              h: l - 2,
              radius: n,
            }),
            t.fill())
          : ((t.fillStyle = s.multiKeyBackground),
            t.fillRect(d, e, h, l),
            t.strokeRect(d, e, h, l),
            (t.fillStyle = r.backgroundColor),
            t.fillRect(o, e + 1, h - 2, l - 2))),
      (t.fillStyle = this.labelTextColors[i]);
  }
  drawBody(e, i, t) {
    var a = this["body"];
    const {
      bodySpacing: s,
      bodyAlign: n,
      displayColors: r,
      boxHeight: o,
      boxWidth: l,
      boxPadding: h,
    } = t;
    var d = toFont(t.bodyFont);
    let c = d.lineHeight,
      u = 0;
    const g = getRtlAdapter(t.rtl, this.x, this.width);
    function p(t) {
      i.fillText(t, g.x(e.x + u), e.y + c / 2), (e.y += c + s);
    }
    var f = g.textAlign(n);
    let m, v, x, b, _, y, k;
    for (
      i.textAlign = n,
        i.textBaseline = "middle",
        i.font = d.string,
        e.x = getAlignedX(this, f, t),
        i.fillStyle = t.bodyColor,
        each(this.beforeBody, p),
        u = r && "right" !== f ? ("center" === n ? l / 2 + h : l + 2 + h) : 0,
        b = 0,
        y = a.length;
      b < y;
      ++b
    ) {
      for (
        m = a[b],
          v = this.labelTextColors[b],
          i.fillStyle = v,
          each(m.before, p),
          x = m.lines,
          r &&
            x.length &&
            (this._drawColorBox(i, e, b, g, t),
            (c = Math.max(d.lineHeight, o))),
          _ = 0,
          k = x.length;
        _ < k;
        ++_
      )
        p(x[_]), (c = d.lineHeight);
      each(m.after, p);
    }
    (u = 0), (c = d.lineHeight), each(this.afterBody, p), (e.y -= s);
  }
  drawFooter(t, e, i) {
    var a = this.footer,
      s = a.length;
    let n, r;
    if (s) {
      const o = getRtlAdapter(i.rtl, this.x, this.width);
      for (
        t.x = getAlignedX(this, i.footerAlign, i),
          t.y += i.footerMarginTop,
          e.textAlign = o.textAlign(i.footerAlign),
          e.textBaseline = "middle",
          n = toFont(i.footerFont),
          e.fillStyle = i.footerColor,
          e.font = n.string,
          r = 0;
        r < s;
        ++r
      )
        e.fillText(a[r], o.x(t.x), t.y + n.lineHeight / 2),
          (t.y += n.lineHeight + i.footerSpacing);
    }
  }
  drawBackground(t, e, i, a) {
    var { xAlign: s, yAlign: n } = this,
      { x: r, y: o } = t,
      { width: l, height: h } = i,
      {
        topLeft: d,
        topRight: c,
        bottomLeft: u,
        bottomRight: g,
      } = toTRBLCorners(a.cornerRadius);
    (e.fillStyle = a.backgroundColor),
      (e.strokeStyle = a.borderColor),
      (e.lineWidth = a.borderWidth),
      e.beginPath(),
      e.moveTo(r + d, o),
      "top" === n && this.drawCaret(t, e, i, a),
      e.lineTo(r + l - c, o),
      e.quadraticCurveTo(r + l, o, r + l, o + c),
      "center" === n && "right" === s && this.drawCaret(t, e, i, a),
      e.lineTo(r + l, o + h - g),
      e.quadraticCurveTo(r + l, o + h, r + l - g, o + h),
      "bottom" === n && this.drawCaret(t, e, i, a),
      e.lineTo(r + u, o + h),
      e.quadraticCurveTo(r, o + h, r, o + h - u),
      "center" === n && "left" === s && this.drawCaret(t, e, i, a),
      e.lineTo(r, o + d),
      e.quadraticCurveTo(r, o, r + d, o),
      e.closePath(),
      e.fill(),
      0 < a.borderWidth && e.stroke();
  }
  _updateAnimationTarget(t) {
    var e,
      i,
      a,
      s = this.chart,
      n = this.$animations,
      r = n && n.x,
      n = n && n.y;
    (r || n) &&
      (e = positioners[t.position].call(
        this,
        this._active,
        this._eventPosition
      )) &&
      ((i = this._size = getTooltipSize(this, t)),
      (a = getBackgroundPoint(
        t,
        (a = Object.assign({}, e, this._size)),
        (t = determineAlignment(s, t, a)),
        s
      )),
      (r._to === a.x && n._to === a.y) ||
        ((this.xAlign = t.xAlign),
        (this.yAlign = t.yAlign),
        (this.width = i.width),
        (this.height = i.height),
        (this.caretX = e.x),
        (this.caretY = e.y),
        this._resolveAnimations().update(this, a)));
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    var e = this.options.setContext(this.getContext());
    let i = this.opacity;
    if (i) {
      this._updateAnimationTarget(e);
      var a = { width: this.width, height: this.height };
      const r = { x: this.x, y: this.y };
      i = Math.abs(i) < 0.001 ? 0 : i;
      var s = toPadding(e.padding),
        n =
          this.title.length ||
          this.beforeBody.length ||
          this.body.length ||
          this.afterBody.length ||
          this.footer.length;
      e.enabled &&
        n &&
        (t.save(),
        (t.globalAlpha = i),
        this.drawBackground(r, t, a, e),
        overrideTextDirection(t, e.textDirection),
        (r.y += s.top),
        this.drawTitle(r, t, e),
        this.drawBody(r, t, e),
        this.drawFooter(r, t, e),
        restoreTextDirection(t, e.textDirection),
        t.restore());
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    var i = this._active,
      t = t.map(({ datasetIndex: t, index: e }) => {
        var i = this.chart.getDatasetMeta(t);
        if (i) return { datasetIndex: t, element: i.data[e], index: e };
        throw new Error("Cannot find a dataset at index " + t);
      }),
      i = !_elementsEqual(i, t),
      a = this._positionChanged(t, e);
    (i || a) &&
      ((this._active = t),
      (this._eventPosition = e),
      (this._ignoreReplayEvents = !0),
      this.update(!0));
  }
  handleEvent(t, e, i = !0) {
    if (e && this._ignoreReplayEvents) return !1;
    this._ignoreReplayEvents = !1;
    var a = this.options,
      s = this._active || [],
      i = this._getActiveElements(t, s, e, i),
      n = this._positionChanged(i, t),
      s = e || !_elementsEqual(i, s) || n;
    return (
      s &&
        ((this._active = i),
        (a.enabled || a.external) &&
          ((this._eventPosition = { x: t.x, y: t.y }), this.update(!0, e))),
      s
    );
  }
  _getActiveElements(t, e, i, a) {
    var s = this.options;
    if ("mouseout" === t.type) return [];
    if (!a) return e;
    const n = this.chart.getElementsAtEventForMode(t, s.mode, s, i);
    return s.reverse && n.reverse(), n;
  }
  _positionChanged(t, e) {
    var { caretX: i, caretY: a, options: s } = this,
      s = positioners[s.position].call(this, t, e);
    return !1 !== s && (i !== s.x || a !== s.y);
  }
}
var plugin_tooltip = {
    id: "tooltip",
    _element: Tooltip,
    positioners: positioners,
    afterInit(t, e, i) {
      i && (t.tooltip = new Tooltip({ chart: t, options: i }));
    },
    beforeUpdate(t, e, i) {
      t.tooltip && t.tooltip.initialize(i);
    },
    reset(t, e, i) {
      t.tooltip && t.tooltip.initialize(i);
    },
    afterDraw(t) {
      const e = t.tooltip;
      var i;
      e &&
        e._willRender() &&
        !(i = { tooltip: e }) !==
          t.notifyPlugins("beforeTooltipDraw", { ...i, cancelable: !0 }) &&
        (e.draw(t.ctx), t.notifyPlugins("afterTooltipDraw", i));
    },
    afterEvent(t, e) {
      var i;
      t.tooltip &&
        ((i = e.replay),
        t.tooltip.handleEvent(e.event, i, e.inChartArea) && (e.changed = !0));
    },
    defaults: {
      enabled: !0,
      external: null,
      position: "average",
      backgroundColor: "rgba(0,0,0,0.8)",
      titleColor: "#fff",
      titleFont: { weight: "bold" },
      titleSpacing: 2,
      titleMarginBottom: 6,
      titleAlign: "left",
      bodyColor: "#fff",
      bodySpacing: 2,
      bodyFont: {},
      bodyAlign: "left",
      footerColor: "#fff",
      footerSpacing: 2,
      footerMarginTop: 6,
      footerFont: { weight: "bold" },
      footerAlign: "left",
      padding: 6,
      caretPadding: 2,
      caretSize: 5,
      cornerRadius: 6,
      boxHeight: (t, e) => e.bodyFont.size,
      boxWidth: (t, e) => e.bodyFont.size,
      multiKeyBackground: "#fff",
      displayColors: !0,
      boxPadding: 0,
      borderColor: "rgba(0,0,0,0)",
      borderWidth: 0,
      animation: { duration: 400, easing: "easeOutQuart" },
      animations: {
        numbers: {
          type: "number",
          properties: ["x", "y", "width", "height", "caretX", "caretY"],
        },
        opacity: { easing: "linear", duration: 200 },
      },
      callbacks: defaultCallbacks,
    },
    defaultRoutes: { bodyFont: "font", footerFont: "font", titleFont: "font" },
    descriptors: {
      _scriptable: (t) =>
        "filter" !== t && "itemSort" !== t && "external" !== t,
      _indexable: !1,
      callbacks: { _scriptable: !1, _indexable: !1 },
      animation: { _fallback: !1 },
      animations: { _fallback: "animation" },
    },
    additionalOptionScopes: ["interaction"],
  },
  plugins = Object.freeze({
    __proto__: null,
    Colors: plugin_colors,
    Decimation: plugin_decimation,
    Filler: index,
    Legend: plugin_legend,
    SubTitle: plugin_subtitle,
    Title: plugin_title,
    Tooltip: plugin_tooltip,
  });
const addIfString = (t, e, i, a) => (
  "string" == typeof e
    ? ((i = t.push(e) - 1), a.unshift({ index: i, label: e }))
    : isNaN(e) && (i = null),
  i
);
function findOrAddLabel(t, e, i, a) {
  var s = t.indexOf(e);
  return -1 === s ? addIfString(t, e, i, a) : s !== t.lastIndexOf(e) ? i : s;
}
const validIndex = (t, e) =>
  null === t ? null : _limitValue(Math.round(t), 0, e);
function _getLabelForValue(t) {
  var e = this.getLabels();
  return 0 <= t && t < e.length ? e[t] : t;
}
class CategoryScale extends Scale {
  static id = "category";
  static defaults = { ticks: { callback: _getLabelForValue } };
  constructor(t) {
    super(t),
      (this._startValue = void 0),
      (this._valueRange = 0),
      (this._addedLabels = []);
  }
  init(t) {
    var e = this._addedLabels;
    if (e.length) {
      const s = this.getLabels();
      for (var { index: i, label: a } of e) s[i] === a && s.splice(i, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, e) {
    if (isNullOrUndef(t)) return null;
    var i = this.getLabels();
    return (
      (e =
        isFinite(e) && i[e] === t
          ? e
          : findOrAddLabel(i, t, valueOrDefault(e, t), this._addedLabels)),
      validIndex(e, i.length - 1)
    );
  }
  determineDataLimits() {
    var { minDefined: t, maxDefined: e } = this.getUserBounds();
    let { min: i, max: a } = this.getMinMax(!0);
    "ticks" === this.options.bounds &&
      (t || (i = 0), e || (a = this.getLabels().length - 1)),
      (this.min = i),
      (this.max = a);
  }
  buildTicks() {
    var e = this.min,
      i = this.max,
      t = this.options.offset;
    const a = [];
    let s = this.getLabels();
    (s = 0 === e && i === s.length - 1 ? s : s.slice(e, i + 1)),
      (this._valueRange = Math.max(s.length - (t ? 0 : 1), 1)),
      (this._startValue = this.min - (t ? 0.5 : 0));
    for (let t = e; t <= i; t++) a.push({ value: t });
    return a;
  }
  getLabelForValue(t) {
    return _getLabelForValue.call(this, t);
  }
  configure() {
    super.configure(),
      this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return null === (t = "number" != typeof t ? this.parse(t) : t)
      ? NaN
      : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getPixelForTick(t) {
    var e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getValueForPixel(t) {
    return Math.round(
      this._startValue + this.getDecimalForPixel(t) * this._valueRange
    );
  }
  getBasePixel() {
    return this.bottom;
  }
}
function generateTicks$1(t, e) {
  const i = [];
  var {
      bounds: a,
      step: s,
      min: n,
      max: r,
      precision: o,
      count: l,
      maxTicks: h,
      maxDigits: d,
      includeBounds: c,
    } = t,
    u = s || 1,
    g = h - 1,
    { min: e, max: p } = e,
    f = !isNullOrUndef(n),
    m = !isNullOrUndef(r),
    v = !isNullOrUndef(l),
    d = (p - e) / (d + 1);
  let x = niceNum((p - e) / g / u) * u,
    b,
    _,
    y,
    k;
  if (x < 1e-14 && !f && !m) return [{ value: e }, { value: p }];
  (k = Math.ceil(p / x) - Math.floor(e / x)) > g &&
    (x = niceNum((k * x) / g / u) * u),
    isNullOrUndef(o) || ((b = Math.pow(10, o)), (x = Math.ceil(x * b) / b)),
    (y =
      "ticks" === a
        ? ((_ = Math.floor(e / x) * x), Math.ceil(p / x) * x)
        : ((_ = e), p)),
    f && m && s && almostWhole((r - n) / s, x / 1e3)
      ? ((k = Math.round(Math.min((r - n) / x, h))),
        (x = (r - n) / k),
        (_ = n),
        (y = r))
      : v
      ? ((_ = f ? n : _), (y = m ? r : y), (k = l - 1), (x = (y - _) / k))
      : ((k = (y - _) / x),
        (k = almostEquals(k, Math.round(k), x / 1e3)
          ? Math.round(k)
          : Math.ceil(k)));
  g = Math.max(_decimalPlaces(x), _decimalPlaces(_));
  (b = Math.pow(10, isNullOrUndef(o) ? g : o)),
    (_ = Math.round(_ * b) / b),
    (y = Math.round(y * b) / b);
  let S = 0;
  for (
    f &&
    (c && _ !== n
      ? (i.push({ value: n }),
        _ < n && S++,
        almostEquals(
          Math.round((_ + S * x) * b) / b,
          n,
          relativeLabelSize(n, d, t)
        ) && S++)
      : _ < n && S++);
    S < k;
    ++S
  ) {
    var D = Math.round((_ + S * x) * b) / b;
    if (m && r < D) break;
    i.push({ value: D });
  }
  return (
    m && c && y !== r
      ? i.length &&
        almostEquals(i[i.length - 1].value, r, relativeLabelSize(r, d, t))
        ? (i[i.length - 1].value = r)
        : i.push({ value: r })
      : (m && y !== r) || i.push({ value: y }),
    i
  );
}
function relativeLabelSize(t, e, { horizontal: i, minRotation: a }) {
  (a = toRadians(a)), (i = (i ? Math.sin(a) : Math.cos(a)) || 0.001);
  return Math.min(e / i, 0.75 * e * ("" + t).length);
}
class LinearScaleBase extends Scale {
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._endValue = void 0),
      (this._valueRange = 0);
  }
  parse(t, e) {
    return isNullOrUndef(t) ||
      (("number" == typeof t || t instanceof Number) && !isFinite(+t))
      ? null
      : +t;
  }
  handleTickRangeOptions() {
    var t = this.options["beginAtZero"];
    const { minDefined: e, maxDefined: i } = this.getUserBounds();
    let { min: a, max: s } = this;
    var n,
      r,
      o = (t) => (a = e ? a : t),
      l = (t) => (s = i ? s : t);
    t &&
      ((r = sign(a)),
      (n = sign(s)),
      r < 0 && n < 0 ? l(0) : 0 < r && 0 < n && o(0)),
      a === s &&
        ((r = 0 === s ? 1 : Math.abs(0.05 * s)), l(s + r), t || o(a - r)),
      (this.min = a),
      (this.max = s);
  }
  getTickLimit() {
    let { maxTicksLimit: t, stepSize: e } = this.options.ticks,
      i;
    return (
      e
        ? 1e3 < (i = Math.ceil(this.max / e) - Math.floor(this.min / e) + 1) &&
          (console.warn(
            `scales.${this.id}.ticks.stepSize: ${e} would result generating up to ${i} ticks. Limiting to 1000.`
          ),
          (i = 1e3))
        : ((i = this.computeTickLimit()), (t = t || 11)),
      (i = t ? Math.min(t, i) : i)
    );
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    var t = this.options,
      e = t.ticks,
      i = this.getTickLimit();
    const a = generateTicks$1(
      {
        maxTicks: Math.max(2, i),
        bounds: t.bounds,
        min: t.min,
        max: t.max,
        precision: e.precision,
        step: e.stepSize,
        count: e.count,
        maxDigits: this._maxDigits(),
        horizontal: this.isHorizontal(),
        minRotation: e.minRotation || 0,
        includeBounds: !1 !== e.includeBounds,
      },
      this._range || this
    );
    return (
      "ticks" === t.bounds && _setMinAndMaxByKey(a, this, "value"),
      t.reverse
        ? (a.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      a
    );
  }
  configure() {
    var t = this.ticks;
    let e = this.min,
      i = this.max;
    super.configure(),
      this.options.offset &&
        t.length &&
        ((t = (i - e) / Math.max(t.length - 1, 1) / 2), (e -= t), (i += t)),
      (this._startValue = e),
      (this._endValue = i),
      (this._valueRange = i - e);
  }
  getLabelForValue(t) {
    return formatNumber(
      t,
      this.chart.options.locale,
      this.options.ticks.format
    );
  }
}
class LinearScale extends LinearScaleBase {
  static id = "linear";
  static defaults = { ticks: { callback: Ticks.formatters.numeric } };
  determineDataLimits() {
    var { min: t, max: e } = this.getMinMax(!0);
    (this.min = isNumberFinite(t) ? t : 0),
      (this.max = isNumberFinite(e) ? e : 1),
      this.handleTickRangeOptions();
  }
  computeTickLimit() {
    var t = this.isHorizontal(),
      e = t ? this.width : this.height,
      i = toRadians(this.options.ticks.minRotation),
      t = (t ? Math.sin(i) : Math.cos(i)) || 0.001,
      i = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, i.lineHeight / t));
  }
  getPixelForValue(t) {
    return null === t
      ? NaN
      : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
const log10Floor = (t) => Math.floor(log10(t)),
  changeExponent = (t, e) => Math.pow(10, log10Floor(t) + e);
function isMajor(t) {
  return 1 == t / Math.pow(10, log10Floor(t));
}
function steps(t, e, i) {
  (i = Math.pow(10, i)), (t = Math.floor(t / i));
  return Math.ceil(e / i) - t;
}
function startExp(t, e) {
  var i = e - t;
  let a = log10Floor(i);
  for (; 10 < steps(t, e, a); ) a++;
  for (; steps(t, e, a) < 10; ) a--;
  return Math.min(a, log10Floor(t));
}
function generateTicks(t, { min: e, max: i }) {
  e = finiteOrDefault(t.min, e);
  const a = [];
  var s = log10Floor(e);
  let n = startExp(e, i),
    r = n < 0 ? Math.pow(10, Math.abs(n)) : 1;
  var o = Math.pow(10, n),
    l = s > n ? Math.pow(10, s) : 0,
    s = Math.round((e - l) * r) / r,
    h = Math.floor((e - l) / o / 10) * o * 10;
  let d = Math.floor((s - h) / Math.pow(10, n)),
    c = finiteOrDefault(
      t.min,
      Math.round((l + h + d * Math.pow(10, n)) * r) / r
    );
  for (; c < i; )
    a.push({ value: c, major: isMajor(c), significand: d }),
      10 <= d ? (d = d < 15 ? 15 : 20) : d++,
      20 <= d && (n++, (d = 2), (r = 0 <= n ? 1 : r)),
      (c = Math.round((l + h + d * Math.pow(10, n)) * r) / r);
  e = finiteOrDefault(t.max, c);
  return a.push({ value: e, major: isMajor(e), significand: d }), a;
}
class LogarithmicScale extends Scale {
  static id = "logarithmic";
  static defaults = {
    ticks: { callback: Ticks.formatters.logarithmic, major: { enabled: !0 } },
  };
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._valueRange = 0);
  }
  parse(t, e) {
    t = LinearScaleBase.prototype.parse.apply(this, [t, e]);
    if (0 !== t) return isNumberFinite(t) && 0 < t ? t : null;
    this._zero = !0;
  }
  determineDataLimits() {
    var { min: t, max: e } = this.getMinMax(!0);
    (this.min = isNumberFinite(t) ? Math.max(0, t) : null),
      (this.max = isNumberFinite(e) ? Math.max(0, e) : null),
      this.options.beginAtZero && (this._zero = !0),
      this._zero &&
        this.min !== this._suggestedMin &&
        !isNumberFinite(this._userMin) &&
        (this.min =
          t === changeExponent(this.min, 0)
            ? changeExponent(this.min, -1)
            : changeExponent(this.min, 0)),
      this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined: e, maxDefined: i } = this.getUserBounds();
    let a = this.min,
      s = this.max;
    var t = (t) => (a = e ? a : t),
      n = (t) => (s = i ? s : t);
    a === s &&
      (a <= 0
        ? (t(1), n(10))
        : (t(changeExponent(a, -1)), n(changeExponent(s, 1)))),
      a <= 0 && t(changeExponent(s, -1)),
      s <= 0 && n(changeExponent(a, 1)),
      (this.min = a),
      (this.max = s);
  }
  buildTicks() {
    var t = this.options;
    const e = generateTicks({ min: this._userMin, max: this._userMax }, this);
    return (
      "ticks" === t.bounds && _setMinAndMaxByKey(e, this, "value"),
      t.reverse
        ? (e.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      e
    );
  }
  getLabelForValue(t) {
    return void 0 === t
      ? "0"
      : formatNumber(t, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    var t = this.min;
    super.configure(),
      (this._startValue = log10(t)),
      (this._valueRange = log10(this.max) - log10(t));
  }
  getPixelForValue(t) {
    return null === (t = void 0 !== t && 0 !== t ? t : this.min) || isNaN(t)
      ? NaN
      : this.getPixelForDecimal(
          t === this.min ? 0 : (log10(t) - this._startValue) / this._valueRange
        );
  }
  getValueForPixel(t) {
    t = this.getDecimalForPixel(t);
    return Math.pow(10, this._startValue + t * this._valueRange);
  }
}
function getTickBackdropHeight(t) {
  var e = t.ticks;
  return e.display && t.display
    ? ((t = toPadding(e.backdropPadding)),
      valueOrDefault(e.font && e.font.size, defaults.font.size) + t.height)
    : 0;
}
function measureLabelSize(t, e, i) {
  return (
    (i = isArray(i) ? i : [i]),
    { w: _longestText(t, e.string, i), h: i.length * e.lineHeight }
  );
}
function determineLimits(t, e, i, a, s) {
  return t === a || t === s
    ? { start: e - i / 2, end: e + i / 2 }
    : t < a || s < t
    ? { start: e - i, end: e }
    : { start: e, end: e + i };
}
function fitWithPointLabels(e) {
  var i = {
      l: e.left + e._padding.left,
      r: e.right - e._padding.right,
      t: e.top + e._padding.top,
      b: e.bottom - e._padding.bottom,
    },
    a = Object.assign({}, i);
  const s = [],
    n = [];
  var r = e._pointLabels.length;
  const o = e.options.pointLabels;
  var l = o.centerPointLabels ? PI / r : 0;
  for (let t = 0; t < r; t++) {
    var h = o.setContext(e.getPointLabelContext(t)),
      d = ((n[t] = h.padding), e.getPointPosition(t, e.drawingArea + n[t], l)),
      h = toFont(h.font),
      h = measureLabelSize(e.ctx, h, e._pointLabels[t]),
      c = ((s[t] = h), _normalizeAngle(e.getIndexAngle(t) + l)),
      u = Math.round(toDegrees(c));
    updateLimits(
      a,
      i,
      c,
      determineLimits(u, d.x, h.w, 0, 180),
      determineLimits(u, d.y, h.h, 90, 270)
    );
  }
  e.setCenterPoint(i.l - a.l, a.r - i.r, i.t - a.t, a.b - i.b),
    (e._pointLabelItems = buildPointLabelItems(e, s, n));
}
function updateLimits(t, e, i, a, s) {
  var n = Math.abs(Math.sin(i)),
    i = Math.abs(Math.cos(i));
  let r = 0,
    o = 0;
  a.start < e.l
    ? ((r = (e.l - a.start) / n), (t.l = Math.min(t.l, e.l - r)))
    : a.end > e.r && ((r = (a.end - e.r) / n), (t.r = Math.max(t.r, e.r + r))),
    s.start < e.t
      ? ((o = (e.t - s.start) / i), (t.t = Math.min(t.t, e.t - o)))
      : s.end > e.b &&
        ((o = (s.end - e.b) / i), (t.b = Math.max(t.b, e.b + o)));
}
function createPointLabelItem(t, e, i) {
  var a = t.drawingArea,
    { extra: i, additionalAngle: s, padding: n, size: r } = i,
    t = t.getPointPosition(e, a + i + n, s),
    e = Math.round(toDegrees(_normalizeAngle(t.angle + HALF_PI))),
    a = yForAngle(t.y, r.h, e),
    i = getTextAlignForAngle(e),
    n = leftForTextAlign(t.x, r.w, i);
  return {
    visible: !0,
    x: t.x,
    y: a,
    textAlign: i,
    left: n,
    top: a,
    right: n + r.w,
    bottom: a + r.h,
  };
}
function isNotOverlapped(t, e) {
  if (!e) return !0;
  var { left: t, top: i, right: a, bottom: s } = t;
  return !(
    _isPointInArea({ x: t, y: i }, e) ||
    _isPointInArea({ x: t, y: s }, e) ||
    _isPointInArea({ x: a, y: i }, e) ||
    _isPointInArea({ x: a, y: s }, e)
  );
}
function buildPointLabelItems(e, i, a) {
  const s = [];
  var n = e._pointLabels.length,
    t = e.options,
    { centerPointLabels: r, display: o } = t.pointLabels;
  const l = {
    extra: getTickBackdropHeight(t) / 2,
    additionalAngle: r ? PI / n : 0,
  };
  let h;
  for (let t = 0; t < n; t++) {
    (l.padding = a[t]), (l.size = i[t]);
    const d = createPointLabelItem(e, t, l);
    s.push(d),
      "auto" === o &&
        ((d.visible = isNotOverlapped(d, h)), d.visible && (h = d));
  }
  return s;
}
function getTextAlignForAngle(t) {
  return 0 === t || 180 === t ? "center" : t < 180 ? "left" : "right";
}
function leftForTextAlign(t, e, i) {
  return "right" === i ? (t -= e) : "center" === i && (t -= e / 2), t;
}
function yForAngle(t, e, i) {
  return (
    90 === i || 270 === i ? (t -= e / 2) : (270 < i || i < 90) && (t -= e), t
  );
}
function drawPointLabelBox(t, e, i) {
  var a,
    s,
    { left: i, top: n, right: r, bottom: o } = i,
    l = e["backdropColor"];
  isNullOrUndef(l) ||
    ((a = toTRBLCorners(e.borderRadius)),
    (e = toPadding(e.backdropPadding)),
    (t.fillStyle = l),
    (l = i - e.left),
    (s = n - e.top),
    (r = r - i + e.width),
    (i = o - n + e.height),
    Object.values(a).some((t) => 0 !== t)
      ? (t.beginPath(),
        addRoundedRectPath(t, { x: l, y: s, w: r, h: i, radius: a }),
        t.fill())
      : t.fillRect(l, s, r, i));
}
function drawPointLabels(e, i) {
  const {
    ctx: a,
    options: { pointLabels: s },
  } = e;
  for (let t = i - 1; 0 <= t; t--) {
    var n,
      r,
      o,
      l,
      h = e._pointLabelItems[t];
    h.visible &&
      (drawPointLabelBox(a, (n = s.setContext(e.getPointLabelContext(t))), h),
      (r = toFont(n.font)),
      ({ x: h, y: o, textAlign: l } = h),
      renderText(a, e._pointLabels[t], h, o + r.lineHeight / 2, r, {
        color: n.color,
        textAlign: l,
        textBaseline: "middle",
      }));
  }
}
function pathRadiusLine(e, i, t, a) {
  const s = e["ctx"];
  if (t) s.arc(e.xCenter, e.yCenter, i, 0, TAU);
  else {
    var n = e.getPointPosition(0, i);
    s.moveTo(n.x, n.y);
    for (let t = 1; t < a; t++)
      (n = e.getPointPosition(t, i)), s.lineTo(n.x, n.y);
  }
}
function drawRadiusLine(t, e, i, a, s) {
  const n = t.ctx;
  var r = e.circular,
    { color: e, lineWidth: o } = e;
  (!r && !a) ||
    !e ||
    !o ||
    i < 0 ||
    (n.save(),
    (n.strokeStyle = e),
    (n.lineWidth = o),
    n.setLineDash(s.dash),
    (n.lineDashOffset = s.dashOffset),
    n.beginPath(),
    pathRadiusLine(t, i, r, a),
    n.closePath(),
    n.stroke(),
    n.restore());
}
function createPointLabelContext(t, e, i) {
  return createContext(t, { label: i, index: e, type: "pointLabel" });
}
class RadialLinearScale extends LinearScaleBase {
  static id = "radialLinear";
  static defaults = {
    display: !0,
    animate: !0,
    position: "chartArea",
    angleLines: {
      display: !0,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0,
    },
    grid: { circular: !1 },
    startAngle: 0,
    ticks: { showLabelBackdrop: !0, callback: Ticks.formatters.numeric },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: !0,
      font: { size: 10 },
      callback(t) {
        return t;
      },
      padding: 5,
      centerPointLabels: !1,
    },
  };
  static defaultRoutes = {
    "angleLines.color": "borderColor",
    "pointLabels.color": "color",
    "ticks.color": "color",
  };
  static descriptors = { angleLines: { _fallback: "grid" } };
  constructor(t) {
    super(t),
      (this.xCenter = void 0),
      (this.yCenter = void 0),
      (this.drawingArea = void 0),
      (this._pointLabels = []),
      (this._pointLabelItems = []);
  }
  setDimensions() {
    var t = (this._padding = toPadding(
        getTickBackdropHeight(this.options) / 2
      )),
      e = (this.width = this.maxWidth - t.width),
      i = (this.height = this.maxHeight - t.height);
    (this.xCenter = Math.floor(this.left + e / 2 + t.left)),
      (this.yCenter = Math.floor(this.top + i / 2 + t.top)),
      (this.drawingArea = Math.floor(Math.min(e, i) / 2));
  }
  determineDataLimits() {
    var { min: t, max: e } = this.getMinMax(!1);
    (this.min = isNumberFinite(t) && !isNaN(t) ? t : 0),
      (this.max = isNumberFinite(e) && !isNaN(e) ? e : 0),
      this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }
  generateTickLabels(t) {
    LinearScaleBase.prototype.generateTickLabels.call(this, t),
      (this._pointLabels = this.getLabels()
        .map((t, e) => {
          t = callback(this.options.pointLabels.callback, [t, e], this);
          return t || 0 === t ? t : "";
        })
        .filter((t, e) => this.chart.getDataVisibility(e)));
  }
  fit() {
    var t = this.options;
    t.display && t.pointLabels.display
      ? fitWithPointLabels(this)
      : this.setCenterPoint(0, 0, 0, 0);
  }
  setCenterPoint(t, e, i, a) {
    (this.xCenter += Math.floor((t - e) / 2)),
      (this.yCenter += Math.floor((i - a) / 2)),
      (this.drawingArea -= Math.min(
        this.drawingArea / 2,
        Math.max(t, e, i, a)
      ));
  }
  getIndexAngle(t) {
    var e = TAU / (this._pointLabels.length || 1),
      i = this.options.startAngle || 0;
    return _normalizeAngle(t * e + toRadians(i));
  }
  getDistanceFromCenterForValue(t) {
    if (isNullOrUndef(t)) return NaN;
    var e = this.drawingArea / (this.max - this.min);
    return this.options.reverse ? (this.max - t) * e : (t - this.min) * e;
  }
  getValueForDistanceFromCenter(t) {
    if (isNullOrUndef(t)) return NaN;
    t /= this.drawingArea / (this.max - this.min);
    return this.options.reverse ? this.max - t : this.min + t;
  }
  getPointLabelContext(t) {
    var e = this._pointLabels || [];
    if (0 <= t && t < e.length)
      return (e = e[t]), createPointLabelContext(this.getContext(), t, e);
  }
  getPointPosition(t, e, i = 0) {
    t = this.getIndexAngle(t) - HALF_PI + i;
    return {
      x: Math.cos(t) * e + this.xCenter,
      y: Math.sin(t) * e + this.yCenter,
      angle: t,
    };
  }
  getPointPositionForValue(t, e) {
    return this.getPointPosition(t, this.getDistanceFromCenterForValue(e));
  }
  getBasePosition(t) {
    return this.getPointPositionForValue(t || 0, this.getBaseValue());
  }
  getPointLabelPosition(t) {
    var { left: t, top: e, right: i, bottom: a } = this._pointLabelItems[t];
    return { left: t, top: e, right: i, bottom: a };
  }
  drawBackground() {
    var {
      backgroundColor: t,
      grid: { circular: e },
    } = this.options;
    if (t) {
      const i = this.ctx;
      i.save(),
        i.beginPath(),
        pathRadiusLine(
          this,
          this.getDistanceFromCenterForValue(this._endValue),
          e,
          this._pointLabels.length
        ),
        i.closePath(),
        (i.fillStyle = t),
        i.fill(),
        i.restore();
    }
  }
  drawGrid() {
    const t = this.ctx;
    var e = this.options;
    const { angleLines: i, grid: a, border: s } = e,
      n = this._pointLabels.length;
    let r, o, l;
    if (
      (e.pointLabels.display && drawPointLabels(this, n),
      a.display &&
        this.ticks.forEach((t, e) => {
          0 !== e &&
            ((o = this.getDistanceFromCenterForValue(t.value)),
            (t = this.getContext(e)),
            (e = a.setContext(t)),
            (t = s.setContext(t)),
            drawRadiusLine(this, e, o, n, t));
        }),
      i.display)
    ) {
      for (t.save(), r = n - 1; 0 <= r; r--) {
        var h = i.setContext(this.getPointLabelContext(r)),
          { color: d, lineWidth: c } = h;
        c &&
          d &&
          ((t.lineWidth = c),
          (t.strokeStyle = d),
          t.setLineDash(h.borderDash),
          (t.lineDashOffset = h.borderDashOffset),
          (o = this.getDistanceFromCenterForValue(
            e.ticks.reverse ? this.min : this.max
          )),
          (l = this.getPointPosition(r, o)),
          t.beginPath(),
          t.moveTo(this.xCenter, this.yCenter),
          t.lineTo(l.x, l.y),
          t.stroke());
      }
      t.restore();
    }
  }
  drawBorder() {}
  drawLabels() {
    const r = this.ctx,
      o = this.options,
      l = o.ticks;
    if (l.display) {
      var t = this.getIndexAngle(0);
      let s, n;
      r.save(),
        r.translate(this.xCenter, this.yCenter),
        r.rotate(t),
        (r.textAlign = "center"),
        (r.textBaseline = "middle"),
        this.ticks.forEach((t, e) => {
          var i, a;
          (0 === e && !o.reverse) ||
            ((i = l.setContext(this.getContext(e))),
            (a = toFont(i.font)),
            (s = this.getDistanceFromCenterForValue(this.ticks[e].value)),
            i.showLabelBackdrop &&
              ((r.font = a.string),
              (n = r.measureText(t.label).width),
              (r.fillStyle = i.backdropColor),
              (e = toPadding(i.backdropPadding)),
              r.fillRect(
                -n / 2 - e.left,
                -s - a.size / 2 - e.top,
                n + e.width,
                a.size + e.height
              )),
            renderText(r, t.label, 0, -s, a, { color: i.color }));
        }),
        r.restore();
    }
  }
  drawTitle() {}
}
const INTERVALS = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
  UNITS = Object.keys(INTERVALS);
function sorter(t, e) {
  return t - e;
}
function parse(t, e) {
  if (isNullOrUndef(e)) return null;
  const i = t._adapter,
    { parser: a, round: s, isoWeekday: n } = t._parseOpts;
  let r = e;
  return (
    "function" == typeof a && (r = a(r)),
    null ===
    (r = isNumberFinite(r)
      ? r
      : "string" == typeof a
      ? i.parse(r, a)
      : i.parse(r))
      ? null
      : +(r = s
          ? "week" !== s || (!isNumber(n) && !0 !== n)
            ? i.startOf(r, s)
            : i.startOf(r, "isoWeek", n)
          : r)
  );
}
function determineUnitForAutoTicks(e, i, a, s) {
  var n = UNITS.length;
  for (let t = UNITS.indexOf(e); t < n - 1; ++t) {
    var r = INTERVALS[UNITS[t]],
      o = r.steps || Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((a - i) / (o * r.size)) <= s) return UNITS[t];
  }
  return UNITS[n - 1];
}
function determineUnitForFormatting(e, i, a, s, n) {
  for (let t = UNITS.length - 1; t >= UNITS.indexOf(a); t--) {
    var r = UNITS[t];
    if (INTERVALS[r].common && e._adapter.diff(n, s, r) >= i - 1) return r;
  }
  return UNITS[a ? UNITS.indexOf(a) : 0];
}
function determineMajorUnit(i) {
  for (let t = UNITS.indexOf(i) + 1, e = UNITS.length; t < e; ++t)
    if (INTERVALS[UNITS[t]].common) return UNITS[t];
}
function addTick(t, e, i) {
  var a, s;
  i
    ? i.length &&
      (({ lo: a, hi: s } = _lookup(i, e)), (t[i[a] >= e ? i[a] : i[s]] = !0))
    : (t[e] = !0);
}
function setMajorTicks(t, e, i, a) {
  const s = t._adapter;
  var t = +s.startOf(e[0].value, a),
    n = e[e.length - 1].value;
  let r, o;
  for (r = t; r <= n; r = +s.add(r, 1, a)) 0 <= (o = i[r]) && (e[o].major = !0);
  return e;
}
function ticksFromTimestamps(t, e, i) {
  const a = [],
    s = {};
  var n = e.length;
  let r, o;
  for (r = 0; r < n; ++r)
    (o = e[r]), (s[o] = r), a.push({ value: o, major: !1 });
  return 0 !== n && i ? setMajorTicks(t, a, s, i) : a;
}
class TimeScale extends Scale {
  static id = "time";
  static defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: !1,
      unit: !1,
      round: !1,
      isoWeekday: !1,
      minUnit: "millisecond",
      displayFormats: {},
    },
    ticks: { source: "auto", callback: !1, major: { enabled: !1 } },
  };
  constructor(t) {
    super(t),
      (this._cache = { data: [], labels: [], all: [] }),
      (this._unit = "day"),
      (this._majorUnit = void 0),
      (this._offsets = {}),
      (this._normalized = !1),
      (this._parseOpts = void 0);
  }
  init(t, e = {}) {
    var i = t.time || (t.time = {});
    const a = (this._adapter = new adapters._date(t.adapters.date));
    a.init(e),
      mergeIf(i.displayFormats, a.formats()),
      (this._parseOpts = {
        parser: i.parser,
        round: i.round,
        isoWeekday: i.isoWeekday,
      }),
      super.init(t),
      (this._normalized = e.normalized);
  }
  parse(t, e) {
    return void 0 === t ? null : parse(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] });
  }
  determineDataLimits() {
    var t = this.options;
    const e = this._adapter;
    var i = t.time.unit || "day";
    let { min: a, max: s, minDefined: n, maxDefined: r } = this.getUserBounds();
    function o(t) {
      n || isNaN(t.min) || (a = Math.min(a, t.min)),
        r || isNaN(t.max) || (s = Math.max(s, t.max));
    }
    (n && r) ||
      (o(this._getLabelBounds()),
      ("ticks" === t.bounds && "labels" === t.ticks.source) ||
        o(this.getMinMax(!1))),
      (a = isNumberFinite(a) && !isNaN(a) ? a : +e.startOf(Date.now(), i)),
      (s = isNumberFinite(s) && !isNaN(s) ? s : +e.endOf(Date.now(), i) + 1),
      (this.min = Math.min(a, s - 1)),
      (this.max = Math.max(a + 1, s));
  }
  _getLabelBounds() {
    var t = this.getLabelTimestamps();
    let e = Number.POSITIVE_INFINITY,
      i = Number.NEGATIVE_INFINITY;
    return t.length && ((e = t[0]), (i = t[t.length - 1])), { min: e, max: i };
  }
  buildTicks() {
    var t = this.options,
      e = t.time,
      i = t.ticks,
      a = "labels" === i.source ? this.getLabelTimestamps() : this._generate(),
      s =
        ("ticks" === t.bounds &&
          a.length &&
          ((this.min = this._userMin || a[0]),
          (this.max = this._userMax || a[a.length - 1])),
        this.min),
      n = this.max;
    const r = _filterBetween(a, s, n);
    return (
      (this._unit =
        e.unit ||
        (i.autoSkip
          ? determineUnitForAutoTicks(
              e.minUnit,
              this.min,
              this.max,
              this._getLabelCapacity(s)
            )
          : determineUnitForFormatting(
              this,
              r.length,
              e.minUnit,
              this.min,
              this.max
            ))),
      (this._majorUnit =
        i.major.enabled && "year" !== this._unit
          ? determineMajorUnit(this._unit)
          : void 0),
      this.initOffsets(a),
      t.reverse && r.reverse(),
      ticksFromTimestamps(this, r, this._majorUnit)
    );
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip &&
      this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0,
      i = 0;
    this.options.offset &&
      t.length &&
      ((a = this.getDecimalForValue(t[0])),
      (e = 1 === t.length ? 1 - a : (this.getDecimalForValue(t[1]) - a) / 2),
      (a = this.getDecimalForValue(t[t.length - 1])),
      (i =
        1 === t.length
          ? a
          : (a - this.getDecimalForValue(t[t.length - 2])) / 2));
    var a = t.length < 3 ? 0.5 : 0.25;
    (e = _limitValue(e, 0, a)),
      (i = _limitValue(i, 0, a)),
      (this._offsets = { start: e, end: i, factor: 1 / (e + 1 + i) });
  }
  _generate() {
    const t = this._adapter;
    var e = this.min,
      i = this.max,
      a = this.options,
      s = a.time,
      n =
        s.unit ||
        determineUnitForAutoTicks(s.minUnit, e, i, this._getLabelCapacity(e)),
      r = valueOrDefault(a.ticks.stepSize, 1),
      s = "week" === n && s.isoWeekday,
      o = isNumber(s) || !0 === s,
      l = {};
    let h = e,
      d,
      c;
    if (
      (o && (h = +t.startOf(h, "isoWeek", s)),
      (h = +t.startOf(h, o ? "day" : n)),
      t.diff(i, e, n) > 1e5 * r)
    )
      throw new Error(
        e + " and " + i + " are too far apart with stepSize of " + r + " " + n
      );
    var u = "data" === a.ticks.source && this.getDataTimestamps();
    for (d = h, c = 0; d < i; d = +t.add(d, r, n), c++) addTick(l, d, u);
    return (
      (d !== i && "ticks" !== a.bounds && 1 !== c) || addTick(l, d, u),
      Object.keys(l)
        .sort((t, e) => t - e)
        .map((t) => +t)
    );
  }
  getLabelForValue(t) {
    const e = this._adapter;
    var i = this.options.time;
    return i.tooltipFormat
      ? e.format(t, i.tooltipFormat)
      : e.format(t, i.displayFormats.datetime);
  }
  format(t, e) {
    var i = this.options.time.displayFormats,
      a = this._unit,
      e = e || i[a];
    return this._adapter.format(t, e);
  }
  _tickFormatFunction(t, e, i, a) {
    var s = this.options,
      n = s.ticks.callback;
    if (n) return callback(n, [t, e, i], this);
    var n = s.time.displayFormats,
      s = this._unit,
      r = this._majorUnit,
      s = s && n[s],
      n = r && n[r],
      i = i[e],
      e = r && n && i && i.major;
    return this._adapter.format(t, a || (e ? n : s));
  }
  generateTickLabels(t) {
    let e, i, a;
    for (e = 0, i = t.length; e < i; ++e)
      (a = t[e]).label = this._tickFormatFunction(a.value, e, t);
  }
  getDecimalForValue(t) {
    return null === t ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    var e = this._offsets,
      t = this.getDecimalForValue(t);
    return this.getPixelForDecimal((e.start + t) * e.factor);
  }
  getValueForPixel(t) {
    var e = this._offsets,
      t = this.getDecimalForPixel(t) / e.factor - e.end;
    return this.min + t * (this.max - this.min);
  }
  _getLabelSize(t) {
    var e = this.options.ticks,
      t = this.ctx.measureText(t).width,
      e = toRadians(this.isHorizontal() ? e.maxRotation : e.minRotation),
      i = Math.cos(e),
      e = Math.sin(e),
      a = this._resolveTickFontOptions(0).size;
    return { w: t * i + a * e, h: t * e + a * i };
  }
  _getLabelCapacity(t) {
    var e = this.options.time,
      i = e.displayFormats,
      e = i[e.unit] || i.millisecond,
      i = this._tickFormatFunction(
        t,
        0,
        ticksFromTimestamps(this, [t], this._majorUnit),
        e
      ),
      t = this._getLabelSize(i),
      e =
        Math.floor(this.isHorizontal() ? this.width / t.w : this.height / t.h) -
        1;
    return 0 < e ? e : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [],
      e,
      i;
    if (t.length) return t;
    const a = this.getMatchingVisibleMetas();
    if (this._normalized && a.length)
      return (this._cache.data = a[0].controller.getAllParsedValues(this));
    for (e = 0, i = a.length; e < i; ++e)
      t = t.concat(a[e].controller.getAllParsedValues(this));
    return (this._cache.data = this.normalize(t));
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let e, i;
    if (t.length) return t;
    var a = this.getLabels();
    for (e = 0, i = a.length; e < i; ++e) t.push(parse(this, a[e]));
    return (this._cache.labels = this._normalized ? t : this.normalize(t));
  }
  normalize(t) {
    return _arrayUnique(t.sort(sorter));
  }
}
function interpolate(t, e, i) {
  let a = 0,
    s = t.length - 1,
    n,
    r,
    o,
    l;
  i
    ? (e >= t[a].pos &&
        e <= t[s].pos &&
        ({ lo: a, hi: s } = _lookupByKey(t, "pos", e)),
      ({ pos: n, time: o } = t[a]),
      ({ pos: r, time: l } = t[s]))
    : (e >= t[a].time &&
        e <= t[s].time &&
        ({ lo: a, hi: s } = _lookupByKey(t, "time", e)),
      ({ time: n, pos: o } = t[a]),
      ({ time: r, pos: l } = t[s]));
  i = r - n;
  return i ? o + ((l - o) * (e - n)) / i : o;
}
class TimeSeriesScale extends TimeScale {
  static id = "timeseries";
  static defaults = TimeScale.defaults;
  constructor(t) {
    super(t),
      (this._table = []),
      (this._minPos = void 0),
      (this._tableRange = void 0);
  }
  initOffsets() {
    var t = this._getTimestampsForTable(),
      e = (this._table = this.buildLookupTable(t));
    (this._minPos = interpolate(e, this.min)),
      (this._tableRange = interpolate(e, this.max) - this._minPos),
      super.initOffsets(t);
  }
  buildLookupTable(t) {
    var { min: e, max: i } = this;
    const a = [],
      s = [];
    let n, r, o, l, h;
    for (n = 0, r = t.length; n < r; ++n)
      (l = t[n]) >= e && l <= i && a.push(l);
    if (a.length < 2)
      return [
        { time: e, pos: 0 },
        { time: i, pos: 1 },
      ];
    for (n = 0, r = a.length; n < r; ++n)
      (h = a[n + 1]),
        (o = a[n - 1]),
        (l = a[n]),
        Math.round((h + o) / 2) !== l && s.push({ time: l, pos: n / (r - 1) });
    return s;
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length) return t;
    const e = this.getDataTimestamps();
    var i = this.getLabelTimestamps();
    return (
      (t =
        e.length && i.length ? this.normalize(e.concat(i)) : e.length ? e : i),
      (t = this._cache.all = t)
    );
  }
  getDecimalForValue(t) {
    return (interpolate(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    var e = this._offsets,
      t = this.getDecimalForPixel(t) / e.factor - e.end;
    return interpolate(this._table, t * this._tableRange + this._minPos, !0);
  }
}
var scales = Object.freeze({
  __proto__: null,
  CategoryScale: CategoryScale,
  LinearScale: LinearScale,
  LogarithmicScale: LogarithmicScale,
  RadialLinearScale: RadialLinearScale,
  TimeScale: TimeScale,
  TimeSeriesScale: TimeSeriesScale,
});
const registerables = [controllers, elements, plugins, scales];
export {
  Animation,
  Animations,
  ArcElement,
  BarController,
  BarElement,
  BasePlatform,
  BasicPlatform,
  BubbleController,
  CategoryScale,
  Chart,
  plugin_colors as Colors,
  DatasetController,
  plugin_decimation as Decimation,
  DomPlatform,
  DoughnutController,
  Element,
  index as Filler,
  Interaction,
  plugin_legend as Legend,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  Scale,
  ScatterController,
  plugin_subtitle as SubTitle,
  Ticks,
  TimeScale,
  TimeSeriesScale,
  plugin_title as Title,
  plugin_tooltip as Tooltip,
  adapters as _adapters,
  _detectPlatform,
  animator,
  controllers,
  defaults,
  elements,
  layouts,
  plugins,
  registerables,
  registry,
  scales,
};
