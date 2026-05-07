/**
 * Unipulse Admin Panel - MongoDB Backend Version
 * ================================================
 * Uses fetch() API calls to Node.js/Express backend
 */

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'unipulse2024'
    };

    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 30000;
    const TABLE_PAGE_SIZE = 15;
    const SESSION_KEY = 'unipulse_admin_session';
    // Use absolute URL if not served from the Node.js server (e.g. when using Live Server)
    const API_BASE = (window.location.port === '3000') ? '/api' : 'http://localhost:3000/api';

    // ==================== STATE ====================
    let loginAttempts = 0;
    let lockoutUntil = 0;
    let allColleges = [];
    let filteredColleges = [];
    let currentTablePage = 1;
    let deleteTargetId = null;

    // ==================== INITIALIZATION ====================
    document.addEventListener('DOMContentLoaded', function () {
        checkAuth();
        bindEvents();
    });

    async function loadAllData() {
        try {
            // Load colleges from API
            const res = await fetch(API_BASE + '/colleges');
            allColleges = await res.json();
            filteredColleges = allColleges.slice();
        } catch (err) {
            console.error('Failed to load colleges:', err);
            allColleges = [];
            filteredColleges = [];
        }
    }

    // ==================== AUTHENTICATION ====================
    function checkAuth() {
        var session = sessionStorage.getItem(SESSION_KEY);
        if (session === 'authenticated') {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('admin-dashboard').classList.remove('active');
    }

    async function showDashboard() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('admin-dashboard').classList.add('active');
        await loadAllData();
        refreshDashboard();
        renderCollegesTable();
        renderAnalytics();
        renderUsers();
    }

    function handleLogin(e) {
        if (e) e.preventDefault();

        var now = Date.now();
        if (now < lockoutUntil) {
            var remaining = Math.ceil((lockoutUntil - now) / 1000);
            showLoginError('Too many attempts. Try again in ' + remaining + 's.');
            return;
        }

        var username = document.getElementById('login-username').value.trim();
        var password = document.getElementById('login-password').value;

        if (!username || !password) {
            showLoginError('Please enter both username and password.');
            return;
        }

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            loginAttempts = 0;
            sessionStorage.setItem(SESSION_KEY, 'authenticated');
            hideLoginError();
            showDashboard();
            showToast('Welcome back, Admin!', 'success');
        } else {
            loginAttempts++;
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                lockoutUntil = Date.now() + LOCKOUT_DURATION;
                showLoginError('Account locked. Too many failed attempts. Try again in 30 seconds.');
                document.getElementById('login-btn').disabled = true;
                setTimeout(function () {
                    document.getElementById('login-btn').disabled = false;
                    loginAttempts = 0;
                }, LOCKOUT_DURATION);
            } else {
                var left = MAX_LOGIN_ATTEMPTS - loginAttempts;
                showLoginError('Invalid username or password. ' + left + ' attempt(s) remaining.');
            }
        }
    }

    function handleLogout() {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        hideLoginError();
    }

    function showLoginError(msg) {
        var el = document.getElementById('login-error');
        document.getElementById('login-error-text').textContent = msg;
        el.classList.add('visible');
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    }

    function hideLoginError() {
        document.getElementById('login-error').classList.remove('visible');
    }

    // ==================== EVENT BINDINGS ====================
    function bindEvents() {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('login-btn').addEventListener('click', handleLogin);

        document.getElementById('password-toggle').addEventListener('click', function () {
            var input = document.getElementById('login-password');
            var icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });

        document.getElementById('logout-btn').addEventListener('click', handleLogout);

        document.getElementById('mobile-toggle').addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            var sidebar = document.getElementById('sidebar');
            var toggle = document.getElementById('mobile-toggle');
            if (window.innerWidth <= 992 &&
                !sidebar.contains(e.target) &&
                !toggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        document.getElementById('admin-search').addEventListener('input', applyFilters);
        document.getElementById('admin-category-filter').addEventListener('change', applyFilters);
        document.getElementById('admin-type-filter').addEventListener('change', applyFilters);

        document.getElementById('add-college-btn').addEventListener('click', openAddModal);
        document.getElementById('save-college-btn').addEventListener('click', saveCollege);
        document.getElementById('export-btn').addEventListener('click', exportData);
        document.getElementById('confirm-delete-btn').addEventListener('click', confirmDelete);

        var userSearchEl = document.getElementById('user-search');
        if (userSearchEl) {
            userSearchEl.addEventListener('input', renderUsers);
        }

        var overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(function (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
                    m.classList.remove('active');
                });
            }
        });
    }

    // ==================== PAGE NAVIGATION ====================
    window.switchPage = function (page) {
        document.querySelectorAll('.nav-item').forEach(function (item) {
            item.classList.remove('active');
        });
        var activeItem = document.querySelector('.nav-item[data-page="' + page + '"]');
        if (activeItem) activeItem.classList.add('active');

        document.querySelectorAll('.page-section').forEach(function (s) {
            s.classList.remove('active');
        });
        var target = document.getElementById('page-' + page);
        if (target) target.classList.add('active');

        var titles = {
            dashboard: ['Dashboard', 'Welcome back, Admin'],
            colleges: ['College Management', 'Add, edit, and manage all colleges'],
            analytics: ['Analytics', 'Data insights and breakdowns'],
            users: ['User Management', 'View registered users and login data']
        };
        var t = titles[page] || ['Dashboard', ''];
        document.getElementById('page-title').textContent = t[0];
        document.getElementById('page-subtitle').textContent = t[1];

        document.getElementById('sidebar').classList.remove('active');

        // Refresh data when switching pages
        if (page === 'users') renderUsers();
        if (page === 'analytics') renderAnalytics();
    };

    // ==================== DASHBOARD STATS ====================
    async function refreshDashboard() {
        try {
            const res = await fetch(API_BASE + '/stats/colleges');
            const stats = await res.json();

            animateCounter('stat-total', stats.total);
            animateCounter('stat-engineering', stats.engineering);
            animateCounter('stat-medical', stats.medical);
            animateCounter('stat-pharmacy', stats.pharmacy);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }

        // Recent colleges
        var recent = allColleges.slice(-8).reverse();
        var tbody = document.getElementById('recent-colleges-body');
        tbody.innerHTML = '';
        recent.forEach(function (c) {
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + escapeHtml(c.name) + '</td>' +
                '<td>' + escapeHtml(c.district || 'N/A') + '</td>' +
                '<td><span class="type-badge ' + (c.type || '').toLowerCase() + '">' + escapeHtml(c.type || 'N/A') + '</span></td>' +
                '<td><span class="category-badge ' + (c.category || '') + '">' + capitalize(c.category || 'N/A') + '</span></td>' +
                '<td>' + (c.rating || 'N/A') + '</td>';
            tbody.appendChild(tr);
        });
    }

    function animateCounter(id, target) {
        var el = document.getElementById(id);
        if (!el) return;
        var current = 0;
        var step = Math.max(1, Math.floor(target / 30));
        var interval = setInterval(function () {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 25);
    }

    // ==================== COLLEGES TABLE ====================
    function applyFilters() {
        var search = (document.getElementById('admin-search').value || '').toLowerCase();
        var category = document.getElementById('admin-category-filter').value;
        var type = document.getElementById('admin-type-filter').value;

        filteredColleges = allColleges.filter(function (c) {
            var matchSearch = !search ||
                (c.name || '').toLowerCase().indexOf(search) !== -1 ||
                (c.district || '').toLowerCase().indexOf(search) !== -1;
            var matchCat = !category || c.category === category;
            var matchType = !type || c.type === type;
            return matchSearch && matchCat && matchType;
        });

        currentTablePage = 1;
        renderCollegesTable();
    }

    function renderCollegesTable() {
        var search = (document.getElementById('admin-search').value || '').trim();
        var category = document.getElementById('admin-category-filter').value;
        var type = document.getElementById('admin-type-filter').value;
        if (!search && !category && !type) {
            filteredColleges = allColleges.slice();
        }

        var totalPages = Math.ceil(filteredColleges.length / TABLE_PAGE_SIZE) || 1;
        if (currentTablePage > totalPages) currentTablePage = totalPages;

        var start = (currentTablePage - 1) * TABLE_PAGE_SIZE;
        var pageData = filteredColleges.slice(start, start + TABLE_PAGE_SIZE);

        var tbody = document.getElementById('colleges-table-body');
        tbody.innerHTML = '';

        if (pageData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state">' +
                '<i class="fas fa-inbox"></i><h4>No colleges found</h4>' +
                '<p>Try adjusting your search or filters.</p></div></td></tr>';
        } else {
            pageData.forEach(function (c, i) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + (start + i + 1) + '</td>' +
                    '<td style="font-weight:600;max-width:250px;">' + escapeHtml(c.name) + '</td>' +
                    '<td>' + escapeHtml(c.district || 'N/A') + '</td>' +
                    '<td><span class="type-badge ' + (c.type || '').toLowerCase() + '">' + escapeHtml(c.type || 'N/A') + '</span></td>' +
                    '<td><span class="category-badge ' + (c.category || '') + '">' + capitalize(c.category || 'N/A') + '</span></td>' +
                    '<td>' + escapeHtml(c.fees || 'N/A') + '</td>' +
                    '<td>' + (c.rating || 'N/A') + '</td>' +
                    '<td>' +
                    '  <div class="action-btns">' +
                    '    <button class="action-btn edit" title="Edit" onclick="editCollege(\'' + c._id + '\')">' +
                    '      <i class="fas fa-pen"></i>' +
                    '    </button>' +
                    '    <button class="action-btn delete" title="Delete" onclick="deleteCollege(\'' + c._id + '\')">' +
                    '      <i class="fas fa-trash"></i>' +
                    '    </button>' +
                    '  </div>' +
                    '</td>';
                tbody.appendChild(tr);
            });
        }

        var info = document.getElementById('table-info');
        info.textContent = 'Showing ' + (pageData.length ? start + 1 : 0) + '-' +
            (start + pageData.length) + ' of ' + filteredColleges.length + ' colleges';

        renderTablePagination(totalPages);
    }

    function renderTablePagination(totalPages) {
        var container = document.getElementById('table-pagination');
        container.innerHTML = '';
        if (totalPages <= 1) return;

        var prev = document.createElement('button');
        prev.className = 'page-btn';
        prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prev.disabled = currentTablePage === 1;
        prev.onclick = function () { if (currentTablePage > 1) { currentTablePage--; renderCollegesTable(); } };
        container.appendChild(prev);

        var startPage = Math.max(1, currentTablePage - 2);
        var endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

        for (var p = startPage; p <= endPage; p++) {
            (function (page) {
                var btn = document.createElement('button');
                btn.className = 'page-btn' + (page === currentTablePage ? ' active' : '');
                btn.textContent = page;
                btn.onclick = function () { currentTablePage = page; renderCollegesTable(); };
                container.appendChild(btn);
            })(p);
        }

        var next = document.createElement('button');
        next.className = 'page-btn';
        next.innerHTML = '<i class="fas fa-chevron-right"></i>';
        next.disabled = currentTablePage === totalPages;
        next.onclick = function () { if (currentTablePage < totalPages) { currentTablePage++; renderCollegesTable(); } };
        container.appendChild(next);
    }

    // ==================== CRUD OPERATIONS ====================
    function openAddModal() {
        document.getElementById('modal-title').textContent = 'Add New College';
        document.getElementById('edit-index').value = '';
        document.getElementById('college-form').reset();
        openModal('college-modal');
    }

    window.editCollege = function (id) {
        var c = allColleges.find(function (col) { return col._id === id; });
        if (!c) return;

        document.getElementById('modal-title').textContent = 'Edit College';
        document.getElementById('edit-index').value = id;
        document.getElementById('college-name').value = c.name || '';
        document.getElementById('college-district').value = c.district || '';
        document.getElementById('college-type').value = c.type || '';
        document.getElementById('college-category').value = c.category || '';
        document.getElementById('college-fees').value = c.fees || '';
        document.getElementById('college-established').value = c.established || '';
        document.getElementById('college-rating').value = c.rating || '';
        document.getElementById('college-branches').value = (c.branches || []).join(', ');

        openModal('college-modal');
    };

    async function saveCollege() {
        var name = document.getElementById('college-name').value.trim();
        var district = document.getElementById('college-district').value.trim();
        var type = document.getElementById('college-type').value;
        var category = document.getElementById('college-category').value;
        var fees = document.getElementById('college-fees').value.trim();
        var established = parseInt(document.getElementById('college-established').value) || null;
        var rating = parseFloat(document.getElementById('college-rating').value) || null;
        var branchesStr = document.getElementById('college-branches').value.trim();
        var branches = branchesStr ? branchesStr.split(',').map(function (b) { return b.trim(); }).filter(Boolean) : [];

        if (!name) { showToast('Please enter a college name.', 'error'); return; }
        if (!district) { showToast('Please enter a district.', 'error'); return; }
        if (!type) { showToast('Please select a college type.', 'error'); return; }
        if (!category) { showToast('Please select a category.', 'error'); return; }

        var collegeObj = { name, district, type, category, fees: fees || 'N/A', established, rating, branches };
        var editId = document.getElementById('edit-index').value;

        try {
            var res;
            if (editId) {
                // Update existing
                res = await fetch(API_BASE + '/colleges/' + editId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(collegeObj)
                });
                if (res.ok) {
                    showToast('College updated successfully!', 'success');
                } else {
                    var errorMsg = 'Failed to update college.';
                    try {
                        var errData = await res.json();
                        errorMsg = errData.error || errData.details || errorMsg;
                    } catch (parseErr) {
                        errorMsg = 'Server error (status ' + res.status + '). Please try again.';
                    }
                    showToast(errorMsg, 'error');
                    return;
                }
            } else {
                // Add new
                res = await fetch(API_BASE + '/colleges', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(collegeObj)
                });
                if (res.ok) {
                    showToast('College added successfully!', 'success');
                } else {
                    var errorMsg2 = 'Failed to add college.';
                    try {
                        var errData2 = await res.json();
                        errorMsg2 = errData2.error || errData2.details || errorMsg2;
                    } catch (parseErr) {
                        errorMsg2 = 'Server error (status ' + res.status + '). Please try again.';
                    }
                    showToast(errorMsg2, 'error');
                    return;
                }
            }

            closeModal('college-modal');
            await loadAllData();
            applyFilters();
            refreshDashboard();
            renderAnalytics();
        } catch (err) {
            showToast('Network error: ' + err.message, 'error');
        }
    }

    window.deleteCollege = function (id) {
        deleteTargetId = id;
        var c = allColleges.find(function (col) { return col._id === id; });
        document.getElementById('delete-confirm-text').textContent =
            'Are you sure you want to delete "' + (c ? c.name : '') + '"? This action cannot be undone.';
        openModal('delete-modal');
    };

    async function confirmDelete() {
        if (deleteTargetId) {
            try {
                var res = await fetch(API_BASE + '/colleges/' + deleteTargetId, { method: 'DELETE' });
                if (res.ok) {
                    var data = await res.json();
                    showToast('"' + data.college.name + '" deleted successfully.', 'success');
                    await loadAllData();
                    applyFilters();
                    refreshDashboard();
                    renderAnalytics();
                } else {
                    showToast('Failed to delete college.', 'error');
                }
            } catch (err) {
                showToast('Network error: ' + err.message, 'error');
            }
        }
        closeModal('delete-modal');
        deleteTargetId = null;
    }

    // ==================== ANALYTICS ====================
    async function renderAnalytics() {
        try {
            // Get stats from API
            const statsRes = await fetch(API_BASE + '/stats/colleges');
            const stats = await statsRes.json();

            document.getElementById('stat-districts').textContent = stats.districts;
            document.getElementById('stat-govt').textContent = stats.govt;
            document.getElementById('stat-private').textContent = stats.private;
            document.getElementById('stat-avg-rating').textContent = stats.avgRating;

            // Get district breakdown
            const distRes = await fetch(API_BASE + '/stats/districts');
            const districts = await distRes.json();

            var tbody = document.getElementById('district-analytics-body');
            tbody.innerHTML = '';

            districts.forEach(function (d) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td style="font-weight:600;">' + escapeHtml(d._id) + '</td>' +
                    '<td>' + d.engineering + '</td>' +
                    '<td>' + d.medical + '</td>' +
                    '<td>' + d.pharmacy + '</td>' +
                    '<td style="font-weight:700;color:var(--primary);">' + d.total + '</td>';
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error('Failed to load analytics:', err);
        }
    }

    // ==================== EXPORT ====================
    function exportData() {
        var json = JSON.stringify(allColleges, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'unipulse_colleges_' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('College data exported successfully!', 'success');
    }

    // ==================== MODAL HELPERS ====================
    function openModal(id) {
        document.getElementById(id).classList.add('active');
    }

    window.closeModal = function (id) {
        document.getElementById(id).classList.remove('active');
    };

    // ==================== TOAST NOTIFICATIONS ====================
    function showToast(message, type) {
        type = type || 'info';
        var container = document.getElementById('toast-container');
        var icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.innerHTML =
            '<i class="fas ' + (icons[type] || icons.info) + ' toast-icon"></i>' +
            '<span class="toast-message">' + escapeHtml(message) + '</span>' +
            '<button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
        container.appendChild(toast);

        setTimeout(function () {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
            }
        }, 4000);
    }

    // ==================== USERS MANAGEMENT ====================
    async function renderUsers() {
        try {
            var search = '';
            var searchEl = document.getElementById('user-search');
            if (searchEl) search = (searchEl.value || '').trim();

            // Fetch users from API
            var url = API_BASE + '/users';
            if (search) url += '?search=' + encodeURIComponent(search);
            var usersRes = await fetch(url);
            var users = await usersRes.json();

            // Fetch user stats
            var statsRes = await fetch(API_BASE + '/stats/users');
            var stats = await statsRes.json();

            var totalEl = document.getElementById('stat-total-users');
            var todayEl = document.getElementById('stat-today-users');
            var weekEl = document.getElementById('stat-week-users');
            var latestEl = document.getElementById('stat-latest-signup');

            if (totalEl) totalEl.textContent = stats.total;
            if (todayEl) todayEl.textContent = stats.today;
            if (weekEl) weekEl.textContent = stats.week;
            if (latestEl) {
                if (stats.latest && stats.latest.createdAt) {
                    var d = new Date(stats.latest.createdAt);
                    latestEl.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                } else {
                    latestEl.textContent = 'N/A';
                }
            }

            // Table
            var tbody = document.getElementById('users-table-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">' +
                    '<i class="fas fa-user-slash"></i><h4>No users found</h4>' +
                    '<p>' + (search ? 'Try a different search term.' : 'No users have registered yet.') + '</p></div></td></tr>';
            } else {
                users.forEach(function (u, i) {
                    var regDate = 'N/A';
                    if (u.createdAt) {
                        var d = new Date(u.createdAt);
                        regDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
                            ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    }
                    var tr = document.createElement('tr');
                    tr.innerHTML =
                        '<td>' + (i + 1) + '</td>' +
                        '<td style="font-weight:600;">' + escapeHtml(u.name || 'N/A') + '</td>' +
                        '<td>' + escapeHtml(u.email || 'N/A') + '</td>' +
                        '<td>' + escapeHtml(u.phone || 'N/A') + '</td>' +
                        '<td>' + regDate + '</td>' +
                        '<td>' +
                        '  <div class="action-btns">' +
                        '    <button class="action-btn delete" title="Delete User" onclick="deleteUser(\'' + u._id + '\')">' +
                        '      <i class="fas fa-trash"></i>' +
                        '    </button>' +
                        '  </div>' +
                        '</td>';
                    tbody.appendChild(tr);
                });
            }

            var info = document.getElementById('users-table-info');
            if (info) info.textContent = 'Showing ' + users.length + ' of ' + stats.total + ' users';
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    }

    window.deleteUser = async function (id) {
        try {
            var res = await fetch(API_BASE + '/users/' + id, { method: 'DELETE' });
            if (res.ok) {
                var data = await res.json();
                showToast('User "' + data.user.name + '" deleted.', 'success');
                renderUsers();
            } else {
                showToast('Failed to delete user.', 'error');
            }
        } catch (err) {
            showToast('Network error: ' + err.message, 'error');
        }
    };

    // ==================== UTILITIES ====================
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

})();
