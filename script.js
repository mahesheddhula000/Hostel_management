/* HOSTEL CARE FRONTEND DEMO - localStorage only; not production authentication */
"use strict";

const KEYS = { complaints: "hostelCareComplaints", student: "hostelCareLoggedInStudent" };
const STAFF = ["Not Assigned", "Ramesh - Electrician", "Suresh - Plumber", "Kiran - Cleaning", "Ravi - Maintenance"];

function getComplaints() {
  try {
    const value = JSON.parse(localStorage.getItem(KEYS.complaints) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error("Complaint storage could not be read:", error);
    return [];
  }
}
function storeComplaints(items) {
  localStorage.setItem(KEYS.complaints, JSON.stringify(items));
}
function currentStudent() {
  return localStorage.getItem(KEYS.student) || "";
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("studentId").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    if (!id || !password.trim()) {
      message.textContent = "Please enter your Student ID and password.";
      return;
    }
    // Demo only: any non-empty credentials are accepted.
    localStorage.setItem(KEYS.student, id);
    window.location.href = "student-dashboard.html";
  });
}

function initLogout() {
  document.querySelectorAll("[data-logout]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      localStorage.removeItem(KEYS.student);
      window.location.href = "index.html";
    });
  });
}

function initComplaintForm() {
  const form = document.getElementById("complaintForm");
  if (!form) return;
  const studentId = currentStudent();
  if (!studentId) {
    window.location.replace("login.html");
    return;
  }
  const studentIdField = document.getElementById("studentId");
  studentIdField.value = studentId;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const complaint = {
      id: "HC-" + Date.now(),
      studentName: document.getElementById("studentName").value.trim(),
      studentId,
      roomNumber: document.getElementById("roomNumber").value.trim(),
      category: document.getElementById("category").value,
      title: document.getElementById("title").value.trim(),
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value.trim(),
      date: new Date().toLocaleDateString(),
      status: "Pending",
      assignedStaff: "Not Assigned"
    };
    if (!complaint.studentName || !complaint.roomNumber || !complaint.category ||
        !complaint.title || !complaint.priority || !complaint.description) {
      document.getElementById("complaintMessage").textContent = "Please complete all required fields.";
      return;
    }
    const items = getComplaints();
    items.push(complaint);
    storeComplaints(items);
    document.getElementById("complaintMessage").textContent =
      "Complaint submitted successfully. Complaint ID: " + complaint.id;
    form.reset();
    studentIdField.value = studentId;
  });
}

function initStudentDashboard() {
  const table = document.getElementById("complaintTable");
  if (!table) return;
  const id = currentStudent();
  const items = getComplaints().filter(c => (c.studentId || "").toLowerCase() === id.toLowerCase());
  document.getElementById("dashboardStudentId").textContent = id;
  document.getElementById("profileStudentId").textContent = id;
  document.getElementById("totalCount").textContent = items.length;
  document.getElementById("pendingCount").textContent = items.filter(c => c.status === "Pending").length;
  document.getElementById("progressCount").textContent = items.filter(c => c.status === "In Progress").length;
  document.getElementById("resolvedCount").textContent = items.filter(c => c.status === "Resolved" || c.status === "Closed").length;
  table.replaceChildren();
  if (!items.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No complaints submitted yet.";
    row.appendChild(cell);
    table.appendChild(row);
    return;
  }
  items.slice().reverse().forEach(c => {
    const row = document.createElement("tr");
    [c.id, c.title, c.category, c.date, c.status].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value || "-";
      row.appendChild(cell);
    });
    table.appendChild(row);
  });
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value || "-";
  row.appendChild(cell);
}
function makeSelect(values, selected, className) {
  const select = document.createElement("select");
  select.className = className;
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  select.value = values.includes(selected) ? selected : values[0];
  return select;
}

function initAdminDashboard() {
  const table = document.getElementById("adminComplaintList");
  if (!table) return;
  const search = document.getElementById("adminSearch");
  const filter = document.getElementById("adminStatusFilter");
  const empty = document.getElementById("adminEmptyMessage");
  const message = document.getElementById("adminMessage");

  function render() {
    const all = getComplaints();
    document.getElementById("adminTotal").textContent = all.length;
    document.getElementById("adminPending").textContent = all.filter(c => c.status === "Pending").length;
    document.getElementById("adminProgress").textContent = all.filter(c => c.status === "In Progress").length;
    document.getElementById("adminResolved").textContent = all.filter(c => c.status === "Resolved" || c.status === "Closed").length;

    const term = search.value.trim().toLowerCase();
    const visible = all.filter(c => {
      const text = [c.studentName, c.studentId, c.title, c.id].join(" ").toLowerCase();
      return text.includes(term) && (filter.value === "All" || c.status === filter.value);
    });
    table.replaceChildren();
    empty.style.display = visible.length ? "none" : "block";

    visible.slice().reverse().forEach(c => {
      const row = document.createElement("tr");
      row.dataset.complaintId = c.id;
      [c.id, c.studentName, c.studentId, c.roomNumber, c.category, c.title, c.priority].forEach(v => addCell(row, v));
      const staffCell = document.createElement("td");
      staffCell.appendChild(makeSelect(STAFF, c.assignedStaff || "Not Assigned", "staff-select"));
      row.appendChild(staffCell);
      const statusCell = document.createElement("td");
      statusCell.appendChild(makeSelect(["Pending", "In Progress", "Resolved", "Closed"], c.status || "Pending", "status-select"));
      row.appendChild(statusCell);
      const actionCell = document.createElement("td");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "save-complaint";
      button.textContent = "Save";
      actionCell.appendChild(button);
      row.appendChild(actionCell);
      table.appendChild(row);
    });
  }

  table.addEventListener("click", event => {
    if (!event.target.classList.contains("save-complaint")) return;
    const row = event.target.closest("tr");
    const records = getComplaints();
    const record = records.find(c => c.id === row.dataset.complaintId);
    if (!record) return;
    record.assignedStaff = row.querySelector(".staff-select").value;
    record.status = row.querySelector(".status-select").value;
    storeComplaints(records);
    message.textContent = "Complaint " + record.id + " updated successfully.";
    render();
  });
  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  // Protect student-only pages from opening without a demo login.
  if (document.body.dataset.requiresLogin === "student" && !currentStudent()) {
    window.location.replace("login.html");
    return;
  }
  initLogin();
  initLogout();
  initComplaintForm();
  initStudentDashboard();
  initAdminDashboard();
});
