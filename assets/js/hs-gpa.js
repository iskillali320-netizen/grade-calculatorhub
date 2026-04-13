// assets/js/hs-gpa.js — High School GPA Calculator Logic

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     GPA SCALE DATA
  ═══════════════════════════════════════ */
  const GRADE_SCALES = {
    4: [
      { letter: 'A+', pct: '97–100', regular: 4.0, honors: 4.5, ap: 5.0 },
      { letter: 'A',  pct: '93–96',  regular: 4.0, honors: 4.5, ap: 5.0 },
      { letter: 'A−', pct: '90–92',  regular: 3.7, honors: 4.2, ap: 4.7 },
      { letter: 'B+', pct: '87–89',  regular: 3.3, honors: 3.8, ap: 4.3 },
      { letter: 'B',  pct: '83–86',  regular: 3.0, honors: 3.5, ap: 4.0 },
      { letter: 'B−', pct: '80–82',  regular: 2.7, honors: 3.2, ap: 3.7 },
      { letter: 'C+', pct: '77–79',  regular: 2.3, honors: 2.8, ap: 3.3 },
      { letter: 'C',  pct: '73–76',  regular: 2.0, honors: 2.5, ap: 3.0 },
      { letter: 'C−', pct: '70–72',  regular: 1.7, honors: 2.2, ap: 2.7 },
      { letter: 'D+', pct: '67–69',  regular: 1.3, honors: 1.3, ap: 1.3 },
      { letter: 'D',  pct: '65–66',  regular: 1.0, honors: 1.0, ap: 1.0 },
      { letter: 'F',  pct: 'Below 65', regular: 0.0, honors: 0.0, ap: 0.0 },
    ],
    5: [
      { letter: 'A+', pct: '97–100', regular: 5.0, honors: 5.0, ap: 5.0 },
      { letter: 'A',  pct: '93–96',  regular: 5.0, honors: 5.0, ap: 5.0 },
      { letter: 'A−', pct: '90–92',  regular: 4.7, honors: 4.7, ap: 4.7 },
      { letter: 'B+', pct: '87–89',  regular: 4.3, honors: 4.3, ap: 4.3 },
      { letter: 'B',  pct: '83–86',  regular: 4.0, honors: 4.0, ap: 4.0 },
      { letter: 'B−', pct: '80–82',  regular: 3.7, honors: 3.7, ap: 3.7 },
      { letter: 'C+', pct: '77–79',  regular: 3.3, honors: 3.3, ap: 3.3 },
      { letter: 'C',  pct: '73–76',  regular: 3.0, honors: 3.0, ap: 3.0 },
      { letter: 'C−', pct: '70–72',  regular: 2.7, honors: 2.7, ap: 2.7 },
      { letter: 'D+', pct: '67–69',  regular: 1.3, honors: 1.3, ap: 1.3 },
      { letter: 'D',  pct: '65–66',  regular: 1.0, honors: 1.0, ap: 1.0 },
      { letter: 'F',  pct: 'Below 65', regular: 0.0, honors: 0.0, ap: 0.0 },
    ]
  };

  // For 4.0 scale, the weighted points for grade options
  const GRADE_OPTIONS_4 = [
    { label: 'A+ (97–100)', regular: 4.0, honors: 4.5, ap: 5.0 },
    { label: 'A  (93–96)',  regular: 4.0, honors: 4.5, ap: 5.0 },
    { label: 'A− (90–92)', regular: 3.7, honors: 4.2, ap: 4.7 },
    { label: 'B+ (87–89)', regular: 3.3, honors: 3.8, ap: 4.3 },
    { label: 'B  (83–86)', regular: 3.0, honors: 3.5, ap: 4.0 },
    { label: 'B− (80–82)', regular: 2.7, honors: 3.2, ap: 3.7 },
    { label: 'C+ (77–79)', regular: 2.3, honors: 2.8, ap: 3.3 },
    { label: 'C  (73–76)', regular: 2.0, honors: 2.5, ap: 3.0 },
    { label: 'C− (70–72)', regular: 1.7, honors: 2.2, ap: 2.7 },
    { label: 'D+ (67–69)', regular: 1.3, honors: 1.3, ap: 1.3 },
    { label: 'D  (65–66)', regular: 1.0, honors: 1.0, ap: 1.0 },
    { label: 'F  (< 65)',  regular: 0.0, honors: 0.0, ap: 0.0 },
  ];

  const GRADE_OPTIONS_5 = [
    { label: 'A+ (97–100)', regular: 5.0, honors: 5.0, ap: 5.0 },
    { label: 'A  (93–96)',  regular: 5.0, honors: 5.0, ap: 5.0 },
    { label: 'A− (90–92)', regular: 4.7, honors: 4.7, ap: 4.7 },
    { label: 'B+ (87–89)', regular: 4.3, honors: 4.3, ap: 4.3 },
    { label: 'B  (83–86)', regular: 4.0, honors: 4.0, ap: 4.0 },
    { label: 'B− (80–82)', regular: 3.7, honors: 3.7, ap: 3.7 },
    { label: 'C+ (77–79)', regular: 3.3, honors: 3.3, ap: 3.3 },
    { label: 'C  (73–76)', regular: 3.0, honors: 3.0, ap: 3.0 },
    { label: 'C− (70–72)', regular: 2.7, honors: 2.7, ap: 2.7 },
    { label: 'D+ (67–69)', regular: 1.3, honors: 1.3, ap: 1.3 },
    { label: 'D  (65–66)', regular: 1.0, honors: 1.0, ap: 1.0 },
    { label: 'F  (< 65)',  regular: 0.0, honors: 0.0, ap: 0.0 },
  ];

  /* ═══════════════════════════════════════
     STATE
  ═══════════════════════════════════════ */
  let currentScale = 4; // 4 or 5
  let rowCount = 0;

  /* ═══════════════════════════════════════
     DOM REFERENCES
  ═══════════════════════════════════════ */
  const container    = document.getElementById('hs-rows-container');
  const form         = document.getElementById('hs-gpa-form');
  const resultBox    = document.getElementById('hs-result-box');
  const gpaValue     = document.getElementById('hs-gpa-value');
  const creditsValue = document.getElementById('hs-credits-value');
  const letterValue  = document.getElementById('hs-letter-value');
  const messageEl    = document.getElementById('hs-gpa-message');
  const scaleTbody   = document.getElementById('scale-tbody');
  const scaleTableBody = document.getElementById('scale-table-body');
  const toggleScaleBtn = document.getElementById('toggle-scale-table');

  /* ═══════════════════════════════════════
     GRADE SCALE TABLE
  ═══════════════════════════════════════ */
  function renderScaleTable(scale) {
    scaleTbody.innerHTML = '';
    GRADE_SCALES[scale].forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="grade-pill">${row.letter}</span></td>
        <td>${row.pct}</td>
        <td>${row.regular.toFixed(1)}</td>
        <td>${row.honors.toFixed(1)}</td>
        <td>${row.ap.toFixed(1)}</td>
      `;
      scaleTbody.appendChild(tr);
    });
  }

  if (toggleScaleBtn) {
    toggleScaleBtn.addEventListener('click', () => {
      const isHidden = scaleTableBody.style.display === 'none';
      scaleTableBody.style.display = isHidden ? 'block' : 'none';
      toggleScaleBtn.textContent = isHidden ? 'Hide ▴' : 'Show ▾';
    });
  }

  /* ═══════════════════════════════════════
     SCALE TABS
  ═══════════════════════════════════════ */
  document.querySelectorAll('.scale-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scale-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentScale = parseInt(tab.dataset.scale, 10);
      renderScaleTable(currentScale);
      // Rebuild all grade dropdowns with new scale values
      document.querySelectorAll('.hs-grade-select').forEach(sel => {
        const selectedIdx = sel.selectedIndex;
        rebuildGradeSelect(sel, currentScale);
        if (selectedIdx >= 0) sel.selectedIndex = selectedIdx;
      });
    });
  });

  /* ═══════════════════════════════════════
     BUILD GRADE SELECT
  ═══════════════════════════════════════ */
  function rebuildGradeSelect(select, scale) {
    const opts = scale === 4 ? GRADE_OPTIONS_4 : GRADE_OPTIONS_5;
    select.innerHTML = '<option value="" disabled selected>Grade</option>';
    opts.forEach((g, i) => {
      const opt = document.createElement('option');
      opt.dataset.regular = g.regular;
      opt.dataset.honors  = g.honors;
      opt.dataset.ap      = g.ap;
      opt.value = i;
      opt.textContent = g.label;
      select.appendChild(opt);
    });
  }

  /* ═══════════════════════════════════════
     ADD COURSE ROW
  ═══════════════════════════════════════ */
  function addRow() {
    rowCount++;
    const row = document.createElement('div');
    row.className = 'dynamic-row hs-gpa-row';
    row.dataset.id = rowCount;

    row.innerHTML = `
      <div class="form-group">
        <label>Course</label>
        <input type="text" class="hs-course-name" placeholder="e.g. AP Physics">
      </div>
      <div class="form-group">
        <label>Grade</label>
        <select class="hs-grade-select" required></select>
      </div>
      <div class="form-group">
        <label>Credits</label>
        <input type="number" class="hs-credit-input" placeholder="1.0" value="1" min="0.5" step="0.5" required>
      </div>
      <div class="form-group">
        <label>Type</label>
        <select class="hs-type-select">
          <option value="regular">Regular</option>
          <option value="honors">Honors</option>
          <option value="ap">AP / IB</option>
        </select>
      </div>
      <button type="button" class="btn-icon remove-row-btn" aria-label="Remove course">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    // Populate grade select
    rebuildGradeSelect(row.querySelector('.hs-grade-select'), currentScale);

    // Remove button
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      if (container.children.length > 1) {
        row.remove();
      } else {
        row.querySelector('.hs-grade-select').value = '';
        row.querySelector('.hs-credit-input').value = '1';
      }
    });

    container.appendChild(row);
  }

  /* ═══════════════════════════════════════
     CALCULATE
  ═══════════════════════════════════════ */
  function getGradePoints(select, typeSelect) {
    const opt = select.options[select.selectedIndex];
    if (!opt || !opt.dataset.regular) return NaN;
    const type = typeSelect.value;
    return parseFloat(opt.dataset[type]);
  }

  function getLetterFromGPA(gpa, scale) {
    const max = scale === 5 ? 5 : 4;
    if (gpa >= max * 0.975) return 'A+';
    if (gpa >= max * 0.93)  return 'A';
    if (gpa >= max * 0.90)  return 'A−';
    if (gpa >= max * 0.87)  return 'B+';
    if (gpa >= max * 0.83)  return 'B';
    if (gpa >= max * 0.80)  return 'B−';
    if (gpa >= max * 0.77)  return 'C+';
    if (gpa >= max * 0.73)  return 'C';
    if (gpa >= max * 0.70)  return 'C−';
    if (gpa >= max * 0.67)  return 'D+';
    if (gpa >= max * 0.65)  return 'D';
    return 'F';
  }

  function getStandingMessage(gpa, scale) {
    const norm = scale === 5 ? gpa / 5 * 4 : gpa;
    if (norm >= 3.7) return '🏆 Excellent — Summa Cum Laude level';
    if (norm >= 3.5) return '🎉 Great — Magna Cum Laude level';
    if (norm >= 3.0) return '✅ Good Standing — Cum Laude level';
    if (norm >= 2.0) return '📚 Satisfactory — Keep it up!';
    return '⚠️ Below 2.0 — At risk of academic probation';
  }

  function calculate(e) {
    if (e) e.preventDefault();

    const rows = container.querySelectorAll('.hs-gpa-row');
    let totalQP = 0, totalCredits = 0;

    rows.forEach(row => {
      const gradeSelect = row.querySelector('.hs-grade-select');
      const typeSelect  = row.querySelector('.hs-type-select');
      const creditInput = row.querySelector('.hs-credit-input');

      const gp  = getGradePoints(gradeSelect, typeSelect);
      const cr  = parseFloat(creditInput.value);

      if (!isNaN(gp) && !isNaN(cr) && cr > 0) {
        totalQP      += gp * cr;
        totalCredits += cr;
      }
    });

    if (totalCredits === 0) {
      messageEl.textContent = 'Please enter at least one valid course with grade and credits.';
      resultBox.classList.add('active');
      gpaValue.textContent     = '—';
      creditsValue.textContent = '0';
      letterValue.textContent  = '—';
      return;
    }

    const gpa = totalQP / totalCredits;
    const letter = getLetterFromGPA(gpa, currentScale);

    gpaValue.textContent     = gpa.toFixed(2);
    creditsValue.textContent = totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1);
    letterValue.textContent  = letter;
    messageEl.textContent    = getStandingMessage(gpa, currentScale);

    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Animate value
    gpaValue.classList.remove('value-pop');
    void gpaValue.offsetWidth;
    gpaValue.classList.add('value-pop');
  }

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    // Render scale table
    renderScaleTable(currentScale);

    // Seed 3 rows
    addRow(); addRow(); addRow();

    // Attach events
    document.getElementById('add-hs-row').addEventListener('click', addRow);
    form.addEventListener('submit', calculate);
  });

})();
