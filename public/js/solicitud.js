// Variables globales
let solicitudesData = [];
let filteredData = [];
let carreras = [];

const searchNameInput = document.getElementById("searchName");
const filterCarreraSelect = document.getElementById("filterCarrera");
const tableBody = document.getElementById("tableBody");
const recordCount = document.getElementById("recordCount");
const loadingContainer = document.getElementById("loadingContainer");
const tableContainer = document.getElementById("tableContainer");

const Swal = window.Swal;
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    loadSolicitudes();
});

function setupEventListeners() {
    searchNameInput.addEventListener("input", debounce(filterData, 300));
    filterCarreraSelect.addEventListener("change", filterData);

    const clearBtn = document.querySelector(".btn-clear");
    if (clearBtn) clearBtn.addEventListener("click", clearFilters);

    const refreshBtn = document.querySelector(".btn-refresh");
    if (refreshBtn) refreshBtn.addEventListener("click", loadSolicitudes);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function loadSolicitudes() {
    try {
        showLoading(true);

        const rows = tableBody.querySelectorAll("tr");
        solicitudesData = Array.from(rows).map(row => {
        let infoPersonal = {};
        try {
            infoPersonal = JSON.parse(row.getAttribute("data-info") || '{}');
        } catch (err) {
            infoPersonal = {};
        }

        const cells = row.querySelectorAll("td");

        return {
            id: row.getAttribute("data-id"),
            cedula: cells[0].textContent.trim(),
            nombre: cells[1].textContent.trim(),
            email: cells[2].textContent.trim(),
            especialidad: cells[3].textContent.trim(),
            grado: cells[4].textContent.trim(),
            estado: cells[5].querySelector(".status-badge").textContent.trim(),
            infoPersonal
        };
        });

        loadCarreras();
        filterData();
        showLoading(false);
    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        showError("Error al cargar las solicitudes. Verifica que la tabla esté correctamente cargada.");
        showLoading(false);
    }
}

function loadCarreras() {
    const especialidades = [...new Set(solicitudesData.map(item => item.especialidad))];
    carreras = especialidades.map((nombre, index) => ({ id: index + 1, nombre }));
    updateCarrerasSelect();
}

function updateCarrerasSelect() {
    const defaultOption = '<option value="">Todas las carreras</option>';
    const carrerasOptions = carreras.map(carrera => 
        `<option value="${carrera.nombre}">${carrera.nombre}</option>`
    ).join("");

    filterCarreraSelect.innerHTML = defaultOption + carrerasOptions;
}

function showLoading(show) {
    loadingContainer.style.display = show ? "flex" : "none";
    tableContainer.style.display = show ? "none" : "block";
}

function showError(message) {
    tableBody.innerHTML = `
        <tr>
        <td colspan="7" class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <div>${message}</div>
            <button class="btn btn-refresh" onclick="loadSolicitudes()" style="margin-top: 15px;">
            <i class="fas fa-sync-alt"></i> Reintentar
            </button>
        </td>
        </tr>
    `;
}

function filterData() {
    const searchTerm = searchNameInput.value.toLowerCase().trim();
    const selectedCarrera = filterCarreraSelect.value;

    filteredData = solicitudesData.filter(s => {
        const matchSearch = searchTerm === "" || 
        s.nombre.toLowerCase().includes(searchTerm) || 
        s.cedula.toLowerCase().includes(searchTerm);
        const matchCarrera = selectedCarrera === "" || s.especialidad === selectedCarrera;
        return matchSearch && matchCarrera;
    });

    renderTable();
}

function renderTable() {
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="no-results">
            <i class="fas fa-search"></i>
            <div>No se encontraron coincidencias</div>
            </td>
        </tr>
        `;
    } else {
        tableBody.innerHTML = filteredData.map(s => `
        <tr data-id="${s.id}" data-info='${JSON.stringify(s.infoPersonal)}'>
            <td>${s.cedula}</td>
            <td>${s.nombre}</td>
            <td>${s.email}</td>
            <td>${s.especialidad}</td>
            <td><span class="status-badge ${s.estado.toLowerCase()}">${s.estado}</span></td>
            <td>
            <div class="action-buttons">
                <button class="btn-icon view" onclick="verEstudiante('${s.id}')"><i class="fas fa-eye"></i></button>
                ${s.estado.toUpperCase() === "PENDIENTE" ? `
                <button class="btn-icon edit" onclick="aprobarEstudiante('${s.id}')"><i class="fas fa-check"></i></button>
                ` : ""}
                <button class="btn-icon delete" onclick="eliminarEstudiante('${s.id}', '${s.nombre.replace(/'/g, "\\'")}')">
                <i class="fas fa-trash"></i>
                </button>
            </div>
            </td>
        </tr>
        `).join('');
    }

    updateRecordCount();
}

function updateRecordCount() {
    recordCount.textContent = `Mostrando ${filteredData.length} de ${solicitudesData.length} solicitudes`;
}

function clearFilters() {
    searchNameInput.value = "";
    filterCarreraSelect.value = "";
    filterData();
    Toast.fire({ icon: "info", title: "Filtros limpiados" });
}

function verEstudiante(id) {
    const row = [...document.querySelectorAll("#tableBody tr")].find(r => {
        return r.getAttribute("data-id") === id;
    });

    if (!row) {
        Swal.fire({
        title: "Error",
        text: "No se encontró el estudiante",
        icon: "error"
        });
        return;
    }

    const cells = row.querySelectorAll("td");
    const cedula = cells[0]?.textContent.trim() || 'No disponible';
    const nombre = cells[1]?.textContent.trim() || 'No disponible';
    const email = cells[2]?.textContent.trim() || 'No disponible';
    const especialidad = cells[3]?.textContent.trim() || 'No disponible';
    const grado = cells[4]?.textContent.trim() || 'No disponible';
    const estado = cells[5]?.textContent.trim() || 'No disponible';

    let infoPersonal = {};
    try {
        infoPersonal = JSON.parse(row.getAttribute('data-info') || '{}');
    } catch (e) {
        infoPersonal = {};
    }

    const direccion = infoPersonal.direccion || {};
    const nacimiento = infoPersonal.nacimiento || {};
    const bachillerato = infoPersonal.bachillerato || {};

    const infoHTML = `
        <div style="text-align: left; max-width: 600px; margin: 0 auto;">
        <h4 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">
            📋 Información Básica
        </h4>
        <p><strong>🆔 Cédula:</strong> ${cedula}</p>
        <p><strong>📛 Nombre:</strong> ${nombre}</p>
        <p><strong>📧 Email:</strong> ${email}</p>
        <p><strong>🎓 Especialidad:</strong> ${especialidad}</p>
        <p><strong>📚 Semestre:</strong> ${grado}</p>
        <p><strong>📊 Estado:</strong> ${estado}</p>

        <h4 style="color: #333; margin: 20px 0 15px 0; border-bottom: 2px solid #28a745; padding-bottom: 5px;">
            🏠 Dirección
        </h4>
        <p><strong>Estado:</strong> ${direccion.estado || 'No especificado'}</p>
        <p><strong>Ciudad:</strong> ${direccion.ciudad || 'No especificado'}</p>
        <p><strong>Dirección exacta:</strong> ${direccion.direccion_exacta || 'No especificado'}</p>

        <h4 style="color: #333; margin: 20px 0 15px 0; border-bottom: 2px solid #ffc107; padding-bottom: 5px;">
            🎂 Información de Nacimiento
        </h4>
        <p><strong>Fecha:</strong> ${nacimiento.fecha || 'No especificado'}</p>
        <p><strong>Edad:</strong> ${nacimiento.edad || 'No especificado'} años</p>
        <p><strong>Lugar:</strong> ${nacimiento.lugar || 'No especificado'}</p>

        <h4 style="color: #333; margin: 20px 0 15px 0; border-bottom: 2px solid #dc3545; padding-bottom: 5px;">
            🎓 Bachillerato
        </h4>
        <p><strong>Institución:</strong> ${bachillerato.institucion || 'No especificado'}</p>
        <p><strong>Año de graduación:</strong> ${bachillerato.año_graduacion || 'No especificado'}</p>
        <p><strong>Título obtenido:</strong> ${bachillerato.titulo_obtenido || 'No especificado'}</p>
        </div>
    `;

    Swal.fire({
        title: `👨‍🎓 Detalles de ${nombre}`,
        html: infoHTML,
        width: '650px',
        confirmButtonText: "Cerrar",
        customClass: {
        popup: 'student-details-popup'
        }
    });
}
