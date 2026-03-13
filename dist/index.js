const U = (t) => {
  var c, m;
  const s = (c = t.tagName) == null ? void 0 : c.toUpperCase();
  return s === "INPUT" || s === "TEXTAREA" || t.isContentEditable ? t : t.querySelector("input, textarea, [contenteditable]") || ((m = t.parentElement) == null ? void 0 : m.querySelector("input, textarea, [contenteditable]")) || t;
}, F = (t) => t.split(",").map((s) => s.trim()).filter(Boolean);
function q(t) {
  t.directive("placeholders", (s, { expression: c }, { effect: m }) => {
    const u = F(c);
    let a = null, f = !1, n = "";
    const l = () => U(s), y = (e) => {
      var o;
      const i = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      );
      return ((o = i == null ? void 0 : i.get) == null ? void 0 : o.call(e)) ?? "";
    }, v = (e, i) => {
      var d;
      const o = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      );
      (d = o == null ? void 0 : o.set) == null || d.call(e, i);
    }, E = () => {
      var o;
      const e = l();
      return ((o = e.tagName) == null ? void 0 : o.toUpperCase()) === "TEXTAREA" ? y(e) : e.isContentEditable ? e.innerText : e.value;
    }, w = (e) => {
      var d;
      const i = l();
      ((d = i.tagName) == null ? void 0 : d.toUpperCase()) === "TEXTAREA" ? v(i, e) : i.isContentEditable ? i.innerText = e : i.value = e;
    }, r = () => l().selectionStart ?? 0, p = (e) => {
      var o;
      const i = l();
      (o = i.setSelectionRange) == null || o.call(i, e, e);
    }, g = () => n ? u.filter((e) => e.toLowerCase().includes(n.toLowerCase())) : u, h = () => {
      a && (a.style.display = "block");
    }, b = () => {
      a && (a.style.display = "none");
    }, C = () => {
      if (!a) return;
      a.innerHTML = "";
      const e = g();
      if (!e.length) {
        b();
        return;
      }
      e.forEach((i) => {
        const o = document.createElement("div");
        o.textContent = `{${i}}`, o.className = "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700", o.addEventListener("mousedown", (d) => {
          d.preventDefault(), R(i);
        }), a.appendChild(o);
      }), h();
    }, L = () => {
      f = !1, n = "", b();
    }, N = () => {
      f = !0, C();
    }, x = () => {
      const e = E(), i = r(), o = e.slice(0, i), d = o.lastIndexOf("{"), V = o.lastIndexOf("}");
      if (d === -1 || V > d) {
        L();
        return;
      }
      n = o.slice(d + 1), N();
    }, R = (e) => {
      const i = l(), o = i.selectionStart ?? 0, d = E(), I = d.slice(0, o).lastIndexOf("{");
      if (I === -1) return;
      const k = d.slice(0, I), O = d.slice(o), z = `${k}{${e}}${O}`;
      w(z), p(k.length + e.length + 2), i.dispatchEvent(new Event("input", { bubbles: !0 })), L();
    }, T = (e) => {
      f && e.key === "Escape" && (e.preventDefault(), L());
    }, $ = () => x(), P = () => x(), M = () => L(), A = () => {
      a = document.createElement("div"), a.className = "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40", a.style.display = "none";
      const e = l();
      e.parentElement.style.position = "relative", e.parentElement.appendChild(a);
    }, B = () => {
      const e = l();
      e.removeEventListener("input", $), e.removeEventListener("click", P), e.removeEventListener("keydown", T), e.removeEventListener("blur", M), a == null || a.remove();
    };
    A();
    const S = l();
    S.addEventListener("input", $), S.addEventListener("click", P), S.addEventListener("keydown", T), S.addEventListener("blur", M), m(() => B);
  });
}
const D = (t) => {
  var c, m;
  const s = (c = t.tagName) == null ? void 0 : c.toUpperCase();
  return s === "INPUT" || s === "TEXTAREA" || t.isContentEditable ? t : t.querySelector("input, textarea, [contenteditable]") || ((m = t.parentElement) == null ? void 0 : m.querySelector("input, textarea, [contenteditable]")) || t;
}, X = (t) => t.split(",").map((s) => s.trim()).filter(Boolean);
function H(t) {
  t.directive("email-mask", (s, { expression: c }, { effect: m }) => {
    const u = new Set(X(c)), a = /^\s*\{([\w]+)\}\s*$/, f = /^\s*\{([\w]+)\}\s*<\s*\{([\w]+)\}\s*>\s*$/, n = D(s), l = (r) => u.has(r), y = (r) => {
      const p = r.match(a);
      if (p) {
        const C = p[1];
        return l(C) ? `{${C}}` : null;
      }
      const g = r.match(f);
      if (!g) return null;
      const h = g[1], b = g[2];
      return !l(h) || !l(b) ? null : `{${h}}<{${b}}>`;
    }, v = () => {
      const r = n.value.trim();
      if (r === "") {
        n.setCustomValidity("");
        return;
      }
      if (y(r) !== null) {
        n.setCustomValidity("");
        return;
      }
      n.setCustomValidity("Use {field} or {name}<{email}> format.");
    }, E = () => {
      const r = n.value.trim();
      if (r === "") {
        n.setCustomValidity("");
        return;
      }
      const p = y(r);
      if (p === null) {
        v();
        return;
      }
      p !== n.value && (n.value = p, n.dispatchEvent(new Event("input", { bubbles: !0 }))), n.setCustomValidity("");
    }, w = () => v();
    n.addEventListener("input", w), n.addEventListener("blur", E), m(() => () => {
      n.removeEventListener("input", w), n.removeEventListener("blur", E);
    });
  });
}
function j(t) {
  t.directive("slug", ({ el: s, directive: c, cleanup: m }) => {
    const u = c.modifiers.length > 0 ? c.modifiers[0] : "-", a = c.expression.replace(/['"]/g, "").trim(), f = () => document.querySelector(`[wire\\:model="${a}"]`), n = (r) => r.toString().toLowerCase().trim().replace(/[\s\W-]+/g, u).replace(new RegExp(`^${u}+|${u}+$`, "g"), "").replace(new RegExp(`${u}{2,}`, "g"), u), l = () => {
      const r = f();
      if (!r) return;
      const p = r.value, g = s, h = g.value, b = n(p);
      (!h || h === n(r.dataset.lastSourceValue || "")) && (g.value = b, g.dispatchEvent(new Event("input", { bubbles: !0 }))), r.dataset.lastSourceValue = p;
    }, y = () => setTimeout(l, 0), v = f();
    v && (v.addEventListener("input", y), !s.value && v.value && l());
    const E = () => {
      const r = s, p = r.selectionStart ?? 0, g = r.value, h = n(g);
      if (g !== h) {
        r.value = h;
        const b = Math.min(p, h.length);
        r.setSelectionRange(b, b);
      }
    }, w = s;
    w.addEventListener("blur", E), m(() => {
      v && v.removeEventListener("input", y), w.removeEventListener("blur", E);
    });
  });
}
function W(t) {
  t.directive("slug", (s, { expression: c }, { effect: m }) => {
    const u = c && c.trim() ? c.trim() : "-", a = (l) => l.toString().toLowerCase().trim().replace(/[\s\W-]+/g, u).replace(new RegExp(`^${u}+|${u}+$`, "g"), "").replace(new RegExp(`${u}{2,}`, "g"), u), f = () => {
      const l = s, y = l.selectionStart ?? 0, v = l.value, E = a(v);
      if (v !== E) {
        l.value = E;
        const w = Math.min(y, E.length);
        l.setSelectionRange(w, w);
      }
    }, n = s;
    n.addEventListener("input", f), m(() => () => {
      n.removeEventListener("input", f);
    });
  });
}
function K(t, s) {
  q(s), H(s), W(s), j(t);
}
export {
  K as registerDirectives,
  H as registerEmailMask,
  q as registerPlaceholders,
  W as registerSlugAlpine,
  j as registerSlugLivewire
};
//# sourceMappingURL=index.js.map
