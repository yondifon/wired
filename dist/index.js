var z = Object.defineProperty;
var O = (e, n, r) => n in e ? z(e, n, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[n] = r;
var j = (e, n, r) => O(e, typeof n != "symbol" ? n + "" : n, r);
const M = {
  default: { trigger: "{", close: "}", display: (e) => `{${e}}`, insert: (e) => `{${e}}` },
  double: { trigger: "{{", close: "}}", display: (e) => `{{${e}}}`, insert: (e) => `{{${e}}}` },
  hash: { trigger: "#", close: null, display: (e) => `#${e}`, insert: (e) => `#${e}` },
  at: { trigger: "@", close: null, display: (e) => `@${e}`, insert: (e) => `@${e}` },
  dollar: { trigger: "${", close: "}", display: (e) => `\${${e}}`, insert: (e) => `\${${e}}` },
  percent: { trigger: "%", close: "%", display: (e) => `%${e}%`, insert: (e) => `%${e}%` }
}, I = (e) => {
  for (const n of Object.keys(M))
    if (e.includes(n)) return M[n];
  return M.default;
}, _ = (e) => {
  var r, s;
  const n = (r = e.tagName) == null ? void 0 : r.toUpperCase();
  return n === "INPUT" || n === "TEXTAREA" || e.isContentEditable ? e : e.querySelector("input, textarea, [contenteditable]") || ((s = e.parentElement) == null ? void 0 : s.querySelector("input, textarea, [contenteditable]")) || e;
};
function R(e, n, r) {
  let s = null, u = !1, g = "";
  const l = () => _(e), t = (d) => {
    var b;
    const f = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
    return ((b = f == null ? void 0 : f.get) == null ? void 0 : b.call(d)) ?? "";
  }, o = (d, f) => {
    var P;
    const b = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
    (P = b == null ? void 0 : b.set) == null || P.call(d, f);
  }, p = () => {
    var b;
    const d = l();
    return ((b = d.tagName) == null ? void 0 : b.toUpperCase()) === "TEXTAREA" ? t(d) : d.isContentEditable ? d.innerText : d.value;
  }, w = (d) => {
    var P;
    const f = l();
    ((P = f.tagName) == null ? void 0 : P.toUpperCase()) === "TEXTAREA" ? o(f, d) : f.isContentEditable ? f.innerText = d : f.value = d;
  }, L = () => l().selectionStart ?? 0, y = (d) => {
    var b;
    const f = l();
    (b = f.setSelectionRange) == null || b.call(f, d, d);
  }, m = () => {
    const d = n();
    return g ? d.filter((f) => f.toLowerCase().includes(g.toLowerCase())) : d;
  }, i = () => {
    s && (s.style.display = "block");
  }, C = () => {
    s && (s.style.display = "none");
  }, h = () => {
    if (!s) return;
    s.innerHTML = "";
    const d = m();
    if (!d.length) {
      C();
      return;
    }
    d.forEach((f) => {
      const b = document.createElement("div");
      b.textContent = r.display(f), b.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", b.addEventListener("mousedown", (P) => {
        P.preventDefault(), a(f);
      }), s.appendChild(b);
    }), i();
  }, $ = () => {
    u = !1, g = "", C();
  }, c = () => {
    u = !0, h();
  }, v = () => {
    const d = p(), f = L(), b = d.slice(0, f), P = b.lastIndexOf(r.trigger);
    if (P === -1) {
      $();
      return;
    }
    const T = b.slice(P + r.trigger.length);
    if (r.close) {
      if (T.includes(r.close[0])) {
        $();
        return;
      }
    } else if (/\s/.test(T)) {
      $();
      return;
    }
    g = T, c();
  }, a = (d) => {
    const f = l(), b = f.selectionStart ?? 0, P = p(), U = P.slice(0, b).lastIndexOf(r.trigger);
    if (U === -1) return;
    const V = P.slice(0, U), B = P.slice(b), A = r.insert(d);
    w(`${V}${A}${B}`), y(V.length + A.length), f.dispatchEvent(new Event("input", { bubbles: !0 })), $();
  }, E = (d) => {
    u && d.key === "Escape" && (d.preventDefault(), $());
  }, S = () => v(), k = () => v(), N = () => $();
  s = document.createElement("div"), s.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", s.style.display = "none";
  const x = l();
  return x.parentElement.style.position = "relative", x.parentElement.appendChild(s), x.addEventListener("input", S), x.addEventListener("click", k), x.addEventListener("keydown", E), x.addEventListener("blur", N), () => {
    x.removeEventListener("input", S), x.removeEventListener("click", k), x.removeEventListener("keydown", E), x.removeEventListener("blur", N), s == null || s.remove();
  };
}
function W(e) {
  e.directive(
    "placeholders",
    (n, { expression: r, modifiers: s }, { effect: u, evaluate: g }) => {
      const l = I(s), o = R(n, () => {
        try {
          const p = g(r);
          if (Array.isArray(p)) return p;
        } catch {
        }
        return r.split(",").map((p) => p.trim()).filter(Boolean);
      }, l);
      u(() => o);
    }
  );
}
function F(e) {
  e.directive("placeholders", ({ el: n, directive: r, component: s, cleanup: u }) => {
    const g = r.expression.trim(), l = I(r.modifiers), o = R(n, () => {
      const p = s.$wire.get(g);
      return Array.isArray(p) ? p : [];
    }, l);
    u(o);
  });
}
const D = (e) => {
  var r, s;
  const n = (r = e.tagName) == null ? void 0 : r.toUpperCase();
  return n === "INPUT" || n === "TEXTAREA" || e.isContentEditable ? e : e.querySelector("input, textarea, [contenteditable]") || ((s = e.parentElement) == null ? void 0 : s.querySelector("input, textarea, [contenteditable]")) || e;
}, q = (e) => e.split(",").map((n) => n.trim()).filter(Boolean);
function Z(e) {
  e.directive(
    "email-mask",
    (n, { expression: r }, { effect: s }) => {
      const u = new Set(q(r)), g = /^\s*\{([\w]+)\}\s*$/, l = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, t = D(n), o = (m) => u.has(m), p = (m) => {
        const i = m.match(g);
        if (i) {
          const c = i[1];
          return o(c) ? `{${c}}` : null;
        }
        const C = m.match(l);
        if (!C) return null;
        const h = C[1], $ = C[2];
        return !o(h) || !o($) ? null : `{${h}}<{${$}}>`;
      }, w = () => {
        const m = t.value.trim();
        if (m === "") {
          t.setCustomValidity("");
          return;
        }
        if (p(m) !== null) {
          t.setCustomValidity("");
          return;
        }
        t.setCustomValidity("Use {field} or {name}<{email}> format.");
      }, L = () => {
        const m = t.value.trim();
        if (m === "") {
          t.setCustomValidity("");
          return;
        }
        const i = p(m);
        if (i === null) {
          w();
          return;
        }
        i !== t.value && (t.value = i, t.dispatchEvent(new Event("input", { bubbles: !0 }))), t.setCustomValidity("");
      }, y = () => w();
      t.addEventListener("input", y), t.addEventListener("blur", L), s(() => () => {
        t.removeEventListener("input", y), t.removeEventListener("blur", L);
      });
    }
  );
}
function X(e) {
  e.directive(
    "slug",
    (n, { expression: r, modifiers: s }, { evaluate: u, cleanup: g }) => {
      const l = s[0] ?? "-", t = n, o = (h) => h.toString().toLowerCase().trim().replace(/[\s\W-]+/g, l).replace(new RegExp(`^${l}+|${l}+$`, "g"), "").replace(new RegExp(`${l}{2,}`, "g"), l), p = r.trim().split(",").map((h) => h.trim());
      let w = "";
      const L = () => o(
        p.map((h) => u(h)).filter(Boolean).join(" ")
      ), y = L();
      !t.value && y && (w = y, t.value = w, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      const m = u("$watch"), i = p.map(
        (h) => m(h, () => {
          (!t.value || t.value === w) && (w = L(), t.value = w, t.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), C = () => {
        const h = t.selectionStart ?? 0, $ = t.value, c = o($);
        if ($ !== c) {
          t.value = c;
          const v = Math.min(h, c.length);
          t.setSelectionRange(v, v);
        }
      };
      t.addEventListener("blur", C), g(() => {
        i.forEach((h) => h()), t.removeEventListener("blur", C);
      });
    }
  );
}
function H(e) {
  e.directive("slug", ({ el: n, directive: r, component: s, cleanup: u }) => {
    const g = r.modifiers.length > 0 ? r.modifiers[0] : "-", l = r.expression.trim().split(",").map((i) => i.trim()), t = n, o = (i) => i.toString().toLowerCase().trim().replace(/[\s\W-]+/g, g).replace(new RegExp(`^${g}+|${g}+$`, "g"), "").replace(new RegExp(`${g}{2,}`, "g"), g);
    let p = "";
    const w = () => o(
      l.map((i) => s.$wire.get(i)).filter(Boolean).join(" ")
    ), L = w();
    !t.value && L && (p = L, t.value = p, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const y = l.map(
      (i) => s.$wire.$watch(i, () => {
        (!t.value || t.value === p) && (p = w(), t.value = p, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), m = () => {
      const i = t.selectionStart ?? 0, C = t.value, h = o(C);
      if (C !== h) {
        t.value = h;
        const $ = Math.min(i, h.length);
        t.setSelectionRange($, $);
      }
    };
    t.addEventListener("blur", m), u(() => {
      y.forEach((i) => i()), t.removeEventListener("blur", m);
    });
  });
}
function J(e) {
  e.directive(
    "case",
    (n, { expression: r, modifiers: s }, { evaluate: u, cleanup: g }) => {
      const l = s[0] ?? "camel", t = s[1] === "underscore" ? "_" : "-", o = n, p = (a) => a.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), w = (a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(), L = (a) => {
        const E = t;
        return a.toString().toLowerCase().trim().replace(/[\s\W-]+/g, E).replace(new RegExp(`^${E}+|${E}+$`, "g"), "").replace(new RegExp(`${E}{2,}`, "g"), E);
      }, y = (a) => {
        const E = p(a.toString().trim());
        switch (l) {
          case "slug":
            return L(a);
          case "camel":
            return E.map((S, k) => k === 0 ? S.toLowerCase() : w(S)).join("");
          case "pascal":
            return E.map(w).join("");
          case "snake":
            return E.map((S) => S.toLowerCase()).join("_");
          case "constant":
            return E.map((S) => S.toUpperCase()).join("_");
          case "title":
            return E.map(w).join(" ");
          case "dot":
            return E.map((S) => S.toLowerCase()).join(".");
          case "kebab":
            return E.map((S) => S.toLowerCase()).join("-");
          case "lower":
            return a.toLowerCase().trim();
          case "upper":
            return a.toUpperCase().trim();
          default:
            return a;
        }
      }, m = r.trim().split(",").map((a) => a.trim());
      let i = "";
      const C = () => y(
        m.map((a) => u(a)).filter(Boolean).join(" ")
      ), h = C();
      !o.value && h && (i = h, o.value = i, o.dispatchEvent(new Event("input", { bubbles: !0 })));
      const $ = u("$watch"), c = m.map(
        (a) => $(a, () => {
          (!o.value || o.value === i) && (i = C(), o.value = i, o.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), v = () => {
        const a = o.selectionStart ?? 0, E = o.value, S = y(E);
        if (E !== S) {
          o.value = S;
          const k = Math.min(a, S.length);
          o.setSelectionRange(k, k);
        }
      };
      o.addEventListener("blur", v), g(() => {
        c.forEach((a) => a()), o.removeEventListener("blur", v);
      });
    }
  );
}
function K(e) {
  e.directive("case", ({ el: n, directive: r, component: s, cleanup: u }) => {
    const g = r.modifiers[0] ?? "camel", l = r.modifiers[1] === "underscore" ? "_" : "-", t = r.expression.trim().split(",").map((c) => c.trim()), o = n, p = (c) => c.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), w = (c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase(), L = (c) => {
      const v = l;
      return c.toString().toLowerCase().trim().replace(/[\s\W-]+/g, v).replace(new RegExp(`^${v}+|${v}+$`, "g"), "").replace(new RegExp(`${v}{2,}`, "g"), v);
    }, y = (c) => {
      const v = p(c.toString().trim());
      switch (g) {
        case "slug":
          return L(c);
        case "camel":
          return v.map((a, E) => E === 0 ? a.toLowerCase() : w(a)).join("");
        case "pascal":
          return v.map(w).join("");
        case "snake":
          return v.map((a) => a.toLowerCase()).join("_");
        case "constant":
          return v.map((a) => a.toUpperCase()).join("_");
        case "title":
          return v.map(w).join(" ");
        case "dot":
          return v.map((a) => a.toLowerCase()).join(".");
        case "kebab":
          return v.map((a) => a.toLowerCase()).join("-");
        case "lower":
          return c.toLowerCase().trim();
        case "upper":
          return c.toUpperCase().trim();
        default:
          return c;
      }
    };
    let m = "";
    const i = () => y(
      t.map((c) => s.$wire.get(c)).filter(Boolean).join(" ")
    ), C = i();
    !o.value && C && (m = C, o.value = m, o.dispatchEvent(new Event("input", { bubbles: !0 })));
    const h = t.map(
      (c) => s.$wire.$watch(c, () => {
        (!o.value || o.value === m) && (m = i(), o.value = m, o.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), $ = () => {
      const c = o.selectionStart ?? 0, v = o.value, a = y(v);
      if (v !== a) {
        o.value = a;
        const E = Math.min(c, a.length);
        o.setSelectionRange(E, E);
      }
    };
    o.addEventListener("blur", $), u(() => {
      h.forEach((c) => c()), o.removeEventListener("blur", $);
    });
  });
}
function Y(e) {
  for (const { name: n, value: r } of Array.from(e.attributes))
    if (/^wire:(click|submit|keydown|keyup|change|input)/.test(n))
      return r.replace(/\(.*$/, "").trim();
  return "";
}
function G(e, n) {
  e.directive("after", ({ el: r, directive: s, component: u, cleanup: g }) => {
    const l = s.modifiers.includes("finish"), t = s.expression.trim(), o = t.indexOf(","), p = o !== -1 ? t.slice(0, o).trim() : Y(r), w = o !== -1 ? t.slice(o + 1).trim() : t;
    if (!p || !w) return;
    const L = u.$wire.intercept(p, ({ onSuccess: y, onFinish: m }) => {
      (l ? m : y)(() => n.evaluate(r, w));
    });
    g(L);
  });
}
function Q(e) {
  e.magic("memo", () => {
    let n;
    return e.interceptor((r, s, u, g) => {
      const l = n || `_x_${g}`, t = sessionStorage.getItem(l);
      return u(t !== null ? JSON.parse(t) : r), e.effect(() => {
        sessionStorage.setItem(l, JSON.stringify(s()));
      }), r;
    }, (r) => {
      r.as = (s) => (n = s, r);
    });
  });
}
class ee {
  constructor(n) {
    j(this, "storeName", "keyvaluepairs");
    j(this, "dbPromise");
    this.dbPromise = new Promise((r) => {
      const s = indexedDB.open(n, 1);
      s.onupgradeneeded = () => s.result.createObjectStore(this.storeName), s.onsuccess = () => r(s.result);
    });
  }
  async get(n) {
    const r = await this.dbPromise;
    return new Promise((s) => {
      const u = r.transaction(this.storeName).objectStore(this.storeName).get(n);
      u.onsuccess = () => s(u.result);
    });
  }
  async set(n, r) {
    (await this.dbPromise).transaction(this.storeName, "readwrite").objectStore(this.storeName).put(r, n);
  }
}
function te(e) {
  const n = new ee("AlpineVault");
  e.magic("vault", () => {
    let r;
    return e.interceptor((s, u, g, l) => {
      const t = r || `_x_${l}`;
      return n.get(t).then((o) => {
        o != null && g(o);
      }), e.effect(() => {
        n.set(t, u());
      }), s;
    }, (s) => {
      s.as = (u) => (r = u, s);
    });
  });
}
function re(e, n) {
  W(n), Z(n), X(n), J(n), Q(n), te(n), F(e), H(e), K(e), G(e, n);
}
export {
  G as registerAfterLivewire,
  J as registerCaseAlpine,
  K as registerCaseLivewire,
  re as registerDirectives,
  Z as registerEmailMask,
  Q as registerMemo,
  W as registerPlaceholders,
  F as registerPlaceholdersLivewire,
  X as registerSlugAlpine,
  H as registerSlugLivewire,
  te as registerVault
};
//# sourceMappingURL=index.js.map
