let applications = [];
let editingId = null;
let dragId = null;

// ── Data ──────────────────────────────────────────────
function loadData() {
    const saved = localStorage.getItem('jobApplications');
    if (saved) {
        applications = JSON.parse(saved);
    } else {
        applications = [
            { id: 1, company: 'Google',    role: 'Software Engineer',  location: 'Remote',    appliedDate: '2025-04-01', status: 'Interview' },
            { id: 2, company: 'Microsoft', role: 'Frontend Developer', location: 'Bangalore', appliedDate: '2025-03-28', status: 'Applied'   },
            { id: 3, company: 'Amazon',    role: 'SDE-1',              location: 'Hyderabad', appliedDate: '2025-03-15', status: 'Rejected'  },
            { id: 4, company: 'Flipkart',  role: 'UI Engineer',        location: 'Pune',      appliedDate: '2025-03-10', status: 'Offer'     }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
}

// ── Dashboard ─────────────────────────────────────────
function renderDashboard() {
    document.getElementById('total-count').textContent     = applications.length;
    document.getElementById('applied-count').textContent   = applications.filter(a => a.status === 'Applied').length;
    document.getElementById('interview-count').textContent = applications.filter(a => a.status === 'Interview').length;
    document.getElementById('offer-count').textContent     = applications.filter(a => a.status === 'Offer').length;
    document.getElementById('rejected-count').textContent  = applications.filter(a => a.status === 'Rejected').length;
    renderRecent();
}

function renderRecent() {
    const list = document.getElementById('recent-list');
    const recent = [...applications]
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5);

    if (recent.length === 0) {
        list.innerHTML = '<p class="text-muted small">No applications yet.</p>';
        return;
    }

    list.innerHTML = recent.map(app => {
        const date = new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        return `
        <div class="recent-item">
            <div>
                <div class="recent-company">${app.company}</div>
                <div class="recent-role">${app.role} &bull; ${app.location || '—'}</div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge-status badge-${app.status}">${app.status}</span>
                <span class="recent-date">${date}</span>
            </div>
        </div>`;
    }).join('');
}

// ── Applications Table ────────────────────────────────
function renderTable(filteredApps) {
    const tbody = document.getElementById('table-body');
    const empty = document.getElementById('empty-state');
    const table = document.getElementById('applications-table');

    tbody.innerHTML = '';

    if (filteredApps.length === 0) {
        table.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    table.style.display = '';
    empty.style.display = 'none';

    filteredApps.forEach((app, i) => {
        const date = new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-muted">${i + 1}</td>
            <td><strong>${app.company}</strong></td>
            <td>${app.role}</td>
            <td>${app.location || '—'}</td>
            <td>${date}</td>
            <td>
                <select class="form-select" onchange="updateStatus(${app.id}, this.value)">
                    <option value="Applied"   ${app.status === 'Applied'   ? 'selected' : ''}>Applied</option>
                    <option value="Interview" ${app.status === 'Interview' ? 'selected' : ''}>Interview</option>
                    <option value="Offer"     ${app.status === 'Offer'     ? 'selected' : ''}>Offer</option>
                    <option value="Rejected"  ${app.status === 'Rejected'  ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="openEditModal(${app.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteApplication(${app.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });
}

function filterApplications() {
    const search      = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const sortOption  = document.getElementById('sort-select').value;

    let filtered = applications.filter(app => {
        const matchSearch = app.company.toLowerCase().includes(search) || app.role.toLowerCase().includes(search);
        const matchStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (sortOption === 'date-desc') filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    else if (sortOption === 'date-asc') filtered.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    else if (sortOption === 'company') filtered.sort((a, b) => a.company.localeCompare(b.company));

    renderTable(filtered);
}

function updateStatus(id, newStatus) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    app.status = newStatus;
    saveData();
    renderDashboard();
    filterApplications();
    renderKanban();
    showToast(`Status updated to ${newStatus}`, '🔄');
}

// ── Modal ─────────────────────────────────────────────
function openAddModal() {
    editingId = null;
    document.getElementById('modal-title').innerHTML = '<i class="bi bi-plus-circle"></i> Add New Application';
    document.getElementById('save-btn').innerHTML = '<i class="bi bi-check-lg"></i> Add Application';
    document.getElementById('app-form').reset();
    document.getElementById('applied-date').value = new Date().toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('appModal')).show();
}

function openEditModal(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    editingId = id;
    document.getElementById('modal-title').innerHTML = '<i class="bi bi-pencil-square"></i> Edit Application';
    document.getElementById('save-btn').innerHTML = '<i class="bi bi-check-lg"></i> Save Changes';
    document.getElementById('company').value      = app.company;
    document.getElementById('role').value         = app.role;
    document.getElementById('location').value     = app.location || '';
    document.getElementById('applied-date').value = app.appliedDate;
    document.getElementById('status').value       = app.status;
    new bootstrap.Modal(document.getElementById('appModal')).show();
}

function closeModal() {
    const el = document.getElementById('appModal');
    const modal = bootstrap.Modal.getInstance(el);
    if (modal) modal.hide();
    editingId = null;
}

function saveApplication(e) {
    e.preventDefault();
    const company     = document.getElementById('company').value.trim();
    const role        = document.getElementById('role').value.trim();
    const location    = document.getElementById('location').value.trim();
    const appliedDate = document.getElementById('applied-date').value;
    const status      = document.getElementById('status').value;

    if (!company || !role) { showToast('Company and Role are required!', '⚠️'); return; }

    if (editingId !== null) {
        const app = applications.find(a => a.id === editingId);
        if (app) Object.assign(app, { company, role, location, appliedDate, status });
        showToast('Application updated!', '✅');
    } else {
        applications.unshift({ id: Date.now(), company, role, location, appliedDate: appliedDate || new Date().toISOString().split('T')[0], status });
        showToast('Application added!', '✅');
    }

    saveData();
    renderDashboard();
    filterApplications();
    renderKanban();
    closeModal();
}

function deleteApplication(id) {
    if (!confirm('Delete this application?')) return;
    applications = applications.filter(a => a.id !== id);
    saveData();
    renderDashboard();
    filterApplications();
    renderKanban();
    showToast('Application deleted', '🗑️');
}

// ── Kanban ────────────────────────────────────────────
function renderKanban() {
    ['Applied', 'Interview', 'Offer', 'Rejected'].forEach(status => {
        const container = document.getElementById(`cards-${status}`);
        const count     = document.getElementById(`cnt-${status}`);
        const apps      = applications.filter(a => a.status === status);
        count.textContent = apps.length;
        container.innerHTML = '';
        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.dataset.id = app.id;
            card.innerHTML = `
                <div class="kc-company">${app.company}</div>
                <div class="kc-role">${app.role}</div>
                <div class="kc-loc"><i class="bi bi-geo-alt"></i> ${app.location || '—'}</div>`;
            card.addEventListener('dragstart', onDragStart);
            card.addEventListener('dragend',   onDragEnd);
            container.appendChild(card);
        });
    });
}

function onDragStart(e) {
    dragId = parseInt(e.currentTarget.dataset.id);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
} 

function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
}

function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.closest('.kanban-col').classList.add('drag-over');
}

function onDrop(e, newStatus) {
    e.preventDefault();
    e.currentTarget.closest('.kanban-col').classList.remove('drag-over');
    if (!dragId) return;
    const app = applications.find(a => a.id === dragId);
    if (app && app.status !== newStatus) {
        app.status = newStatus;
        saveData();
        renderDashboard();
        filterApplications();
        renderKanban();
        showToast(`Moved to ${newStatus}`, '🔄');
    }
    dragId = null;
}

// remove drag-over on leave
document.addEventListener('dragleave', e => {
    const col = e.target.closest?.('.kanban-col');
    if (col) col.classList.remove('drag-over');
});

// ── Toast ─────────────────────────────────────────────
function showToast(message, icon = '✅') {
    document.getElementById('toast-text').textContent = message;
    document.getElementById('toast-icon').textContent = icon;
    const toastEl = document.getElementById('toast');
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
}

// ── Dark Mode ─────────────────────────────────────────
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    const btn = document.getElementById('theme-btn');
    btn.innerHTML = isDark
        ? '<i class="bi bi-sun-fill"></i> Light'
        : '<i class="bi bi-moon-fill"></i> Dark';
    localStorage.setItem('darkMode', isDark);
}

// ── Navigation ────────────────────────────────────────
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    document.querySelectorAll('#main-navbar .nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`nav-${section}`).classList.add('active');
    if (section === 'kanban') renderKanban();
}

// ── Init ──────────────────────────────────────────────
function init() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        document.getElementById('theme-btn').innerHTML = '<i class="bi bi-sun-fill"></i> Light';
    }
    loadData();
    renderDashboard();
    filterApplications();
    renderKanban();
}

window.onload = init;
