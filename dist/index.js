const N = (r) => {
  var E, v;
  const l = (E = r.tagName) == null ? void 0 : E.toUpperCase();
  return l === "INPUT" || l === "TEXTAREA" || r.isContentEditable ? r : r.querySelector("input, textarea, [contenteditable]") || ((v = r.parentElement) == null ? void 0 : v.querySelector("input, textarea, [contenteditable]")) || r;
}, O = (r) => r.split(",").map((l) => l.trim()).filter(Boolean);
function W(r) {
  r.directive(
    "placeholders",
    (l, { expression: E }, { effect: v }) => {
      const S = O(E);
      let i = null, h = !1, e = "";
      const t = () => N(l), w = (s) => {
        var m;
        const g = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        return ((m = g == null ? void 0 : g.get) == null ? void 0 : m.call(s)) ?? "";
      }, f = (s, g) => {
        var x;
        const m = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        (x = m == null ? void 0 : m.set) == null || x.call(s, g);
      }, C = () => {
        var m;
        const s = t();
        return ((m = s.tagName) == null ? void 0 : m.toUpperCase()) === "TEXTAREA" ? w(s) : s.isContentEditable ? s.innerText : s.value;
      }, $ = (s) => {
        var x;
        const g = t();
        ((x = g.tagName) == null ? void 0 : x.toUpperCase()) === "TEXTAREA" ? f(g, s) : g.isContentEditable ? g.innerText = s : g.value = s;
      }, u = () => t().selectionStart ?? 0, a = (s) => {
        var m;
        const g = t();
        (m = g.setSelectionRange) == null || m.call(g, s, s);
      }, b = () => e ? S.filter(
        (s) => s.toLowerCase().includes(e.toLowerCase())
      ) : S, p = () => {
        i && (i.style.display = "block");
      }, L = () => {
        i && (i.style.display = "none");
      }, o = () => {
        if (!i) return;
        i.innerHTML = "";
        const s = b();
        if (!s.length) {
          L();
          return;
        }
        s.forEach((g) => {
          const m = document.createElement("div");
          m.textContent = `{${g}}`, m.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", m.addEventListener("mousedown", (x) => {
            x.preventDefault(), y(g);
          }), i.appendChild(m);
        }), p();
      }, c = () => {
        h = !1, e = "", L();
      }, n = () => {
        h = !0, o();
      }, d = () => {
        const s = C(), g = u(), m = s.slice(0, g), x = m.lastIndexOf("{"), j = m.lastIndexOf("}");
        if (x === -1 || j > x) {
          c();
          return;
        }
        e = m.slice(x + 1), n();
      }, y = (s) => {
        const g = t(), m = g.selectionStart ?? 0, x = C(), k = x.slice(0, m).lastIndexOf("{");
        if (k === -1) return;
        const A = x.slice(0, k), I = x.slice(m), z = `${A}{${s}}${I}`;
        $(z), a(A.length + s.length + 2), g.dispatchEvent(new Event("input", { bubbles: !0 })), c();
      }, P = (s) => {
        h && s.key === "Escape" && (s.preventDefault(), c());
      }, T = () => d(), U = () => d(), V = () => c(), R = () => {
        i = document.createElement("div"), i.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", i.style.display = "none";
        const s = t();
        s.parentElement.style.position = "relative", s.parentElement.appendChild(i);
      }, B = () => {
        const s = t();
        s.removeEventListener("input", T), s.removeEventListener("click", U), s.removeEventListener("keydown", P), s.removeEventListener("blur", V), i == null || i.remove();
      };
      R();
      const M = t();
      M.addEventListener("input", T), M.addEventListener("click", U), M.addEventListener("keydown", P), M.addEventListener("blur", V), v(() => B);
    }
  );
}
const F = (r) => {
  var E, v;
  const l = (E = r.tagName) == null ? void 0 : E.toUpperCase();
  return l === "INPUT" || l === "TEXTAREA" || r.isContentEditable ? r : r.querySelector("input, textarea, [contenteditable]") || ((v = r.parentElement) == null ? void 0 : v.querySelector("input, textarea, [contenteditable]")) || r;
}, _ = (r) => r.split(",").map((l) => l.trim()).filter(Boolean);
function Z(r) {
  r.directive(
    "email-mask",
    (l, { expression: E }, { effect: v }) => {
      const S = new Set(_(E)), i = /^\s*\{([\w]+)\}\s*$/, h = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, e = F(l), t = (u) => S.has(u), w = (u) => {
        const a = u.match(i);
        if (a) {
          const o = a[1];
          return t(o) ? `{${o}}` : null;
        }
        const b = u.match(h);
        if (!b) return null;
        const p = b[1], L = b[2];
        return !t(p) || !t(L) ? null : `{${p}}<{${L}}>`;
      }, f = () => {
        const u = e.value.trim();
        if (u === "") {
          e.setCustomValidity("");
          return;
        }
        if (w(u) !== null) {
          e.setCustomValidity("");
          return;
        }
        e.setCustomValidity("Use {field} or {name}<{email}> format.");
      }, C = () => {
        const u = e.value.trim();
        if (u === "") {
          e.setCustomValidity("");
          return;
        }
        const a = w(u);
        if (a === null) {
          f();
          return;
        }
        a !== e.value && (e.value = a, e.dispatchEvent(new Event("input", { bubbles: !0 }))), e.setCustomValidity("");
      }, $ = () => f();
      e.addEventListener("input", $), e.addEventListener("blur", C), v(() => () => {
        e.removeEventListener("input", $), e.removeEventListener("blur", C);
      });
    }
  );
}
function D(r) {
  r.directive(
    "slug",
    (l, { expression: E, modifiers: v }, { evaluate: S, cleanup: i }) => {
      const h = v[0] ?? "-", e = l, t = (p) => p.toString().toLowerCase().trim().replace(/[\s\W-]+/g, h).replace(new RegExp(`^${h}+|${h}+$`, "g"), "").replace(new RegExp(`${h}{2,}`, "g"), h), w = E.trim().split(",").map((p) => p.trim());
      let f = "";
      const C = () => t(
        w.map((p) => S(p)).filter(Boolean).join(" ")
      ), $ = C();
      !e.value && $ && (f = $, e.value = f, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      const u = S("$watch"), a = w.map(
        (p) => u(p, () => {
          (!e.value || e.value === f) && (f = C(), e.value = f, e.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), b = () => {
        const p = e.selectionStart ?? 0, L = e.value, o = t(L);
        if (L !== o) {
          e.value = o;
          const c = Math.min(p, o.length);
          e.setSelectionRange(c, c);
        }
      };
      e.addEventListener("blur", b), i(() => {
        a.forEach((p) => p()), e.removeEventListener("blur", b);
      });
    }
  );
}
function q(r) {
  r.directive("slug", ({ el: l, directive: E, component: v, cleanup: S }) => {
    const i = E.modifiers.length > 0 ? E.modifiers[0] : "-", h = E.expression.trim().split(",").map((a) => a.trim()), e = l, t = (a) => a.toString().toLowerCase().trim().replace(/[\s\W-]+/g, i).replace(new RegExp(`^${i}+|${i}+$`, "g"), "").replace(new RegExp(`${i}{2,}`, "g"), i);
    let w = "";
    const f = () => t(
      h.map((a) => v.$wire.get(a)).filter(Boolean).join(" ")
    ), C = f();
    !e.value && C && (w = C, e.value = w, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    const $ = h.map(
      (a) => v.$wire.$watch(a, () => {
        (!e.value || e.value === w) && (w = f(), e.value = w, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), u = () => {
      const a = e.selectionStart ?? 0, b = e.value, p = t(b);
      if (b !== p) {
        e.value = p;
        const L = Math.min(a, p.length);
        e.setSelectionRange(L, L);
      }
    };
    e.addEventListener("blur", u), S(() => {
      $.forEach((a) => a()), e.removeEventListener("blur", u);
    });
  });
}
function X(r) {
  r.directive(
    "case",
    (l, { expression: E, modifiers: v }, { evaluate: S, cleanup: i }) => {
      const h = v[0] ?? "camel", e = v[1] === "underscore" ? "_" : "-", t = l, w = (n) => n.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), f = (n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(), C = (n) => {
        const d = e;
        return n.toString().toLowerCase().trim().replace(/[\s\W-]+/g, d).replace(new RegExp(`^${d}+|${d}+$`, "g"), "").replace(new RegExp(`${d}{2,}`, "g"), d);
      }, $ = (n) => {
        const d = w(n.toString().trim());
        switch (h) {
          case "slug":
            return C(n);
          case "camel":
            return d.map((y, P) => P === 0 ? y.toLowerCase() : f(y)).join("");
          case "pascal":
            return d.map(f).join("");
          case "snake":
            return d.map((y) => y.toLowerCase()).join("_");
          case "constant":
            return d.map((y) => y.toUpperCase()).join("_");
          case "title":
            return d.map(f).join(" ");
          case "dot":
            return d.map((y) => y.toLowerCase()).join(".");
          case "kebab":
            return d.map((y) => y.toLowerCase()).join("-");
          case "lower":
            return n.toLowerCase().trim();
          case "upper":
            return n.toUpperCase().trim();
          default:
            return n;
        }
      }, u = E.trim().split(",").map((n) => n.trim());
      let a = "";
      const b = () => $(
        u.map((n) => S(n)).filter(Boolean).join(" ")
      ), p = b();
      !t.value && p && (a = p, t.value = a, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      const L = S("$watch"), o = u.map(
        (n) => L(n, () => {
          (!t.value || t.value === a) && (a = b(), t.value = a, t.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), c = () => {
        const n = t.selectionStart ?? 0, d = t.value, y = $(d);
        if (d !== y) {
          t.value = y;
          const P = Math.min(n, y.length);
          t.setSelectionRange(P, P);
        }
      };
      t.addEventListener("blur", c), i(() => {
        o.forEach((n) => n()), t.removeEventListener("blur", c);
      });
    }
  );
}
function H(r) {
  r.directive("case", ({ el: l, directive: E, component: v, cleanup: S }) => {
    const i = E.modifiers[0] ?? "camel", h = E.modifiers[1] === "underscore" ? "_" : "-", e = E.expression.trim().split(",").map((o) => o.trim()), t = l, w = (o) => o.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), f = (o) => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase(), C = (o) => {
      const c = h;
      return o.toString().toLowerCase().trim().replace(/[\s\W-]+/g, c).replace(new RegExp(`^${c}+|${c}+$`, "g"), "").replace(new RegExp(`${c}{2,}`, "g"), c);
    }, $ = (o) => {
      const c = w(o.toString().trim());
      switch (i) {
        case "slug":
          return C(o);
        case "camel":
          return c.map((n, d) => d === 0 ? n.toLowerCase() : f(n)).join("");
        case "pascal":
          return c.map(f).join("");
        case "snake":
          return c.map((n) => n.toLowerCase()).join("_");
        case "constant":
          return c.map((n) => n.toUpperCase()).join("_");
        case "title":
          return c.map(f).join(" ");
        case "dot":
          return c.map((n) => n.toLowerCase()).join(".");
        case "kebab":
          return c.map((n) => n.toLowerCase()).join("-");
        case "lower":
          return o.toLowerCase().trim();
        case "upper":
          return o.toUpperCase().trim();
        default:
          return o;
      }
    };
    let u = "";
    const a = () => $(
      e.map((o) => v.$wire.get(o)).filter(Boolean).join(" ")
    ), b = a();
    !t.value && b && (u = b, t.value = u, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const p = e.map(
      (o) => v.$wire.$watch(o, () => {
        (!t.value || t.value === u) && (u = a(), t.value = u, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), L = () => {
      const o = t.selectionStart ?? 0, c = t.value, n = $(c);
      if (c !== n) {
        t.value = n;
        const d = Math.min(o, n.length);
        t.setSelectionRange(d, d);
      }
    };
    t.addEventListener("blur", L), S(() => {
      p.forEach((o) => o()), t.removeEventListener("blur", L);
    });
  });
}
function K(r, l) {
  r.directive("after", ({ el: E, directive: v, component: S, cleanup: i }) => {
    const h = v.modifiers[0];
    if (!h) return;
    const e = v.modifiers.includes("finish"), t = v.expression;
    let w = !1;
    S.$wire.intercept(({ action: f, onSuccess: C, onFinish: $ }) => {
      if (w || f.name !== h) return;
      (e ? $ : C)(() => {
        w || l.evaluate(E, t);
      });
    }), i(() => {
      w = !0;
    });
  });
}
function G(r, l) {
  W(l), Z(l), D(l), X(l), q(r), H(r), K(r, l);
}
export {
  K as registerAfterLivewire,
  X as registerCaseAlpine,
  H as registerCaseLivewire,
  G as registerDirectives,
  Z as registerEmailMask,
  W as registerPlaceholders,
  D as registerSlugAlpine,
  q as registerSlugLivewire
};
//# sourceMappingURL=index.js.map
