var O = Object.defineProperty;
var _ = (s, n, r) => n in s ? O(s, n, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[n] = r;
var j = (s, n, r) => _(s, typeof n != "symbol" ? n + "" : n, r);
const W = (s) => {
  var r, o;
  const n = (r = s.tagName) == null ? void 0 : r.toUpperCase();
  return n === "INPUT" || n === "TEXTAREA" || s.isContentEditable ? s : s.querySelector("input, textarea, [contenteditable]") || ((o = s.parentElement) == null ? void 0 : o.querySelector("input, textarea, [contenteditable]")) || s;
}, F = (s) => s.split(",").map((n) => n.trim()).filter(Boolean);
function D(s) {
  s.directive(
    "placeholders",
    (n, { expression: r }, { effect: o }) => {
      const m = F(r);
      let c = null, g = !1, e = "";
      const t = () => W(n), b = (i) => {
        var h;
        const w = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        return ((h = w == null ? void 0 : w.get) == null ? void 0 : h.call(i)) ?? "";
      }, E = (i, w) => {
        var x;
        const h = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        (x = h == null ? void 0 : h.set) == null || x.call(i, w);
      }, $ = () => {
        var h;
        const i = t();
        return ((h = i.tagName) == null ? void 0 : h.toUpperCase()) === "TEXTAREA" ? b(i) : i.isContentEditable ? i.innerText : i.value;
      }, S = (i) => {
        var x;
        const w = t();
        ((x = w.tagName) == null ? void 0 : x.toUpperCase()) === "TEXTAREA" ? E(w, i) : w.isContentEditable ? w.innerText = i : w.value = i;
      }, p = () => t().selectionStart ?? 0, l = (i) => {
        var h;
        const w = t();
        (h = w.setSelectionRange) == null || h.call(w, i, i);
      }, C = () => e ? m.filter(
        (i) => i.toLowerCase().includes(e.toLowerCase())
      ) : m, v = () => {
        c && (c.style.display = "block");
      }, L = () => {
        c && (c.style.display = "none");
      }, u = () => {
        if (!c) return;
        c.innerHTML = "";
        const i = C();
        if (!i.length) {
          L();
          return;
        }
        i.forEach((w) => {
          const h = document.createElement("div");
          h.textContent = `{${w}}`, h.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", h.addEventListener("mousedown", (x) => {
            x.preventDefault(), y(w);
          }), c.appendChild(h);
        }), v();
      }, d = () => {
        g = !1, e = "", L();
      }, a = () => {
        g = !0, u();
      }, f = () => {
        const i = $(), w = p(), h = i.slice(0, w), x = h.lastIndexOf("{"), N = h.lastIndexOf("}");
        if (x === -1 || N > x) {
          d();
          return;
        }
        e = h.slice(x + 1), a();
      }, y = (i) => {
        const w = t(), h = w.selectionStart ?? 0, x = $(), U = x.slice(0, h).lastIndexOf("{");
        if (U === -1) return;
        const I = x.slice(0, U), A = x.slice(h), z = `${I}{${i}}${A}`;
        S(z), l(I.length + i.length + 2), w.dispatchEvent(new Event("input", { bubbles: !0 })), d();
      }, P = (i) => {
        g && i.key === "Escape" && (i.preventDefault(), d());
      }, M = () => f(), T = () => f(), V = () => d(), B = () => {
        c = document.createElement("div"), c.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", c.style.display = "none";
        const i = t();
        i.parentElement.style.position = "relative", i.parentElement.appendChild(c);
      }, R = () => {
        const i = t();
        i.removeEventListener("input", M), i.removeEventListener("click", T), i.removeEventListener("keydown", P), i.removeEventListener("blur", V), c == null || c.remove();
      };
      B();
      const k = t();
      k.addEventListener("input", M), k.addEventListener("click", T), k.addEventListener("keydown", P), k.addEventListener("blur", V), o(() => R);
    }
  );
}
const q = (s) => {
  var r, o;
  const n = (r = s.tagName) == null ? void 0 : r.toUpperCase();
  return n === "INPUT" || n === "TEXTAREA" || s.isContentEditable ? s : s.querySelector("input, textarea, [contenteditable]") || ((o = s.parentElement) == null ? void 0 : o.querySelector("input, textarea, [contenteditable]")) || s;
}, Z = (s) => s.split(",").map((n) => n.trim()).filter(Boolean);
function X(s) {
  s.directive(
    "email-mask",
    (n, { expression: r }, { effect: o }) => {
      const m = new Set(Z(r)), c = /^\s*\{([\w]+)\}\s*$/, g = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, e = q(n), t = (p) => m.has(p), b = (p) => {
        const l = p.match(c);
        if (l) {
          const u = l[1];
          return t(u) ? `{${u}}` : null;
        }
        const C = p.match(g);
        if (!C) return null;
        const v = C[1], L = C[2];
        return !t(v) || !t(L) ? null : `{${v}}<{${L}}>`;
      }, E = () => {
        const p = e.value.trim();
        if (p === "") {
          e.setCustomValidity("");
          return;
        }
        if (b(p) !== null) {
          e.setCustomValidity("");
          return;
        }
        e.setCustomValidity("Use {field} or {name}<{email}> format.");
      }, $ = () => {
        const p = e.value.trim();
        if (p === "") {
          e.setCustomValidity("");
          return;
        }
        const l = b(p);
        if (l === null) {
          E();
          return;
        }
        l !== e.value && (e.value = l, e.dispatchEvent(new Event("input", { bubbles: !0 }))), e.setCustomValidity("");
      }, S = () => E();
      e.addEventListener("input", S), e.addEventListener("blur", $), o(() => () => {
        e.removeEventListener("input", S), e.removeEventListener("blur", $);
      });
    }
  );
}
function H(s) {
  s.directive(
    "slug",
    (n, { expression: r, modifiers: o }, { evaluate: m, cleanup: c }) => {
      const g = o[0] ?? "-", e = n, t = (v) => v.toString().toLowerCase().trim().replace(/[\s\W-]+/g, g).replace(new RegExp(`^${g}+|${g}+$`, "g"), "").replace(new RegExp(`${g}{2,}`, "g"), g), b = r.trim().split(",").map((v) => v.trim());
      let E = "";
      const $ = () => t(
        b.map((v) => m(v)).filter(Boolean).join(" ")
      ), S = $();
      !e.value && S && (E = S, e.value = E, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      const p = m("$watch"), l = b.map(
        (v) => p(v, () => {
          (!e.value || e.value === E) && (E = $(), e.value = E, e.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), C = () => {
        const v = e.selectionStart ?? 0, L = e.value, u = t(L);
        if (L !== u) {
          e.value = u;
          const d = Math.min(v, u.length);
          e.setSelectionRange(d, d);
        }
      };
      e.addEventListener("blur", C), c(() => {
        l.forEach((v) => v()), e.removeEventListener("blur", C);
      });
    }
  );
}
function J(s) {
  s.directive("slug", ({ el: n, directive: r, component: o, cleanup: m }) => {
    const c = r.modifiers.length > 0 ? r.modifiers[0] : "-", g = r.expression.trim().split(",").map((l) => l.trim()), e = n, t = (l) => l.toString().toLowerCase().trim().replace(/[\s\W-]+/g, c).replace(new RegExp(`^${c}+|${c}+$`, "g"), "").replace(new RegExp(`${c}{2,}`, "g"), c);
    let b = "";
    const E = () => t(
      g.map((l) => o.$wire.get(l)).filter(Boolean).join(" ")
    ), $ = E();
    !e.value && $ && (b = $, e.value = b, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    const S = g.map(
      (l) => o.$wire.$watch(l, () => {
        (!e.value || e.value === b) && (b = E(), e.value = b, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), p = () => {
      const l = e.selectionStart ?? 0, C = e.value, v = t(C);
      if (C !== v) {
        e.value = v;
        const L = Math.min(l, v.length);
        e.setSelectionRange(L, L);
      }
    };
    e.addEventListener("blur", p), m(() => {
      S.forEach((l) => l()), e.removeEventListener("blur", p);
    });
  });
}
function K(s) {
  s.directive(
    "case",
    (n, { expression: r, modifiers: o }, { evaluate: m, cleanup: c }) => {
      const g = o[0] ?? "camel", e = o[1] === "underscore" ? "_" : "-", t = n, b = (a) => a.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), E = (a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(), $ = (a) => {
        const f = e;
        return a.toString().toLowerCase().trim().replace(/[\s\W-]+/g, f).replace(new RegExp(`^${f}+|${f}+$`, "g"), "").replace(new RegExp(`${f}{2,}`, "g"), f);
      }, S = (a) => {
        const f = b(a.toString().trim());
        switch (g) {
          case "slug":
            return $(a);
          case "camel":
            return f.map((y, P) => P === 0 ? y.toLowerCase() : E(y)).join("");
          case "pascal":
            return f.map(E).join("");
          case "snake":
            return f.map((y) => y.toLowerCase()).join("_");
          case "constant":
            return f.map((y) => y.toUpperCase()).join("_");
          case "title":
            return f.map(E).join(" ");
          case "dot":
            return f.map((y) => y.toLowerCase()).join(".");
          case "kebab":
            return f.map((y) => y.toLowerCase()).join("-");
          case "lower":
            return a.toLowerCase().trim();
          case "upper":
            return a.toUpperCase().trim();
          default:
            return a;
        }
      }, p = r.trim().split(",").map((a) => a.trim());
      let l = "";
      const C = () => S(
        p.map((a) => m(a)).filter(Boolean).join(" ")
      ), v = C();
      !t.value && v && (l = v, t.value = l, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      const L = m("$watch"), u = p.map(
        (a) => L(a, () => {
          (!t.value || t.value === l) && (l = C(), t.value = l, t.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), d = () => {
        const a = t.selectionStart ?? 0, f = t.value, y = S(f);
        if (f !== y) {
          t.value = y;
          const P = Math.min(a, y.length);
          t.setSelectionRange(P, P);
        }
      };
      t.addEventListener("blur", d), c(() => {
        u.forEach((a) => a()), t.removeEventListener("blur", d);
      });
    }
  );
}
function G(s) {
  s.directive("case", ({ el: n, directive: r, component: o, cleanup: m }) => {
    const c = r.modifiers[0] ?? "camel", g = r.modifiers[1] === "underscore" ? "_" : "-", e = r.expression.trim().split(",").map((u) => u.trim()), t = n, b = (u) => u.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), E = (u) => u.charAt(0).toUpperCase() + u.slice(1).toLowerCase(), $ = (u) => {
      const d = g;
      return u.toString().toLowerCase().trim().replace(/[\s\W-]+/g, d).replace(new RegExp(`^${d}+|${d}+$`, "g"), "").replace(new RegExp(`${d}{2,}`, "g"), d);
    }, S = (u) => {
      const d = b(u.toString().trim());
      switch (c) {
        case "slug":
          return $(u);
        case "camel":
          return d.map((a, f) => f === 0 ? a.toLowerCase() : E(a)).join("");
        case "pascal":
          return d.map(E).join("");
        case "snake":
          return d.map((a) => a.toLowerCase()).join("_");
        case "constant":
          return d.map((a) => a.toUpperCase()).join("_");
        case "title":
          return d.map(E).join(" ");
        case "dot":
          return d.map((a) => a.toLowerCase()).join(".");
        case "kebab":
          return d.map((a) => a.toLowerCase()).join("-");
        case "lower":
          return u.toLowerCase().trim();
        case "upper":
          return u.toUpperCase().trim();
        default:
          return u;
      }
    };
    let p = "";
    const l = () => S(
      e.map((u) => o.$wire.get(u)).filter(Boolean).join(" ")
    ), C = l();
    !t.value && C && (p = C, t.value = p, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const v = e.map(
      (u) => o.$wire.$watch(u, () => {
        (!t.value || t.value === p) && (p = l(), t.value = p, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), L = () => {
      const u = t.selectionStart ?? 0, d = t.value, a = S(d);
      if (d !== a) {
        t.value = a;
        const f = Math.min(u, a.length);
        t.setSelectionRange(f, f);
      }
    };
    t.addEventListener("blur", L), m(() => {
      v.forEach((u) => u()), t.removeEventListener("blur", L);
    });
  });
}
function Q(s) {
  for (const { name: n, value: r } of Array.from(s.attributes))
    if (/^wire:(click|submit|keydown|keyup|change|input)/.test(n))
      return r.replace(/\(.*$/, "").trim();
  return "";
}
function Y(s, n) {
  s.directive("after", ({ el: r, directive: o, component: m, cleanup: c }) => {
    const g = o.modifiers.includes("finish"), e = o.expression.trim(), t = e.indexOf(","), b = t !== -1 ? e.slice(0, t).trim() : Q(r), E = t !== -1 ? e.slice(t + 1).trim() : e;
    if (!b || !E) return;
    const $ = m.$wire.intercept(b, ({ onSuccess: S, onFinish: p }) => {
      (g ? p : S)(() => n.evaluate(r, E));
    });
    c($);
  });
}
function ee(s) {
  s.magic("memo", () => {
    let n;
    return s.interceptor((r, o, m, c) => {
      const g = n || `_x_${c}`, e = sessionStorage.getItem(g);
      return m(e !== null ? JSON.parse(e) : r), s.effect(() => {
        sessionStorage.setItem(g, JSON.stringify(o()));
      }), r;
    }, (r) => {
      r.as = (o) => (n = o, r);
    });
  });
}
class te {
  constructor(n) {
    j(this, "storeName", "keyvaluepairs");
    j(this, "dbPromise");
    this.dbPromise = new Promise((r) => {
      const o = indexedDB.open(n, 1);
      o.onupgradeneeded = () => o.result.createObjectStore(this.storeName), o.onsuccess = () => r(o.result);
    });
  }
  async get(n) {
    const r = await this.dbPromise;
    return new Promise((o) => {
      const m = r.transaction(this.storeName).objectStore(this.storeName).get(n);
      m.onsuccess = () => o(m.result);
    });
  }
  async set(n, r) {
    (await this.dbPromise).transaction(this.storeName, "readwrite").objectStore(this.storeName).put(r, n);
  }
}
function ne(s) {
  const n = new te("AlpineVault");
  s.magic("vault", () => {
    let r;
    return s.interceptor((o, m, c, g) => {
      const e = r || `_x_${g}`;
      return n.get(e).then((t) => {
        t != null && c(t);
      }), s.effect(() => {
        n.set(e, m());
      }), o;
    }, (o) => {
      o.as = (m) => (r = m, o);
    });
  });
}
function re(s, n) {
  D(n), X(n), H(n), K(n), ee(n), ne(n), J(s), G(s), Y(s, n);
}
export {
  Y as registerAfterLivewire,
  K as registerCaseAlpine,
  G as registerCaseLivewire,
  re as registerDirectives,
  X as registerEmailMask,
  ee as registerMemo,
  D as registerPlaceholders,
  H as registerSlugAlpine,
  J as registerSlugLivewire,
  ne as registerVault
};
//# sourceMappingURL=index.js.map
