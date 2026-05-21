// ============================================================
// CSC&E Output Validator — Frontend Logic
// ============================================================

let currentSquad = "All";
let outputs = [];
let referenceData = {};
let editingId = null;

// --- INIT ---
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadReferenceData();
    loadSquadsSidebar();
    populateFormDropdowns();
    await loadOutputs();
}

// --- REFERENCE DATA ---
async function loadReferenceData() {
    try {
        const res = await fetch("/api/reference");
        referenceData = await res.json();
    } catch (e) {
        console.error("Failed to load reference data:", e);
        referenceData = { squads: [], csf_outcomes: [], csce_outcomes: [], quarters: [], priorities: [], output_statuses: [], checkpoint_statuses: [], regions: [], divisions: [], countries: [] };
    }
}

function loadSquadsSidebar() {
    const container = document.getElementById("squad-list");
    container.innerHTML = "";
    (referenceData.squads || []).forEach(squad => {
        const div = document.createElement("div");
        div.className = "squad-item";
        div.dataset.squad = squad;
        div.onclick = function() { selectSquad(this, squad); };
        div.innerHTML = `<div class="squad-dot"></div><span>${squad}</span>`;
        container.appendChild(div);
    });
}

function populateFormDropdowns() {
    populateDropdown("form-csf_outcome", referenceData.csf_outcomes || [], "", true);
    populateDropdown("form-csce_outcome", referenceData.csce_outcomes || [], "", true);
    populateDropdown("form-quarter", referenceData.quarters || [], "", true);
    populateDropdown("form-priority", referenceData.priorities || [], "", true);
    populateDropdown("form-output_status", referenceData.output_statuses || [], "Not Started", false);
    populateDropdown("form-squad", referenceData.squads || [], "", true);
    populateDropdown("form-country", referenceData.countries || [], "", true);
    populateDropdown("form-region", referenceData.regions || [], "", true);
    populateDropdown("form-division", referenceData.divisions || [], "", true);

    // Checkpoint statuses
    const cpSelect = document.getElementById("form-checkpoint_status");
    cpSelect.innerHTML = '<option value="">—</option>';
    (referenceData.checkpoint_statuses || []).forEach(s => {
        cpSelect.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

function populateDropdown(selectId, options, selectedValue, addEmpty) {
    const el = document.getElementById(selectId);
    if (!el) return;
    el.innerHTML = "";
    if (addEmpty) el.innerHTML = '<option value="">— Select —</option>';
    options.forEach(opt => {
        const selected = opt === selectedValue ? "selected" : "";
        el.innerHTML += `<option value="${opt}" ${selected}>${opt}</option>`;
    });
}

// --- SQUAD SELECTION ---
function selectSquad(el, squad) {
    currentSquad = squad;
    document.querySelectorAll(".squad-item").forEach(s => s.classList.remove("active"));
    if (el) el.classList.add("active");
    document.getElementById("current-squad-badge").textContent = squad === "All" ? "All Teams" : squad;
    loadOutputs();
}

// --- LOAD OUTPUTS ---
async function loadOutputs() {
    try {
        const url = currentSquad && currentSquad !== "All"
            ? `/api/outputs?squad=${encodeURIComponent(currentSquad)}`
            : "/api/outputs";
        const res = await fetch(url);
        outputs = await res.json();
    } catch (e) {
        console.error("Failed to load outputs:", e);
        outputs = [];
    }
    renderTable(outputs);
    updateStats(outputs);
}

// --- RENDER TABLE ---
function renderTable(data) {
    const tbody = document.getElementById("outputs-table");
    const empty = document.getElementById("empty-state");

    if (!data || data.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";
    tbody.innerHTML = data.map(row => `
        <tr data-search="${(row.output || '').toLowerCase()} ${(row.squad || '').toLowerCase()} ${(row.owner || '').toLowerCase()}">
            <td><strong>${row.id}</strong></td>
            <td class="cell-output" title="${escapeHtml(row.output || '')}">${escapeHtml(row.output || '')}</td>
            <td><span class="badge badge-blue">${escapeHtml(row.squad || '')}</span></td>
            <td>${escapeHtml(row.csce_outcome || '—')}</td>
            <td>${escapeHtml(row.quarter || '')} ${row.year || ''}</td>
            <td>${getStatusBadge(row.output_status)}</td>
            <td>${getAIBadge(row.ai_status)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-validate btn-sm" onclick="validateExistingOutput(${row.id})" title="Validate with AI">🤖</button>
                    <button class="btn btn-ghost btn-sm" onclick="openEditModal(${row.id})" title="Edit">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOutput(${row.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join("");
}

// --- BADGES ---
function getAIBadge(status) {
    if (!status) return '<span class="badge badge-gray">Not validated</span>';
    const map = {
        "Valid": { cls: "badge-green", icon: "✅" },
        "Improve": { cls: "badge-yellow", icon: "⚠️" },
        "Reject": { cls: "badge-red", icon: "❌" },
    };
    const m = map[status] || { cls: "badge-gray", icon: "❓" };
    return `<span class="badge ${m.cls}">${m.icon} ${status}</span>`;
}

function getStatusBadge(status) {
    if (!status) return '<span class="badge badge-gray">—</span>';
    const map = {
        "Completed": "badge-green",
        "In Progress": "badge-blue",
        "Not Started": "badge-gray",
        "Closed": "badge-yellow",
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// --- STATS ---
function updateStats(data) {
    const total = data.length;
    const validated = data.filter(d => d.ai_status).length;
    const valid = data.filter(d => d.ai_status === "Valid").length;
    const notValidated = total - validated;
    const validRate = validated > 0 ? Math.round((valid / validated) * 100) + "%" : "—";

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-validated").textContent = validated;
    document.getElementById("stat-valid-rate").textContent = validRate;
    document.getElementById("stat-not-validated").textContent = notValidated;
}

// --- FILTER ---
function filterTable() {
    const query = document.getElementById("search-input").value.toLowerCase();
    document.querySelectorAll("#outputs-table tr").forEach(row => {
        const text = row.dataset.search || "";
        row.style.display = text.includes(query) ? "" : "none";
    });
}

// --- MODAL ---
function openCreateModal() {
    editingId = null;
    document.getElementById("modal-title").textContent = "New Output";
    document.getElementById("output-form").reset();
    document.getElementById("form-id").value = "";
    document.getElementById("form-year").value = "2026";
    document.getElementById("form-metric_baseline").value = "0";
    document.getElementById("form-metric_value").value = "0";
    document.getElementById("form-metric_target").value = "1";

    // Pre-select current squad
    if (currentSquad && currentSquad !== "All") {
        document.getElementById("form-squad").value = currentSquad;
    }

    // Set default status
    document.getElementById("form-output_status").value = "Not Started";

    hideValidationResult();
    document.getElementById("output-modal").classList.add("active");
}

async function openEditModal(id) {
    try {
        const res = await fetch(`/api/outputs/${id}`);
        const data = await res.json();
        editingId = id;
        document.getElementById("modal-title").textContent = "Edit Output #" + id;
        setFormData(data);

        // Show existing validation if present
        if (data.ai_status) {
            showValidationResult({
                status: data.ai_status,
                alignment: data.ai_alignment,
                outcome: data.ai_outcome,
                business_value: data.ai_business_value,
                output_quality: data.ai_output_quality,
                comment: data.ai_comment,
                suggestion: data.ai_suggestion,
            });
        } else {
            hideValidationResult();
        }

        document.getElementById("output-modal").classList.add("active");
    } catch (e) {
        showToast("Failed to load output", "error");
    }
}

function closeModal() {
    document.getElementById("output-modal").classList.remove("active");
    editingId = null;
    hideValidationResult();
}

// --- SAVE ---
async function saveOutput() {
    const data = getFormData();

    if (!data.output || data.output.trim() === "") {
        showToast("Output description is required", "error");
        return;
    }
    if (!data.squad) {
        showToast("Squad is required", "error");
        return;
    }

    try {
        const url = editingId ? `/api/outputs/${editingId}` : "/api/outputs";
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Save failed");

        showToast(editingId ? "Output updated" : "Output created", "success");
        closeModal();
        await loadOutputs();
    } catch (e) {
        showToast("Failed to save output: " + e.message, "error");
    }
}

// --- DELETE ---
async function deleteOutput(id) {
    if (!confirm("Delete this output? This cannot be undone.")) return;

    try {
        const res = await fetch(`/api/outputs/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        showToast("Output deleted", "success");
        await loadOutputs();
    } catch (e) {
        showToast("Failed to delete: " + e.message, "error");
    }
}

// --- VALIDATE (from modal form) ---
async function validateCurrentOutput() {
    const output = document.getElementById("form-output").value;
    const measure = document.getElementById("form-measure").value;
    const impact = document.getElementById("form-impact").value;

    if (!output || output.trim() === "") {
        showToast("Enter an output description first", "error");
        return;
    }

    const loading = document.getElementById("validate-loading");
    loading.classList.add("active");
    hideValidationResult();

    try {
        const res = await fetch("/api/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ output, measure, impact }),
        });

        const result = await res.json();
        showValidationResult(result);
    } catch (e) {
        showToast("Validation failed: " + e.message, "error");
    } finally {
        loading.classList.remove("active");
    }
}

// --- VALIDATE (existing row in table) ---
async function validateExistingOutput(id) {
    showToast("Validating output #" + id + "...", "info");

    try {
        const res = await fetch(`/api/outputs/${id}/validate`, { method: "POST" });
        if (!res.ok) throw new Error("Validation failed");

        const result = await res.json();
        showToast(`Output #${id}: ${result.status}`, result.status === "Valid" ? "success" : "error");
        await loadOutputs();
    } catch (e) {
        showToast("Validation failed: " + e.message, "error");
    }
}

// --- VALIDATION RESULT DISPLAY ---
function showValidationResult(result) {
    const container = document.getElementById("validation-result");
    container.className = "validation-result show";

    const statusLower = (result.status || "").toLowerCase();
    if (statusLower === "valid") {
        container.classList.add("valid");
        document.getElementById("vr-icon").textContent = "✅";
    } else if (statusLower === "improve") {
        container.classList.add("improve");
        document.getElementById("vr-icon").textContent = "⚠️";
    } else {
        container.classList.add("reject");
        document.getElementById("vr-icon").textContent = "❌";
    }

    document.getElementById("vr-status").textContent = result.status || "";
    document.getElementById("vr-alignment").textContent = result.alignment || "";
    document.getElementById("vr-outcome").textContent = result.outcome || "";
    document.getElementById("vr-bv").textContent = result.business_value || "";
    document.getElementById("vr-quality").textContent = result.output_quality || "";
    document.getElementById("vr-comment").textContent = result.comment || "";

    const suggBox = document.getElementById("vr-suggestion-box");
    if (result.suggestion && result.suggestion.trim() !== "") {
        document.getElementById("vr-suggestion").textContent = result.suggestion;
        suggBox.style.display = "block";
    } else {
        suggBox.style.display = "none";
    }
}

function hideValidationResult() {
    const container = document.getElementById("validation-result");
    container.className = "validation-result";
    container.classList.remove("show", "valid", "improve", "reject");
}

// --- FORM HELPERS ---
function getFormData() {
    return {
        csf_outcome: document.getElementById("form-csf_outcome").value,
        csce_outcome: document.getElementById("form-csce_outcome").value,
        measure: document.getElementById("form-measure").value,
        output_keyword: document.getElementById("form-output_keyword").value,
        output: document.getElementById("form-output").value,
        impact: document.getElementById("form-impact").value,
        quarter: document.getElementById("form-quarter").value,
        year: parseInt(document.getElementById("form-year").value) || 2026,
        priority: document.getElementById("form-priority").value,
        metric_baseline: parseFloat(document.getElementById("form-metric_baseline").value) || 0,
        metric_value: parseFloat(document.getElementById("form-metric_value").value) || 0,
        metric_target: parseFloat(document.getElementById("form-metric_target").value) || 1,
        output_status: document.getElementById("form-output_status").value,
        checkpoint_status: document.getElementById("form-checkpoint_status").value,
        checkpoint_description: document.getElementById("form-checkpoint_description").value,
        risk: document.getElementById("form-risk").value,
        issue: document.getElementById("form-issue").value,
        owner: document.getElementById("form-owner").value,
        platform: "Cyber Security Culture & Enablement",
        squad: document.getElementById("form-squad").value,
        country: document.getElementById("form-country").value,
        region: document.getElementById("form-region").value,
        division: document.getElementById("form-division").value,
        status_notes: document.getElementById("form-status_notes").value,
    };
}

function setFormData(data) {
    const fields = [
        "csf_outcome", "csce_outcome", "measure", "output_keyword", "output",
        "impact", "quarter", "year", "priority", "metric_baseline", "metric_value",
        "metric_target", "output_status", "checkpoint_status", "checkpoint_description",
        "risk", "issue", "owner", "squad", "country", "region", "division", "status_notes",
    ];
    fields.forEach(field => {
        const el = document.getElementById("form-" + field);
        if (el && data[field] !== null && data[field] !== undefined) {
            el.value = data[field];
        }
    });
}

// --- EXPORT ---
function exportCSV() {
    const url = currentSquad && currentSquad !== "All"
        ? `/api/export?squad=${encodeURIComponent(currentSquad)}`
        : "/api/export";
    window.open(url, "_blank");
}

// --- TOAST ---
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = "opacity .3s";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// --- HELPERS ---
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
