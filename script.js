/* Fade & Blade — demo behaviour: mobile nav, booking draft (local only). */
(function () {
  "use strict";

  /* footer year */
  document.getElementById("year").textContent = String(new Date().getFullYear());

  /* mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* booking form — drafts stored locally; nothing is sent anywhere */
  var form = document.getElementById("book-form");
  var note = document.getElementById("form-note");
  var drafts = document.getElementById("draft-bookings");
  var KEY = "fadeblade-demo-bookings";

  function renderDrafts() {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) {
      saved = [];
    }
    if (!saved.length) { drafts.innerHTML = ""; return; }
    var items = saved.map(function (b) {
      var li = document.createElement("li");
      li.textContent = b.date + " · " + b.service + " — " + b.name;
      return li;
    });
    var box = document.createElement("p");
    box.textContent = "Appointment requests drafted in this browser (" +
      saved.length + "):";
    var ul = document.createElement("ul");
    items.forEach(function (li) { ul.appendChild(li); });
    drafts.innerHTML = "";
    drafts.appendChild(box);
    drafts.appendChild(ul);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var name = (f.get("name") || "").trim();
      var phone = (f.get("phone") || "").trim();
      var date = (f.get("date") || "").trim();
      var service = (f.get("service") || "").trim();
      if (!name || !phone || !date) {
        note.textContent = "Please fill name, phone and date.";
        return;
      }
      var saved = [];
      try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) {
        saved = [];
      }
      saved.push({ name: name, service: service, date: date });
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) { /* private mode */ }
      note.textContent = "Request drafted: " + name + " · " + service +
        " · " + date + ". (Demo — nothing was sent.)";
      form.reset();
      renderDrafts();
    });
    renderDrafts();
  }
})();
