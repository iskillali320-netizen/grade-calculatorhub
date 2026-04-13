// assets/js/calculators.js

// Shared helper to show result
function showResult(resultBoxId, valueId, value, messageId = null, message = null) {
    const box = document.getElementById(resultBoxId);
    const valObj = document.getElementById(valueId);
    
    if (box && valObj) {
        valObj.textContent = value;
        if (messageId && message) {
            const msgObj = document.getElementById(messageId);
            if (msgObj) msgObj.textContent = message;
        }
        box.classList.add('active');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 1. Easy Grade Calculator (Percentage based on Questions)
function calculateEasyGrade(e) {
    e.preventDefault();
    const total = parseFloat(document.getElementById('total-questions').value);
    const correct = parseFloat(document.getElementById('correct-answers').value);

    if (isNaN(total) || isNaN(correct) || total === 0) return;

    let percentage = (correct / total) * 100;
    
    let letter = 'F';
    if(percentage >= 90) letter = 'A';
    else if(percentage >= 80) letter = 'B';
    else if(percentage >= 70) letter = 'C';
    else if(percentage >= 60) letter = 'D';

    showResult('easy-result-box', 'easy-percentage', `${percentage.toFixed(2)}%`, 'easy-letter', `Letter Grade: ${letter}`);
}

// 2. Average Grade Calculator
function calculateAverageGrade(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('.avg-grade-input');
    let sum = 0;
    let count = 0;

    inputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            sum += val;
            count++;
        }
    });

    if (count > 0) {
        let avg = sum / count;
        showResult('avg-result-box', 'avg-value', `${avg.toFixed(2)}%`);
    }
}

function addAverageRow() {
    const container = document.getElementById('avg-rows-container');
    const rowCount = container.children.length + 1;
    
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <label>Assignment ${rowCount}</label>
        <input type="number" class="avg-grade-input" placeholder="Grade (e.g. 85)" required min="0" step="any">
        <span>%</span>
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()" aria-label="Remove row">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    container.appendChild(row);
}

// 3. Final Grade Calculator
function calculateFinalGrade(e) {
    e.preventDefault();
    const current = parseFloat(document.getElementById('current-grade').value);
    const required = parseFloat(document.getElementById('required-grade').value);
    const weight = parseFloat(document.getElementById('final-weight').value);

    if (isNaN(current) || isNaN(required) || isNaN(weight) || weight === 0) return;

    // Formula: Final Exam Grade = (Target - Current * (1 - Weight/100)) / (Weight/100)
    let finalExam = (required - current * (1 - weight/100)) / (weight/100);
    
    // Cap display for readability but allow over 100% logic to show if it's impossible practically
    let message = "";
    if (finalExam > 100) {
        message = "You will need extra credit to achieve this grade.";
    } else if (finalExam < 0) {
        finalExam = 0;
        message = "You can score a 0% and still achieve your target grade!";
    } else {
        message = "Good luck studying!";
    }

    showResult('final-result-box', 'final-value', `${finalExam.toFixed(2)}%`, 'final-message', message);
}

// 4. GPA Calculator
function calculateGPA(e) {
    e.preventDefault();
    const rows = document.querySelectorAll('.gpa-row');
    let totalQualityPoints = 0;
    let totalCredits = 0;

    rows.forEach(row => {
        const gradeVal = parseFloat(row.querySelector('.gpa-grade-select').value);
        const creditsVal = parseFloat(row.querySelector('.gpa-credit-input').value);

        if (!isNaN(gradeVal) && !isNaN(creditsVal)) {
            totalQualityPoints += (gradeVal * creditsVal);
            totalCredits += creditsVal;
        }
    });

    if (totalCredits > 0) {
        let gpa = totalQualityPoints / totalCredits;
        showResult('gpa-result-box', 'gpa-value', `${gpa.toFixed(2)}`);
    }
}

function addGPARow() {
    const container = document.getElementById('gpa-rows-container');
    const rowCount = container.children.length + 1;
    
    const row = document.createElement('div');
    row.className = 'dynamic-row gpa-row';
    row.innerHTML = `
        <input type="text" placeholder="Course Name (Optional)" class="gpa-course-name">
        <select class="gpa-grade-select" required>
            <option value="" disabled selected>Grade</option>
            <option value="4.0">A+ (97-100)</option>
            <option value="4.0">A (93-96)</option>
            <option value="3.7">A- (90-92)</option>
            <option value="3.3">B+ (87-89)</option>
            <option value="3.0">B (83-86)</option>
            <option value="2.7">B- (80-82)</option>
            <option value="2.3">C+ (77-79)</option>
            <option value="2.0">C (73-76)</option>
            <option value="1.7">C- (70-72)</option>
            <option value="1.3">D+ (67-69)</option>
            <option value="1.0">D (65-66)</option>
            <option value="0.0">F (Below 65)</option>
        </select>
        <input type="number" class="gpa-credit-input" placeholder="Credits" required min="1" step="0.5">
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()" aria-label="Remove row">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    container.appendChild(row);
}

// 5. Percentage Calculator
function calculatePercentage(e) {
    e.preventDefault();
    const part = parseFloat(document.getElementById('pct-part').value);
    const whole = parseFloat(document.getElementById('pct-whole').value);

    if (isNaN(part) || isNaN(whole) || whole === 0) return;

    let pct = (part / whole) * 100;
    showResult('pct-result-box', 'pct-value', `${pct.toFixed(2)}%`);
}

// Attach Event Listeners on Load
document.addEventListener('DOMContentLoaded', () => {
    const easyForm = document.getElementById('easy-form');
    if (easyForm) easyForm.addEventListener('submit', calculateEasyGrade);

    const avgForm = document.getElementById('avg-form');
    if (avgForm) avgForm.addEventListener('submit', calculateAverageGrade);

    const finalForm = document.getElementById('final-form');
    if (finalForm) finalForm.addEventListener('submit', calculateFinalGrade);

    const gpaForm = document.getElementById('gpa-form');
    if (gpaForm) gpaForm.addEventListener('submit', calculateGPA);

    const pctForm = document.getElementById('pct-form');
    if (pctForm) pctForm.addEventListener('submit', calculatePercentage);
});
