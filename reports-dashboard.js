/* ======================================================
   REPORTS DASHBOARD – Integrated with existing state
   Depends on:
   - state.checklists
   - state.technicians
   - Chart.js
====================================================== */

let reportBarChart = null;
let reportPieChart = null;
let reportLineChart = null;

/* selector helper */
function $$(id) {
  return document.getElementById(id);
}

/* ================= Populate Filters ================= */
function populateReportFilters() {
  const techSelect = $$('reportTechnicianFilter');
  const brandSelect = $$('reportBrandFilter');

  if (!techSelect || !brandSelect) return;

  // Technicians
  techSelect.innerHTML =
    '<option value="">كل الفنيين</option>' +
    (state.technicians || [])
      .map(t => `<option value="${t.id}">${t.name || t.id}</option>`)
      .join('');

  // Brands
  const brands = [...new Set((state.checklists || []).map(r => r.brand).filter(Boolean))];
  brandSelect.innerHTML =
    '<option value="">كل البراندات</option>' +
    brands.map(b => `<option value="${b}">${b}</option>`).join('');
}

/* ================= Filtering ================= */
function getFilteredReportChecklists() {
  const tech = $$('reportTechnicianFilter')?.value || '';
  const brand = $$('reportBrandFilter')?.value || '';
  const from = $$('reportFromDate')?.value || '';
  const to = $$('reportToDate')?.value || '';

  return (state.checklists || []).filter(r => {
    if (tech && r.technicianDocId !== tech) return false;
    if (brand && r.brand !== brand) return false;

    const d = r.visitDate || r.technicianVisitDate;
    if (from && d < from) return false;
    if (to && d > to) return false;

    return true;
  });
}

/* ================= Render Charts ================= */
function renderReportsCharts() {
  const barCanvas = $$('assessmentChart');
  const pieCanvas = $$('assessmentPie');
  const lineCanvas = $$('performanceLine');

  if (!barCanvas || !pieCanvas || !lineCanvas) return;

  /* ---------- BAR + PIE ---------- */
  const sections = {
    'Hardware & Peripherals Assessment': { c: 0, p: 0 },
    'Network Infrastructure Assessment': { c: 0, p: 0 },
    'Software & Systems Assessment': { c: 0, p: 0 },
    'Systems Assessment': { c: 0, p: 0 }
  };

  getFilteredReportChecklists().forEach(r => {
    const done = r.status === 'completed' || r.checklistCompleted === true;
    (r.dynamicFieldsSnapshot || []).forEach(f => {
      if (sections[f.section]) {
        done ? sections[f.section].c++ : sections[f.section].p++;
      }
    });
  });

  const labels = Object.keys(sections);
  const completed = labels.map(l => sections[l].c);
  const pending = labels.map(l => sections[l].p);

  if (reportBarChart) reportBarChart.destroy();
  reportBarChart = new Chart(barCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'مكتمل', data: completed, backgroundColor: '#2f9e66' },
        { label: 'معلق', data: pending, backgroundColor: '#d64545' }
      ]
    },
    options: {
      responsive: true,
      scales: $$('reportChartType')?.value === 'stacked'
        ? {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
          }
        : {
            y: { beginAtZero: true }
          }
    }
  });

  if (reportPieChart) reportPieChart.destroy();
  reportPieChart = new Chart(pieCanvas, {
    type: 'pie',
    data: {
      labels: ['مكتمل', 'معلق'],
      datasets: [{
        data: [
          completed.reduce((a, b) => a + b, 0),
          pending.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#2f9e66', '#d64545']
      }]
    }
  });

  /* ---------- LINE + TARGET ---------- */
  const target = Number($$('reportTargetValue')?.value || 0);
  const timeline = {};

  getFilteredReportChecklists().forEach(r => {
    const m = (r.visitDate || r.technicianVisitDate || '').slice(0, 7);
    if (!m) return;
    if (!timeline[m]) timeline[m] = { c: 0, p: 0 };
    r.checklistCompleted ? timeline[m].c++ : timeline[m].p++;
  });

  const months = Object.keys(timeline).sort();
  const pct = months.map(m => {
    const t = timeline[m].c + timeline[m].p;
    return t ? Math.round((timeline[m].c / t) * 100) : 0;
  });

  if (reportLineChart) reportLineChart.destroy();
  reportLineChart = new Chart(lineCanvas, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'نسبة الإنجاز',
          data: pct,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13,110,253,.15)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'الهدف',
          data: months.map(() => target),
          borderColor: '#dc3545',
          borderDash: [6, 6],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: v => v + '%'
          }
        }
      }
    }
  });
}

/* ================= Bind Events Safely ================= */
function bindReportsEvents() {
  [
    'reportTechnicianFilter',
    'reportBrandFilter',
    'reportFromDate',
    'reportToDate',
    'reportChartType',
    'reportTargetValue'
  ].forEach(id => {
    const el = $$(id);
    if (el) {
      el.addEventListener('change', renderReportsCharts);
    }
  });
}

/* ================= Public Hook ================= */
window.initReportsDashboard = function () {
  const chartEl = document.getElementById('assessmentChart');

  // ✅ لا ترسم إذا التبويب غير ظاهر أو الصفحة لسه ما جهزت
  if (!chartEl || chartEl.offsetParent === null) {
    return;
  }

  populateReportFilters();
  bindReportsEvents();
  renderReportsCharts();
};
