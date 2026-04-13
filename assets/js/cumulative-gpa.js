// assets/js/cumulative-gpa.js — Cumulative GPA Calculator Logic

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     GPA SCALE DATA
  ═══════════════════════════════════════ */
  const GRADE_OPTIONS_4 = [
    { label: 'A+ (97–100)', pts: 4.0 },
    { label: 'A  (93–96)',  pts: 4.0 },
    { label: 'A− (90–92)', pts: 3.7 },
    { label: 'B+ (87–89)', pts: 3.3 },
    { label: 'B  (83–86)', pts: 3.0 },
    { label: 'B− (80–82)', pts: 2.7 },
    { label: 'C+ (77–79)', pts: 2.3 },
    { label: 'C  (73–76)', pts: 2.0 },
    { label: 'C− (70–72)', pts: 1.7 },
    { label: 'D+ (67–69)', pts: 1.3 },
    { label: 'D  (65–66)', pts: 1.0 },
    { label: 'F  (< 65)',  pts: 0.0 },
  ];

  const GRADE_OPTIONS_5 = [
    { label: 'A+ (97–100)', pts: 5.0 },
    { label: 'A  (93–96)',  pts: 5.0 },
    { label: 'A− (90–92)', pts: 4.7 },
    { label: 'B+ (87–89)', pts: 4.3 },
    { label: 'B  (83–86)', pts: 4.0 },
    { label: 'B− (80–82)', pts: 3.7 },
    { label: 'C+ (77–79)', pts: 3.3 },
    { label: 'C  (73–76)', pts: 3.0 },
    { label: 'C− (70–72)', pts: 2.7 },
    { label: 'D+ (67–69)', pts: 1.3 },
    { label: 'D  (65–66)', pts: 1.0 },
    { label: 'F  (< 65)',  pts: 0.0 },
  ];

  const CUM_SCALE_TABLE = {
    4: [
      { letter: 'A+', pct: '97–100', pts4: 4.0, pts5: 5.0 },
      { letter: 'A',  pct: '93–96',  pts4: 4.0, pts5: 5.0 },
      { letter: 'A−', pct: '90–92', pts4: 3.7, pts5: 4.7 },
      { letter: 'B+', pct: '87–89', pts4: 3.3, pts5: 4.3 },
      { letter: 'B',  pct: '83–86',  pts4: 3.0, pts5: 4.0 },
      { letter: 'B−', pct: '80–82', pts4: 2.7, pts5: 3.7 },
      { letter: 'C+', pct: '77–79', pts4: 2.3, pts5: 3.3 },
      { letter: 'C',  pct: '73–76',  pts4: 2.0, pts5: 3.0 },
      { letter: 'C−', pct: '70–72', pts4: 1.7, pts5: 2.7 },
      { letter: 'D+', pct: '67–69', pts4: 1.3, pts5: 1.3 },
      { letter: 'D',  pct: '65–66',  pts4: 1.0, pts5: 1.0 },
      { letter: 'F',  pct: 'Below 65', pts4: 0.0, pts5: 0.0 },
    ]
  };

  /* ═══════════════════════════════════════
     STATE
  ═══════════════════════════════════════ */
  let currentScale = 4;
  let semesterCount = 0;

  /* ═══════════════════════════════════════
     DOM REFERENCES
  ═══════════════════════════════════════ */
  const semestersContainer = document.getElementById('semesters-container');
  const resultBox          = document.getElementById('cum-result-box');
  const gpaValueEl         = document.getElementById('cum-gpa-value');
  const creditsValueEl     = document.getElementById('cum-credits-value');
  const standingValueEl    = document.getElementById('cum-standing-value');
  const messageEl          = document.getElementById('cum-gpa-message');
  const breakdownEl        = document.getElementById('semester-breakdown');
  const cumScaleTbody      = document.getElementById('cum-scale-tbody');
  const cumScaleTableBody  = document.getElementById('cum-scale-table-body');
  const cumToggleBtn       = document.getElementById('cum-toggle-scale-table');

  /* ═══════════════════════════════════════
     SCALE TABLE
  ═══════════════════════════════════════ */
  function renderCumScaleTable() {
    cumScaleTbody.innerHTML = '';
    CUM_SCALE_TABLE[4].forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="grade-pill">${row.letter}</span></td>
        <td>${row.pct}</td>
        <td>${row.pts4.toFixed(1)}</td>
        <td>${row.pts5.toFixed(1)}</td>
      `;
      cumScaleTbody.appendChild(tr);
    });
  }

  if (cumToggleBtn) {
    cumToggleBtn.addEventListener('click', () => {
      const isHidden = cumScaleTableBody.style.display === 'none';
      cumScaleTableBody.style.display = isHidden ? 'block' : 'none';
      cumToggleBtn.textContent = isHidden ? 'Hide ▴' : 'Show ▾';
    });
  }

  /* ═══════════════════════════════════════
     SCALE TABS
  ═══════════════════════════════════════ */
  document.querySelectorAll('#cum-scale-panel ~ .scale-toggle-bar .scale-tab, .scale-toggle-bar .scale-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scale-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentScale = parseInt(tab.dataset.scale, 10);
      // Rebuild all selects
      document.querySelectorAll('.cum-grade-select').forEach(sel => {
        const idx = sel.selectedIndex;
        buildGradeSelect(sel, currentScale);
        if (idx > 0) sel.selectedIndex = idx;
      });
    });
  });

  /* ═══════════════════════════════════════
     GRADE SELECT BUILDER
  ═══════════════════════════════════════ */
  function buildGradeSelect(select, scale) {
    const opts = scale === 4 ? GRADE_OPTIONS_4 : GRADE_OPTIONS_5;
    select.innerHTML = '<option value="" disabled selected>Grade</option>';
    opts.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.pts;
      opt.textContent = g.label;
      select.appendChild(opt);
    });
  }

  /* ═══════════════════════════════════════
     SEMESTER BUILDER
  ═══════════════════════════════════════ */
  function addSemester(name) {
    semesterCount++;
    const semName = name || `Semester ${semesterCount}`;
    const semId   = `sem-${semesterCount}`;

    const semBlock = document.createElement('div');
    semBlock.className = 'semester-block';
    semBlock.dataset.semId = semId;

    semBlock.innerHTML = `
      <div class="semester-block-header">
        <div class="semester-title-row">
          <span class="semester-number">Term ${semesterCount}</span>
          <input type="text" class="semester-name-input" value="${semName}" aria-label="Semester name">
        </div>
        <div class="semester-actions">
          <button type="button" class="btn-secondary btn-sm add-course-btn">+ Add Course</button>
          <button type="button" class="btn-icon remove-semester-btn" aria-label="Remove semester">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="gpa-col-headers" style="margin-top:1rem;">
        <span>Course Name</span>
        <span>Grade</span>
        <span>Credits</span>
        <span></span>
      </div>

      <div class="semester-rows dynamic-rows-container">
        <!-- rows added dynamically -->
      </div>

      <div class="semester-gpa-preview">
        Semester GPA: <strong class="sem-gpa-display">—</strong>
        &nbsp;&nbsp;Credits: <strong class="sem-credits-display">—</strong>
      </div>
    `;

    // Remove semester
    semBlock.querySelector('.remove-semester-btn').addEventListener('click', () => {
      if (semestersContainer.children.length > 1) {
        semBlock.remove();
      }
    });

    // Add course inside semester
    semBlock.querySelector('.add-course-btn').addEventListener('click', () => {
      addCourseRow(semBlock.querySelector('.semester-rows'), currentScale);
    });

    semestersContainer.appendChild(semBlock);

    // Seed 3 course rows by default
    const rowsContainer = semBlock.querySelector('.semester-rows');
    addCourseRow(rowsContainer, currentScale);
    addCourseRow(rowsContainer, currentScale);
    addCourseRow(rowsContainer, currentScale);
  }

  function addCourseRow(rowsContainer, scale) {
    const row = document.createElement('div');
    row.className = 'dynamic-row cum-course-row';

    row.innerHTML = `
      <div class="form-group">
        <label>Course</label>
        <input type="text" class="cum-course-name" placeholder="Course name (optional)">
      </div>
      <div class="form-group">
        <label>Grade</label>
        <select class="cum-grade-select" required></select>
      </div>
      <div class="form-group">
        <label>Credits</label>
        <input type="number" class="cum-credit-input" placeholder="3" value="3" min="0.5" step="0.5" required>
      </div>
      <button type="button" class="btn-icon remove-row-btn" aria-label="Remove course">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    buildGradeSelect(row.querySelector('.cum-grade-select'), scale);

    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      if (rowsContainer.children.length > 1) {
        row.remove();
      }
    });

    rowsContainer.appendChild(row);
  }

  /* ═══════════════════════════════════════
     CALCULATE CUMULATIVE GPA
  ═══════════════════════════════════════ */
  function getAcademicStanding(gpa, scale) {
    const norm = scale === 5 ? (gpa / 5) * 4 : gpa;
    if (norm >= 3.7) return { label: 'Summa',  msg: '🏆 Outstanding — Summa Cum Laude level' };
    if (norm >= 3.5) return { label: 'Magna',  msg: '🎉 Excellent — Magna Cum Laude level' };
    if (norm >= 3.0) return { label: 'Cum Laude', msg: '✅ Good Standing — Cum Laude level' };
    if (norm >= 2.0) return { label: 'Good',   msg: '📚 Satisfactory Standing — keep pushing!' };
    return { label: 'Warning', msg: '⚠️ Below minimum — academic probation risk' };
  }

  function calculateCumulativeGPA() {
    let totalQP      = 0;
    let totalCredits = 0;
    const semesterResults = [];

    // Include prior GPA if provided
    const priorGPA     = parseFloat(document.getElementById('prior-gpa').value);
    const priorCredits = parseFloat(document.getElementById('prior-credits').value);
    if (!isNaN(priorGPA) && !isNaN(priorCredits) && priorCredits > 0) {
      totalQP      += priorGPA * priorCredits;
      totalCredits += priorCredits;
    }

    // Process each semester
    const semBlocks = semestersContainer.querySelectorAll('.semester-block');
    semBlocks.forEach(semBlock => {
      let semQP = 0, semCredits = 0;
      const name = semBlock.querySelector('.semester-name-input').value || 'Semester';
      const rows = semBlock.querySelectorAll('.cum-course-row');

      rows.forEach(row => {
        const gp = parseFloat(row.querySelector('.cum-grade-select').value);
        const cr = parseFloat(row.querySelector('.cum-credit-input').value);
        if (!isNaN(gp) && !isNaN(cr) && cr > 0) {
          semQP      += gp * cr;
          semCredits += cr;
        }
      });

      if (semCredits > 0) {
        const semGPA = semQP / semCredits;
        semesterResults.push({ name, gpa: semGPA, credits: semCredits });
        totalQP      += semQP;
        totalCredits += semCredits;

        // Update semester preview
        semBlock.querySelector('.sem-gpa-display').textContent    = semGPA.toFixed(2);
        semBlock.querySelector('.sem-credits-display').textContent = semCredits % 1 === 0 ? semCredits : semCredits.toFixed(1);
      }
    });

    if (totalCredits === 0) {
      gpaValueEl.textContent      = '—';
      creditsValueEl.textContent  = '0';
      standingValueEl.textContent = '—';
      messageEl.textContent       = 'Please fill in at least one course with grade and credits.';
      resultBox.classList.add('active');
      return;
    }

    const cumGPA = totalQP / totalCredits;
    const standing = getAcademicStanding(cumGPA, currentScale);

    gpaValueEl.textContent      = cumGPA.toFixed(2);
    creditsValueEl.textContent  = totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1);
    standingValueEl.textContent = standing.label;
    messageEl.textContent       = standing.msg;

    // Semester breakdown
    breakdownEl.innerHTML = '';
    if (semesterResults.length > 0) {
      const heading = document.createElement('div');
      heading.className = 'breakdown-heading';
      heading.textContent = 'Per-Semester Breakdown';
      breakdownEl.appendChild(heading);

      semesterResults.forEach(s => {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
          <span class="breakdown-name">${s.name}</span>
          <span class="breakdown-gpa">${s.gpa.toFixed(2)}</span>
          <span class="breakdown-credits">${s.credits % 1 === 0 ? s.credits : s.credits.toFixed(1)} cr</span>
        `;
        breakdownEl.appendChild(item);
      });
    }

    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Pop animation
    gpaValueEl.classList.remove('value-pop');
    void gpaValueEl.offsetWidth;
    gpaValueEl.classList.add('value-pop');
  }

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    renderCumScaleTable();
    addSemester('Fall Semester');
    addSemester('Spring Semester');

    document.getElementById('add-semester-btn').addEventListener('click', () => addSemester());
    document.getElementById('calc-cum-gpa-btn').addEventListener('click', calculateCumulativeGPA);
  });

})();
