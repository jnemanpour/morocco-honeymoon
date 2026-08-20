/* Unified booking checklist — shared across every page.
   State persists in this browser via localStorage (key below) and stays in
   sync wherever the checklist is shown. Mount it by placing an element with
   class "booking-checklist-mount" on the page and including this script. */
(function () {
  const KEY = 'morocco_checklist_v1';
  const items = [
    { k: 'b9', html: '<strong>1. ⚠️ Fix the Casablanca dates</strong> — Barceló Anfa is booked Aug 28–29; we need <strong>Sep 3–4</strong>. Change it or rebook. <a href="accommodations.html#casablanca">→</a>' },
    { k: 'b3', html: '<strong>2. Sahara driving (Aug 27–29)</strong> — both desert hotels are booked, so we only need a private driver (or car) Marrakech → Dades → Merzouga → Fes. <a href="sahara.html#operators">→</a>' },
    { k: 'b10', html: '<strong>3. Sunset camel trek at Merzouga</strong> — not included at Riad Madu; ask the riad to arrange it for Aug 28. <a href="accommodations.html#sahara">→</a>' },
    { k: 'b2', html: '<strong>4. Marrakech (Aug 24–27)</strong> — ✓ Booked: La Mamounia (3 nights, Amex FHR). <a href="accommodations.html#marrakech">→</a>' },
    { k: 'b11', html: '<strong>5. Dades (Aug 27–28)</strong> — ✓ Booked: Eden Boutique Hotel &amp; Spa. <em>Unpaid — ~$496 due at the property.</em> <a href="accommodations.html#sahara">→</a>' },
    { k: 'b12', html: '<strong>6. Merzouga (Aug 28–29)</strong> — ✓ Booked: Riad Madu (Suite). <em>Unpaid — €165 due at the property.</em> <a href="accommodations.html#sahara">→</a>' },
    { k: 'b4', html: '<strong>7. Fes (Aug 29–Sep 1)</strong> — ✓ Booked: Riad Fes — Relais &amp; Châteaux (3 nights). <a href="accommodations.html#fes">→</a>' },
    { k: 'b1', html: '<strong>8. Chefchaouen (Sep 1–3)</strong> — ✓ Booked: Lina Ryad &amp; Spa (Junior Suite, 2 nights). <em>Unpaid — €400 due at the property.</em> <a href="accommodations.html#chefchaouen">→</a>' },
    { k: 'b6', html: '<strong>9. CMN → Marrakech transfer</strong> (Aug 24) — train, flight, or private car. <a href="transport.html">→</a>' },
    { k: 'b7', html: '<strong>10. Experiences</strong> — balloon, hammam, cooking classes, pottery. <a href="activities.html">→</a>' },
    { k: 'b8', html: '<strong>11. Travel insurance</strong> — World Nomads or SafetyWing. <a href="activities.html">→</a>' }
  ];

  const mounts = Array.prototype.slice.call(document.querySelectorAll('.booking-checklist-mount'));
  if (!mounts.length) return;

  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  const instances = [];
  mounts.forEach(function (mount) {
    const prog = document.createElement('div');
    prog.className = 'checklist-progress';
    const ul = document.createElement('ul');
    ul.className = 'checklist';
    items.forEach(function (it) {
      const li = document.createElement('li');
      li.className = 'toggleable';
      li.dataset.key = it.k;
      li.innerHTML = '<div class="checkbox"></div><div class="task-text">' + it.html + '</div>';
      li.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) return; // let links work
        state[it.k] = !state[it.k];
        save();
        renderAll();
      });
      ul.appendChild(li);
    });
    mount.innerHTML = '';
    mount.appendChild(prog);
    mount.appendChild(ul);
    instances.push({ prog: prog, ul: ul });
  });

  function renderAll() {
    const done = items.filter(function (it) { return state[it.k]; }).length;
    instances.forEach(function (inst) {
      inst.ul.querySelectorAll('li.toggleable').forEach(function (li) {
        li.classList.toggle('done', !!state[li.dataset.key]);
      });
      inst.prog.innerHTML = done === items.length
        ? '🎉 <b>All booked!</b> Everything checked off.'
        : '<b>' + done + ' of ' + items.length + '</b> booked — tap to check off (saves automatically, in sync on every page).';
    });
  }

  // Keep in sync if another tab/page changes it
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) {
      try { state = JSON.parse(e.newValue) || {}; } catch (err) { state = {}; }
      renderAll();
    }
  });

  renderAll();
})();
