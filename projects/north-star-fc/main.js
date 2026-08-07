/* =============================================================================
   North Star Football Club — main.js
   Classic script (no ES modules) so it works from file://, FTP and any host.
   Every content block is already in the HTML; this file only enriches.
   ============================================================================ */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};

  /* ---------------------------------------------------------------- helpers */
  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------- nav */
  function initNav() {
    var nav = $("[data-nav]");
    var toggle = $("[data-nav-toggle]");
    var panel = $("[data-nav-mobile]");

    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
    });
    // Close when a link is chosen or Escape is pressed.
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* --------------------------------------------------------- anchor scroll */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 88,
        behavior: reduced ? "auto" : "smooth"
      });
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------- reveals */
  function initReveals() {
    var targets = $$(".reveal, .reveal-group");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });

    targets.forEach(function (el) { io.observe(el); });

    // Safety net: nothing stays hidden, whatever happens.
    setTimeout(function () {
      $$(".reveal:not(.is-visible), .reveal-group:not(.is-visible)").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* --------------------------------------------------------------- count-up */
  function initCountUp() {
    var nodes = $$("[data-count-to]");
    if (!nodes.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;
      var group = el.getAttribute("data-count-group") !== "false" && target >= 10000;
      var dur = reduced ? 0 : 1100;
      var start = performance.now();
      var suffix = el.getAttribute("data-count-suffix") || "";

      function frame(now) {
        var p = dur === 0 ? 1 : Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var value = Math.round(target * eased);
        el.textContent = (group ? value.toLocaleString() : String(value)) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) { nodes.forEach(run); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------- field status */
  /* The status of each field is hardcoded in the HTML so it reads without JS.
     Here we only (a) animate the state bar and (b) refresh the "last updated"
     line from lib/manifest.js so the club has a single place to edit it.      */
  function initFields() {
    var stamp = $$("[data-fields-updated]");
    if (stamp.length && data.fieldsUpdated) {
      stamp.forEach(function (el) { el.textContent = data.fieldsUpdated; });
    }

    var cards = $$(".field-card");
    if (!cards.length || reduced) return;

    cards.forEach(function (card, i) {
      var bar = $(".field-bar i", card);
      if (!bar) return;
      bar.style.transform = "scaleX(0)";
      bar.style.transition = "transform .8s " + "cubic-bezier(0.16,1,0.3,1) " + (i * 90) + "ms";
    });

    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (c) { var b = $(".field-bar i", c); if (b) b.style.transform = "scaleX(1)"; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = $(".field-bar i", entry.target);
        if (bar) bar.style.transform = "scaleX(1)";
        io.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    cards.forEach(function (c) { io.observe(c); });

    setTimeout(function () {
      cards.forEach(function (c) { var b = $(".field-bar i", c); if (b) b.style.transform = "scaleX(1)"; });
    }, 6000);
  }

  /* ---------------------------------------------------------------- weather */
  /* Live forecast from Open-Meteo — free, no API key, no account.
     If the request fails (offline, blocked, host down) the fallback numbers
     already printed in the HTML stay on screen. Nothing breaks.              */
  var WMO = {
    0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Freezing fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    56: "Freezing drizzle", 57: "Freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    66: "Freezing rain", 67: "Freezing rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Light showers", 81: "Showers", 82: "Heavy showers",
    85: "Snow showers", 86: "Snow showers",
    95: "Thunderstorms", 96: "Storms with hail", 99: "Severe storms"
  };

  function initWeather() {
    var host = $("[data-weather]");
    if (!host || typeof fetch !== "function") return;
    var w = data.weather;
    if (!w || typeof w.lat !== "number") return;

    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + encodeURIComponent(w.lat) +
      "&longitude=" + encodeURIComponent(w.lon) +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum" +
      "&past_days=2&forecast_days=4" +
      "&timezone=" + encodeURIComponent(w.timezone || "auto");

    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (json) { renderWeather(host, json); })
      .catch(function (err) {
        console.warn("[weather] live forecast unavailable, showing fallback:", err.message);
        var note = $("[data-weather-note]");
        if (note) note.textContent = "Showing the last published forecast — live data is unavailable right now.";
      });
  }

  function renderWeather(host, json) {
    var d = json && json.daily;
    if (!d || !d.time) return;

    // past_days=2 means index 2 is today.
    var todayIdx = d.time.indexOf(new Date().toISOString().slice(0, 10));
    if (todayIdx < 0) todayIdx = 2;

    var cells = $$("[data-weather-day]", host);
    var names = ["Today", "Tomorrow", null, null];

    cells.forEach(function (cell, i) {
      var idx = todayIdx + i;
      if (idx >= d.time.length) return;

      var label = names[i];
      if (!label) {
        var dt = new Date(d.time[idx] + "T00:00:00");
        label = dt.toLocaleDateString(undefined, { weekday: "long" });
      }
      var max = Math.round(d.temperature_2m_max[idx]);
      var min = Math.round(d.temperature_2m_min[idx]);
      var code = d.weather_code[idx];
      var pop = d.precipitation_probability_max ? d.precipitation_probability_max[idx] : null;

      var set = function (sel, text) { var el = $(sel, cell); if (el && text != null) el.textContent = text; };
      set("[data-weather-label]", label);
      set("[data-weather-temp]", max + "° / " + min + "°");
      set("[data-weather-desc]", WMO[code] || "—");
      set("[data-weather-rain]", pop == null ? "" : pop + "% chance of rain");
    });

    // Rain that has already fallen is what closes a field, so total the last
    // two days plus today and turn it into a plain-English ground advisory.
    var recent = 0;
    for (var i = 0; i < d.precipitation_sum.length && i <= todayIdx; i++) {
      recent += d.precipitation_sum[i] || 0;
    }
    recent = Math.round(recent);

    var advisory = $("[data-weather-advisory]");
    if (advisory) {
      var text, tone;
      if (recent >= 40) {
        text = recent + "mm of rain in the last 48 hours. Expect ground inspections and possible closures — check this page before you travel.";
        tone = "status-closed";
      } else if (recent >= 12) {
        text = recent + "mm of rain in the last 48 hours. Surfaces may be soft; goalmouths and training grids are inspected each afternoon.";
        tone = "status-caution";
      } else {
        text = "Only " + recent + "mm of rain in the last 48 hours. Grounds are drying well and all scheduled sessions are expected to run.";
        tone = "status-open";
      }
      advisory.textContent = text;
      advisory.className = "field-note";
      var chip = $("[data-weather-advisory-chip]");
      if (chip) { chip.className = "status " + tone; chip.textContent = recent + "mm / 48h"; }
    }

    var note = $("[data-weather-note]");
    if (note) {
      note.textContent = "Live forecast for " + ((data.weather && data.weather.placeLabel) || "the ground") +
        ", updated " + new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + ". Source: Open-Meteo.";
    }
  }

  /* -------------------------------------------------------- document filter */
  function initDocFilters() {
    var bar = $("[data-doc-filters]");
    var list = $("[data-doc-list]");
    if (!bar || !list) return;

    var docs = $$(".doc", list);
    var empty = $("[data-doc-empty]");
    var count = $("[data-doc-count]");

    function apply(cat) {
      var shown = 0;
      docs.forEach(function (doc) {
        var match = cat === "all" || doc.getAttribute("data-cat") === cat;
        doc.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (count) count.textContent = String(shown);
    }

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      $$(".filter", bar).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      apply(btn.getAttribute("data-filter"));
    });

    apply("all");
  }

  /* -------------------------------------------------------------- copy email */
  function initCopy() {
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-copy");
        var original = btn.textContent;
        var done = function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = original; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(function () {});
        }
      });
    });
  }

  /* ------------------------------------------------------------- split words */
  /* Preserves <br> and inline tags — a naive textContent split would flatten
     the hero headline into one line.                                          */
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    var wrap = function (text) {
      return text.split(/(\s+)/).map(function (w) {
        if (/^\s*$/.test(w)) return w;
        return '<span class="split-word" aria-hidden="true">' + w + "</span>";
      }).join("");
    };
    var html = Array.prototype.map.call(el.childNodes, function (node) {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        var cls = node.className ? ' class="' + node.className + '"' : "";
        return "<" + tag + cls + ">" + wrap(node.textContent) + "</" + tag + ">";
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return $$(".split-word", el);
  }

  function initHero() {
    if (!window.gsap) return;
    var title = $("[data-split]");
    if (title) {
      var words = splitWords(title);
      gsap.set(words, { yPercent: 108, opacity: 0 });
      gsap.to(words, {
        yPercent: 0, opacity: 1,
        duration: reduced ? 0.01 : 0.9,
        stagger: reduced ? 0 : 0.035,
        ease: "expo.out",
        delay: 0.05
      });
    }

    var sub = $("[data-hero-fade]");
    if (sub) gsap.from(sub, { opacity: 0, y: 18, duration: 0.8, delay: 0.35, ease: "power3.out" });

    var board = $(".hero-board");
    if (board) gsap.from(board.children, { opacity: 0, y: 20, duration: 0.7, delay: 0.5, stagger: 0.06, ease: "power3.out" });
  }

  function initParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;
    var star = $(".hero-star");
    if (!star) return;
    gsap.to(star, {
      yPercent: 18, rotation: 12, ease: "none",
      scrollTrigger: { trigger: star.parentElement, start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  /* ------------------------------------------------------------------- boot */
  function boot() {
    safe(initNav, "initNav");
    safe(initAnchors, "initAnchors");
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
    safe(initFields, "initFields");
    safe(initWeather, "initWeather");
    safe(initDocFilters, "initDocFilters");
    safe(initCopy, "initCopy");

    if (window.gsap) {
      if (window.ScrollTrigger) { try { gsap.registerPlugin(ScrollTrigger); } catch (e) {} }
      safe(initHero, "initHero");
      safe(initParallax, "initParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
