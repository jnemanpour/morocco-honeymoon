/* Unified booking checklist — shared across every page.
   State persists in this browser via localStorage (key below) and stays in
   sync wherever the checklist is shown. Mount it by placing an element with
   class "booking-checklist-mount" on the page and including this script. */
(function () {
  const KEY = 'morocco_checklist_v1';
  const items = [
    { k: 'b1', html: '<strong>1. Chefchaouen (Sep 1–3)</strong> — tiny mountain guesthouses, real sell-out risk. Book first. <a href="accommodations.html#chefchaouen">→</a>' },
    { k: 'b2', html: '<strong>2. Marrakech (Aug 24–27)</strong> — Riad Kheirredine is fully booked; grab the last room at Riad Yasmine, or book Riad Meriem. <a href="accommodations.html#marrakech">→</a>' },
    { k: 'b3', html: '<strong>3. 3-Day Sahara Tour</strong> — covers Days 4–6 + Dades & desert-camp nights. <a href="activities.html#desert">→</a>' },
    { k: 'b4', html: '<strong>4. Fes riad (Aug 29–Sep 1)</strong> — softer demand, but small; book soon. <a href="accommodations.html#fes">→</a>' },
    { k: 'b5', html: '<strong>5. Casablanca airport hotel (Sep 3)</strong> — confirm a 24/7 shuttle for the 4am flight. <a href="accommodations.html#casablanca">→</a>' },
    { k: 'b6', html: '<strong>6. CMN → Marrakech transfer</strong> (Aug 24) — train, flight, or private car. <a href="activities.html">→</a>' },
    { k: 'b7', html: '<strong>7. Experiences</strong> — balloon, hammam, cooking classes, pottery. <a href="activities.html">→</a>' },
    { k: 'b8', html: '<strong>8. Travel insurance</strong> — World Nomads or SafetyWing. <a href="activities.html">→</a>' }
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
