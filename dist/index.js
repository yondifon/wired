const N = (s) => {
  var p, E;
  const i = (p = s.tagName) == null ? void 0 : p.toUpperCase();
  return i === "INPUT" || i === "TEXTAREA" || s.isContentEditable ? s : s.querySelector("input, textarea, [contenteditable]") || ((E = s.parentElement) == null ? void 0 : E.querySelector("input, textarea, [contenteditable]")) || s;
}, O = (s) => s.split(",").map((i) => i.trim()).filter(Boolean);
function W(s) {
  s.directive(
    "placeholders",
    (i, { expression: p }, { effect: E }) => {
      const S = O(p);
      let c = null, h = !1, e = "";
      const t = () => N(i), w = (r) => {
        var v;
        const f = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        return ((v = f == null ? void 0 : f.get) == null ? void 0 : v.call(r)) ?? "";
      }, g = (r, f) => {
        var x;
        const v = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        );
        (x = v == null ? void 0 : v.set) == null || x.call(r, f);
      }, C = () => {
        var v;
        const r = t();
        return ((v = r.tagName) == null ? void 0 : v.toUpperCase()) === "TEXTAREA" ? w(r) : r.isContentEditable ? r.innerText : r.value;
      }, $ = (r) => {
        var x;
        const f = t();
        ((x = f.tagName) == null ? void 0 : x.toUpperCase()) === "TEXTAREA" ? g(f, r) : f.isContentEditable ? f.innerText = r : f.value = r;
      }, l = () => t().selectionStart ?? 0, o = (r) => {
        var v;
        const f = t();
        (v = f.setSelectionRange) == null || v.call(f, r, r);
      }, b = () => e ? S.filter(
        (r) => r.toLowerCase().includes(e.toLowerCase())
      ) : S, d = () => {
        c && (c.style.display = "block");
      }, L = () => {
        c && (c.style.display = "none");
      }, a = () => {
        if (!c) return;
        c.innerHTML = "";
        const r = b();
        if (!r.length) {
          L();
          return;
        }
        r.forEach((f) => {
          const v = document.createElement("div");
          v.textContent = `{${f}}`, v.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", v.addEventListener("mousedown", (x) => {
            x.preventDefault(), y(f);
          }), c.appendChild(v);
        }), d();
      }, u = () => {
        h = !1, e = "", L();
      }, n = () => {
        h = !0, a();
      }, m = () => {
        const r = C(), f = l(), v = r.slice(0, f), x = v.lastIndexOf("{"), V = v.lastIndexOf("}");
        if (x === -1 || V > x) {
          u();
          return;
        }
        e = v.slice(x + 1), n();
      }, y = (r) => {
        const f = t(), v = f.selectionStart ?? 0, x = C(), j = x.slice(0, v).lastIndexOf("{");
        if (j === -1) return;
        const A = x.slice(0, j), I = x.slice(v), z = `${A}{${r}}${I}`;
        $(z), o(A.length + r.length + 2), f.dispatchEvent(new Event("input", { bubbles: !0 })), u();
      }, P = (r) => {
        h && r.key === "Escape" && (r.preventDefault(), u());
      }, M = () => m(), T = () => m(), U = () => u(), R = () => {
        c = document.createElement("div"), c.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", c.style.display = "none";
        const r = t();
        r.parentElement.style.position = "relative", r.parentElement.appendChild(c);
      }, B = () => {
        const r = t();
        r.removeEventListener("input", M), r.removeEventListener("click", T), r.removeEventListener("keydown", P), r.removeEventListener("blur", U), c == null || c.remove();
      };
      R();
      const k = t();
      k.addEventListener("input", M), k.addEventListener("click", T), k.addEventListener("keydown", P), k.addEventListener("blur", U), E(() => B);
    }
  );
}
const F = (s) => {
  var p, E;
  const i = (p = s.tagName) == null ? void 0 : p.toUpperCase();
  return i === "INPUT" || i === "TEXTAREA" || s.isContentEditable ? s : s.querySelector("input, textarea, [contenteditable]") || ((E = s.parentElement) == null ? void 0 : E.querySelector("input, textarea, [contenteditable]")) || s;
}, _ = (s) => s.split(",").map((i) => i.trim()).filter(Boolean);
function Z(s) {
  s.directive(
    "email-mask",
    (i, { expression: p }, { effect: E }) => {
      const S = new Set(_(p)), c = /^\s*\{([\w]+)\}\s*$/, h = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, e = F(i), t = (l) => S.has(l), w = (l) => {
        const o = l.match(c);
        if (o) {
          const a = o[1];
          return t(a) ? `{${a}}` : null;
        }
        const b = l.match(h);
        if (!b) return null;
        const d = b[1], L = b[2];
        return !t(d) || !t(L) ? null : `{${d}}<{${L}}>`;
      }, g = () => {
        const l = e.value.trim();
        if (l === "") {
          e.setCustomValidity("");
          return;
        }
        if (w(l) !== null) {
          e.setCustomValidity("");
          return;
        }
        e.setCustomValidity("Use {field} or {name}<{email}> format.");
      }, C = () => {
        const l = e.value.trim();
        if (l === "") {
          e.setCustomValidity("");
          return;
        }
        const o = w(l);
        if (o === null) {
          g();
          return;
        }
        o !== e.value && (e.value = o, e.dispatchEvent(new Event("input", { bubbles: !0 }))), e.setCustomValidity("");
      }, $ = () => g();
      e.addEventListener("input", $), e.addEventListener("blur", C), E(() => () => {
        e.removeEventListener("input", $), e.removeEventListener("blur", C);
      });
    }
  );
}
function D(s) {
  s.directive(
    "slug",
    (i, { expression: p, modifiers: E }, { evaluate: S, cleanup: c }) => {
      const h = E[0] ?? "-", e = i, t = (d) => d.toString().toLowerCase().trim().replace(/[\s\W-]+/g, h).replace(new RegExp(`^${h}+|${h}+$`, "g"), "").replace(new RegExp(`${h}{2,}`, "g"), h), w = p.trim().split(",").map((d) => d.trim());
      let g = "";
      const C = () => t(
        w.map((d) => S(d)).filter(Boolean).join(" ")
      ), $ = C();
      !e.value && $ && (g = $, e.value = g, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      const l = S("$watch"), o = w.map(
        (d) => l(d, () => {
          (!e.value || e.value === g) && (g = C(), e.value = g, e.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), b = () => {
        const d = e.selectionStart ?? 0, L = e.value, a = t(L);
        if (L !== a) {
          e.value = a;
          const u = Math.min(d, a.length);
          e.setSelectionRange(u, u);
        }
      };
      e.addEventListener("blur", b), c(() => {
        o.forEach((d) => d()), e.removeEventListener("blur", b);
      });
    }
  );
}
function q(s) {
  s.directive("slug", ({ el: i, directive: p, component: E, cleanup: S }) => {
    const c = p.modifiers.length > 0 ? p.modifiers[0] : "-", h = p.expression.trim().split(",").map((o) => o.trim()), e = i, t = (o) => o.toString().toLowerCase().trim().replace(/[\s\W-]+/g, c).replace(new RegExp(`^${c}+|${c}+$`, "g"), "").replace(new RegExp(`${c}{2,}`, "g"), c);
    let w = "";
    const g = () => t(
      h.map((o) => E.$wire.get(o)).filter(Boolean).join(" ")
    ), C = g();
    !e.value && C && (w = C, e.value = w, e.dispatchEvent(new Event("input", { bubbles: !0 })));
    const $ = h.map(
      (o) => E.$wire.$watch(o, () => {
        (!e.value || e.value === w) && (w = g(), e.value = w, e.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), l = () => {
      const o = e.selectionStart ?? 0, b = e.value, d = t(b);
      if (b !== d) {
        e.value = d;
        const L = Math.min(o, d.length);
        e.setSelectionRange(L, L);
      }
    };
    e.addEventListener("blur", l), S(() => {
      $.forEach((o) => o()), e.removeEventListener("blur", l);
    });
  });
}
function X(s) {
  s.directive(
    "case",
    (i, { expression: p, modifiers: E }, { evaluate: S, cleanup: c }) => {
      const h = E[0] ?? "camel", e = E[1] === "underscore" ? "_" : "-", t = i, w = (n) => n.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), g = (n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(), C = (n) => {
        const m = e;
        return n.toString().toLowerCase().trim().replace(/[\s\W-]+/g, m).replace(new RegExp(`^${m}+|${m}+$`, "g"), "").replace(new RegExp(`${m}{2,}`, "g"), m);
      }, $ = (n) => {
        const m = w(n.toString().trim());
        switch (h) {
          case "slug":
            return C(n);
          case "camel":
            return m.map((y, P) => P === 0 ? y.toLowerCase() : g(y)).join("");
          case "pascal":
            return m.map(g).join("");
          case "snake":
            return m.map((y) => y.toLowerCase()).join("_");
          case "constant":
            return m.map((y) => y.toUpperCase()).join("_");
          case "title":
            return m.map(g).join(" ");
          case "dot":
            return m.map((y) => y.toLowerCase()).join(".");
          case "kebab":
            return m.map((y) => y.toLowerCase()).join("-");
          case "lower":
            return n.toLowerCase().trim();
          case "upper":
            return n.toUpperCase().trim();
          default:
            return n;
        }
      }, l = p.trim().split(",").map((n) => n.trim());
      let o = "";
      const b = () => $(
        l.map((n) => S(n)).filter(Boolean).join(" ")
      ), d = b();
      !t.value && d && (o = d, t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      const L = S("$watch"), a = l.map(
        (n) => L(n, () => {
          (!t.value || t.value === o) && (o = b(), t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
        })
      ), u = () => {
        const n = t.selectionStart ?? 0, m = t.value, y = $(m);
        if (m !== y) {
          t.value = y;
          const P = Math.min(n, y.length);
          t.setSelectionRange(P, P);
        }
      };
      t.addEventListener("blur", u), c(() => {
        a.forEach((n) => n()), t.removeEventListener("blur", u);
      });
    }
  );
}
function H(s) {
  s.directive("case", ({ el: i, directive: p, component: E, cleanup: S }) => {
    const c = p.modifiers[0] ?? "camel", h = p.modifiers[1] === "underscore" ? "_" : "-", e = p.expression.trim().split(",").map((a) => a.trim()), t = i, w = (a) => a.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_./]+/).filter(Boolean), g = (a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(), C = (a) => {
      const u = h;
      return a.toString().toLowerCase().trim().replace(/[\s\W-]+/g, u).replace(new RegExp(`^${u}+|${u}+$`, "g"), "").replace(new RegExp(`${u}{2,}`, "g"), u);
    }, $ = (a) => {
      const u = w(a.toString().trim());
      switch (c) {
        case "slug":
          return C(a);
        case "camel":
          return u.map((n, m) => m === 0 ? n.toLowerCase() : g(n)).join("");
        case "pascal":
          return u.map(g).join("");
        case "snake":
          return u.map((n) => n.toLowerCase()).join("_");
        case "constant":
          return u.map((n) => n.toUpperCase()).join("_");
        case "title":
          return u.map(g).join(" ");
        case "dot":
          return u.map((n) => n.toLowerCase()).join(".");
        case "kebab":
          return u.map((n) => n.toLowerCase()).join("-");
        case "lower":
          return a.toLowerCase().trim();
        case "upper":
          return a.toUpperCase().trim();
        default:
          return a;
      }
    };
    let l = "";
    const o = () => $(
      e.map((a) => E.$wire.get(a)).filter(Boolean).join(" ")
    ), b = o();
    !t.value && b && (l = b, t.value = l, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    const d = e.map(
      (a) => E.$wire.$watch(a, () => {
        (!t.value || t.value === l) && (l = o(), t.value = l, t.dispatchEvent(new Event("input", { bubbles: !0 })));
      })
    ), L = () => {
      const a = t.selectionStart ?? 0, u = t.value, n = $(u);
      if (u !== n) {
        t.value = n;
        const m = Math.min(a, n.length);
        t.setSelectionRange(m, m);
      }
    };
    t.addEventListener("blur", L), S(() => {
      d.forEach((a) => a()), t.removeEventListener("blur", L);
    });
  });
}
function K(s) {
  for (const { name: i, value: p } of Array.from(s.attributes))
    if (/^wire:(click|submit|keydown|keyup|change|input)/.test(i))
      return p.replace(/\(.*$/, "").trim();
  return "";
}
function G(s, i) {
  s.directive("after", ({ el: p, directive: E, component: S, cleanup: c }) => {
    const h = E.modifiers.includes("finish"), e = E.expression.trim(), t = e.indexOf(","), w = t !== -1 ? e.slice(0, t).trim() : K(p), g = t !== -1 ? e.slice(t + 1).trim() : e;
    if (!w || !g) return;
    const C = S.$wire.intercept(w, ({ onSuccess: $, onFinish: l }) => {
      (h ? l : $)(() => i.evaluate(p, g));
    });
    c(C);
  });
}
function J(s, i) {
  W(i), Z(i), D(i), X(i), q(s), H(s), G(s, i);
}
export {
  G as registerAfterLivewire,
  X as registerCaseAlpine,
  H as registerCaseLivewire,
  J as registerDirectives,
  Z as registerEmailMask,
  W as registerPlaceholders,
  D as registerSlugAlpine,
  q as registerSlugLivewire
};
//# sourceMappingURL=index.js.map
