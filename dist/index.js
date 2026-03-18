const N = (a) => {
  var g, h;
  const c = (g = a.tagName) == null ? void 0 : g.toUpperCase();
  return c === "INPUT" || c === "TEXTAREA" || a.isContentEditable ? a : a.querySelector("input, textarea, [contenteditable]") || ((h = a.parentElement) == null ? void 0 : h.querySelector("input, textarea, [contenteditable]")) || a;
}, O = (a) => a.split(",").map((c) => c.trim()).filter(Boolean);
function W(a) {
  a.directive("placeholders", (c, { expression: g }, { effect: h }) => {
    const x = O(g);
    let l = null, f = !1, e = "";
    const t = () => N(c), b = (s) => {
      var m;
      const v = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      );
      return ((m = v == null ? void 0 : v.get) == null ? void 0 : m.call(s)) ?? "";
    }, E = (s, v) => {
      var y;
      const m = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      );
      (y = m == null ? void 0 : m.set) == null || y.call(s, v);
    }, L = () => {
      var m;
      const s = t();
      return ((m = s.tagName) == null ? void 0 : m.toUpperCase()) === "TEXTAREA" ? b(s) : s.isContentEditable ? s.innerText : s.value;
    }, S = (s) => {
      var y;
      const v = t();
      ((y = v.tagName) == null ? void 0 : y.toUpperCase()) === "TEXTAREA" ? E(v, s) : v.isContentEditable ? v.innerText = s : v.value = s;
    }, u = () => t().selectionStart ?? 0, o = (s) => {
      var m;
      const v = t();
      (m = v.setSelectionRange) == null || m.call(v, s, s);
    }, w = () => e ? x.filter((s) => s.toLowerCase().includes(e.toLowerCase())) : x, p = () => {
      l && (l.style.display = "block");
    }, C = () => {
      l && (l.style.display = "none");
    }, r = () => {
      if (!l) return;
      l.innerHTML = "";
      const s = w();
      if (!s.length) {
        C();
        return;
      }
      s.forEach((v) => {
        const m = document.createElement("div");
        m.textContent = `{${v}}`, m.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", m.addEventListener("mousedown", (y) => {
          y.preventDefault(), $(v);
        }), l.appendChild(m);
      }), p();
    }, i = () => {
      f = !1, e = "", C();
    }, n = () => {
      f = !0, r();
    }, d = () => {
      const s = L(), v = u(), m = s.slice(0, v), y = m.lastIndexOf("{"), j = m.lastIndexOf("}");
      if (y === -1 || j > y) {
        i();
        return;
      }
      e = m.slice(y + 1), n();
    }, $ = (s) => {
      const v = t(), m = v.selectionStart ?? 0, y = L(), A = y.slice(0, m).lastIndexOf("{");
      if (A === -1) return;
      const k = y.slice(0, A), I = y.slice(m), z = `${k}{${s}}${I}`;
      S(z), o(k.length + s.length + 2), v.dispatchEvent(new Event("input", { bubbles: !0 })), i();
    }, P = (s) => {
      f && s.key === "Escape" && (s.preventDefault(), i());
    }, T = () => d(), U = () => d(), V = () => i(), R = () => {
      l = document.createElement("div"), l.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", l.style.display = "none";
      const s = t();
      s.parentElement.style.position = "relative", s.parentElement.appendChild(l);
    }, B = () => {
      const s = t();
      s.removeEventListener("input", T), s.removeEventListener("click", U), s.removeEventListener("keydown", P), s.removeEventListener("blur", V), l == null || l.remove();
    };
    R();
    const M = t();
    M.addEventListener("input", T), M.addEventListener("click", U), M.addEventListener("keydown", P), M.addEventListener("blur", V), h(() => B);
  });
}
const _ = (a) => {
  var g, h;
  const c = (g = a.tagName) == null ? void 0 : g.toUpperCase();
  return c === "INPUT" || c === "TEXTAREA" || a.isContentEditable ? a : a.querySelector("input, textarea, [contenteditable]") || ((h = a.parentElement) == null ? void 0 : h.querySelector("input, textarea, [contenteditable]")) || a;
}, F = (a) => a.split(",").map((c) => c.trim()).filter(Boolean);
function Z(a) {
  a.directive("email-mask", (c, { expression: g }, { effect: h }) => {
    const x = new Set(F(g)), l = /^\s*\{([\w]+)\}\s*$/, f = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, e = _(c), t = (u) => x.has(u), b = (u) => {
      const o = u.match(l);
      if (o) {
        const r = o[1];
        return t(r) ? `{${r}}` : null;
      }
      const w = u.match(f);
      if (!w) return null;
      const p = w[1], C = w[2];
      return !t(p) || !t(C) ? null : `{${p}}<{${C}}>`;
    }, E = () => {
      const u = e.value.trim();
      if (u === "") {
        e.setCustomValidity("");
        return;
      }
      if (b(u) !== null) {
        e.setCustomValidity("");
        return;
      }
      e.setCustomValidity("Use {field} or {name}<{email}> format.");
    }, L = () => {
      const u = e.value.trim();
      if (u === "") {
        e.setCustomValidity("");
        return;
      }
      const o = b(u);
      if (o === null) {
        E();
        return;
      }
      o !== e.value && (e.value = o, e.dispatchEvent(new Event("input", { bubbles: !0 }))), e.setCustomValidity("");
    }, S = () => E();
    e.addEventListener("input", S), e.addEventListener("blur", L), h(() => () => {
      e.removeEventListener("input", S), e.removeEventListener("blur", L);
    });
  });
}
function D(a) {
  a.directive("slug", (c, { expression: g, modifiers: h }, { evaluate: x, cleanup: l }) => {
    const f = h[0] ?? "-", e = c, t = (p) => p.toString().toLowerCase().trim().replace(/[\s\W-]+/g, f).replace(new RegExp(`^${f}+|${f}+$`, "g"), "").replace(new RegExp(`${f}{2,}`, "g"), f), b = g.trim().split(",").map((p) => p.trim());
    let E = "";
    const L = () => t(b.map((p) => x(p)).filter(Boolean).join(" ")), S = L();
    !e.value && S && (E = S, e.value = E, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    const u = x("$watch"), o = b.map(
      (p) => u(p, () => {
        (!e.value || e.value === E) && (E = L(), e.value = E, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), w = () => {
      const p = e.selectionStart ?? 0, C = e.value, r = t(C);
      if (C !== r) {
        e.value = r;
        const i = Math.min(p, r.length);
        e.setSelectionRange(i, i);
      }
    };
    e.addEventListener("blur", w), l(() => {
      o.forEach((p) => p()), e.removeEventListener("blur", w);
    });
  });
}
function q(a) {
  a.directive("slug", ({ el: c, directive: g, component: h, cleanup: x }) => {
    const l = g.modifiers.length > 0 ? g.modifiers[0] : "-", f = g.expression.trim().split(",").map((o) => o.trim()), e = c, t = (o) => o.toString().toLowerCase().trim().replace(/[\s\W-]+/g, l).replace(new RegExp(`^${l}+|${l}+$`, "g"), "").replace(new RegExp(`${l}{2,}`, "g"), l);
    let b = "";
    const E = () => t(f.map((o) => h.$wire[o]).filter(Boolean).join(" ")), L = E();
    !e.value && L && (b = L, e.value = b, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    const S = f.map(
      (o) => h.$wire.$watch(o, () => {
        (!e.value || e.value === b) && (b = E(), e.value = b, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), u = () => {
      const o = e.selectionStart ?? 0, w = e.value, p = t(w);
      if (w !== p) {
        e.value = p;
        const C = Math.min(o, p.length);
        e.setSelectionRange(C, C);
      }
    };
    e.addEventListener("blur", u), x(() => {
      S.forEach((o) => o()), e.removeEventListener("blur", u);
    });
  });
}
function X(a) {
  a.directive("case", (c, { expression: g, modifiers: h }, { evaluate: x, cleanup: l }) => {
    const f = h[0] ?? "camel", e = h[1] === "underscore" ? "_" : "-", t = c, b = (n) => n.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), E = (n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(), L = (n) => {
      const d = e;
      return n.toString().toLowerCase().trim().replace(/[\s\W-]+/g, d).replace(new RegExp(`^${d}+|${d}+$`, "g"), "").replace(new RegExp(`${d}{2,}`, "g"), d);
    }, S = (n) => {
      const d = b(n.toString().trim());
      switch (f) {
        case "slug":
          return L(n);
        case "camel":
          return d.map(($, P) => P === 0 ? $.toLowerCase() : E($)).join("");
        case "pascal":
          return d.map(E).join("");
        case "snake":
          return d.map(($) => $.toLowerCase()).join("_");
        case "constant":
          return d.map(($) => $.toUpperCase()).join("_");
        case "title":
          return d.map(E).join(" ");
        case "dot":
          return d.map(($) => $.toLowerCase()).join(".");
        case "kebab":
          return d.map(($) => $.toLowerCase()).join("-");
        case "lower":
          return n.toLowerCase().trim();
        case "upper":
          return n.toUpperCase().trim();
        default:
          return n;
      }
    }, u = g.trim().split(",").map((n) => n.trim());
    let o = "";
    const w = () => S(u.map((n) => x(n)).filter(Boolean).join(" ")), p = w();
    !t.value && p && (o = p, t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const C = x("$watch"), r = u.map(
      (n) => C(n, () => {
        (!t.value || t.value === o) && (o = w(), t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), i = () => {
      const n = t.selectionStart ?? 0, d = t.value, $ = S(d);
      if (d !== $) {
        t.value = $;
        const P = Math.min(n, $.length);
        t.setSelectionRange(P, P);
      }
    };
    t.addEventListener("blur", i), l(() => {
      r.forEach((n) => n()), t.removeEventListener("blur", i);
    });
  });
}
function H(a) {
  a.directive("case", ({ el: c, directive: g, component: h, cleanup: x }) => {
    const l = g.modifiers[0] ?? "camel", f = g.modifiers[1] === "underscore" ? "_" : "-", e = g.expression.trim().split(",").map((r) => r.trim()), t = c, b = (r) => r.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), E = (r) => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase(), L = (r) => {
      const i = f;
      return r.toString().toLowerCase().trim().replace(/[\s\W-]+/g, i).replace(new RegExp(`^${i}+|${i}+$`, "g"), "").replace(new RegExp(`${i}{2,}`, "g"), i);
    }, S = (r) => {
      const i = b(r.toString().trim());
      switch (l) {
        case "slug":
          return L(r);
        case "camel":
          return i.map((n, d) => d === 0 ? n.toLowerCase() : E(n)).join("");
        case "pascal":
          return i.map(E).join("");
        case "snake":
          return i.map((n) => n.toLowerCase()).join("_");
        case "constant":
          return i.map((n) => n.toUpperCase()).join("_");
        case "title":
          return i.map(E).join(" ");
        case "dot":
          return i.map((n) => n.toLowerCase()).join(".");
        case "kebab":
          return i.map((n) => n.toLowerCase()).join("-");
        case "lower":
          return r.toLowerCase().trim();
        case "upper":
          return r.toUpperCase().trim();
        default:
          return r;
      }
    };
    let u = "";
    const o = () => S(e.map((r) => h.$wire[r]).filter(Boolean).join(" ")), w = o();
    !t.value && w && (u = w, t.value = u, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const p = e.map(
      (r) => h.$wire.$watch(r, () => {
        (!t.value || t.value === u) && (u = o(), t.value = u, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), C = () => {
      const r = t.selectionStart ?? 0, i = t.value, n = S(i);
      if (i !== n) {
        t.value = n;
        const d = Math.min(r, n.length);
        t.setSelectionRange(d, d);
      }
    };
    t.addEventListener("blur", C), x(() => {
      p.forEach((r) => r()), t.removeEventListener("blur", C);
    });
  });
}
function K(a, c) {
  W(c), Z(c), D(c), X(c), q(a), H(a);
}
export {
  X as registerCaseAlpine,
  H as registerCaseLivewire,
  K as registerDirectives,
  Z as registerEmailMask,
  W as registerPlaceholders,
  D as registerSlugAlpine,
  q as registerSlugLivewire
};
//# sourceMappingURL=index.js.map
