// Variables globales
let sidebar, sidebarToggle, mobileMenuBtn, userMenuBtn, userDropdown, overlay, pageTitle, searchInput, logoutBtn;
let currentSection = "dashboard";
let isMobile = window.innerWidth <= 768;
let sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

// Inicializar dashboard
function initDashboard() {
  sidebar = document.getElementById("sidebar");
  sidebarToggle = document.getElementById("sidebarToggle");
  mobileMenuBtn = document.getElementById("mobileMenuBtn");
  userMenuBtn = document.getElementById("userMenuBtn");
  userDropdown = document.getElementById("userDropdown");
  overlay = document.getElementById("overlay");
  pageTitle = document.getElementById("pageTitle");
  searchInput = document.getElementById("searchInput");
  logoutBtn = document.getElementById("logoutBtn");

  setupEventListeners();
  setupNavigation();
  handleResize();
  initializeSidebar();
  setupSearch();
  initializeTheme();
  setupStudentFilters();
}

function setupEventListeners() {
  sidebarToggle?.addEventListener("click", toggleSidebar);
  mobileMenuBtn?.addEventListener("click", toggleMobileSidebar);
  userMenuBtn?.addEventListener("click", e => {
    e.stopPropagation();
    userDropdown?.classList.toggle("show");
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".user-menu")) {
      userDropdown?.classList.remove("show");
    }
  });
  overlay?.addEventListener("click", closeMobileSidebar);
  logoutBtn?.addEventListener("click", e => {
    e.preventDefault();
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cerrando sesión...",
          timer: 1200,
          showConfirmButton: false,
          allowOutsideClick: false
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1300);
      }
    });
  });
  window.addEventListener("resize", handleResize);
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") searchInput?.focus();
    if (e.key === "Escape") closeMobileSidebar();
    if ((e.ctrlKey || e.metaKey) && e.key === "b") toggleSidebar();
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach(link => {
    const section = link.dataset.section;
    if (section && section !== "#") {
      link.addEventListener("click", e => {
        e.preventDefault();
        navigateToSection(section);
      });
    }
    // Si no tiene data-section, deja que se maneje como redirección normal
  });
}

function navigateToSection(section) {
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
  document.querySelector(`[data-section="${section}"]`)?.classList.add("active");

  document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`${section}-section`)?.classList.add("active");

  const titles = {
    students: "Gestión de Estudiantes",
    teachers: "Gestión de Profesores",
    courses: "Gestión de Cursos",
    reports: "Reportes",
  };
  pageTitle.textContent = titles[section] || "Panel";
  currentSection = section;
  if (isMobile) closeMobileSidebar();
}

function toggleSidebar() {
  if (isMobile) {
    toggleMobileSidebar();
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle("collapsed", sidebarCollapsed);
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed);
  }
}

function toggleMobileSidebar() {
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("show");
  document.body.style.overflow = sidebar.classList.contains("mobile-open") ? "hidden" : "";
}

function closeMobileSidebar() {
  sidebar.classList.remove("mobile-open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function handleResize() {
  const wasMobile = isMobile;
  isMobile = window.innerWidth <= 768;
  if (wasMobile !== isMobile) {
    if (isMobile) {
      sidebar.classList.remove("collapsed");
      closeMobileSidebar();
    } else {
      sidebar.classList.remove("mobile-open");
      overlay.classList.remove("show");
      if (sidebarCollapsed) sidebar.classList.add("collapsed");
    }
  }
}

function initializeSidebar() {
  if (!isMobile && sidebarCollapsed) {
    sidebar.classList.add("collapsed");
  }
}

function setupSearch() {
  if (searchInput) {
    searchInput.addEventListener("input", debounce(e => {
      const query = e.target.value.trim();
      if (query) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: `Buscando: ${query}`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    }, 300));
  }
}

function initializeTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setupStudentFilters() {
  const studentSearch = document.getElementById("studentSearch");
  const gradeFilter = document.getElementById("gradeFilter");
  const careerFilter = document.getElementById("careerFilter");
  const rows = document.querySelectorAll("#studentsTable tbody tr");

  function filter() {
    const search = studentSearch?.value.toLowerCase() || "";
    const grade = gradeFilter?.value || "";
    const career = careerFilter?.value.toLowerCase() || "";

    rows.forEach(row => {
      const name = row.cells[0].textContent.toLowerCase(); 
      const email = row.cells[1].textContent.toLowerCase();
      const studentCareer = row.cells[2].textContent.toLowerCase();
      const studentGrade = row.cells[3].textContent;

      const matchesSearch = name.includes(search) || email.includes(search);
      const matchesGrade = !grade || studentGrade.includes(grade);
      const matchesCareer = !career || studentCareer.includes(career);

      row.style.display = matchesSearch && matchesGrade && matchesCareer ? "" : "none";
    });
  }

  studentSearch?.addEventListener("input", debounce(filter, 300));
  gradeFilter?.addEventListener("change", filter);
  careerFilter?.addEventListener("input", debounce(filter, 300));
}

// Ver información del estudiante
function verEstudiante(id) {
  const row = [...document.querySelectorAll("#studentsTable tbody tr")].find(r => {
    const viewBtn = r.querySelector('button[onclick*="verEstudiante"]');
    return viewBtn && viewBtn.getAttribute('onclick').includes(id);
  });

  if (!row) {
    Swal.fire({
      title: "Error",
      text: "No se encontró el estudiante",
      icon: "error"
    });
    return;
  }

  const nombre = row.cells[0].textContent.trim();
  const email = row.cells[1].textContent.trim();
  const especialidad = row.cells[2].textContent.trim();
  const semestre = row.cells[3].textContent.trim();
  const estado = row.cells[4].textContent.trim();
  
  // Obtener los datos del atributo data-info (ahora está en el tr, no en una celda)
  const infoPersonal = JSON.parse(row.getAttribute('data-info') || '{}');

  // Extraer la estructura de datos que esperas
  const direccion = infoPersonal.direccion || {};
  const nacimiento = infoPersonal.nacimiento || {};
  const bachillerato = infoPersonal.bachillerato || {};

  const infoHTML = `
    <div style="text-align: left; max-width: 500px; margin: 0 auto;">
      <h4 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">
        📋 Información Básica
      </h4>
      <p><strong>📧 Email:</strong> ${email}</p>
      <p><strong>🎓 Especialidad:</strong> ${especialidad}</p>
      <p><strong>📚 Semestre:</strong> ${semestre}</p>
      <p><strong>📊 Estado:</strong> ${estado}</p>

      <h4 style="color: #333; margin: 20px 0 15px 0; border-bottom: 2px solid #28a745; padding-bottom: 5px;">
        🏠 Dirección
      </h4>
      <p><strong>Estado:</strong> ${direccion.estado || 'No especificado'}</p>
      <p><strong>Ciudad:</strong> ${direccion.ciudad || 'No especificado'}</p>
      <p><strong>Dirección:</strong> ${direccion.direccion_exacta || 'No especificado'}</p>

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
    title: `👨‍🎓 ${nombre}`,
    html: infoHTML,
    confirmButtonText: "Cerrar",
    width: '600px',
    customClass: {
      popup: 'student-details-popup'
    }
  });
}

function editarEstudiante(id) {
  Swal.fire({
    title: "Editar Estudiante",
    text: `Editando estudiante con ID: ${id}`,
    icon: "info",
    confirmButtonText: "OK"
  });
}

function eliminarEstudiante(id) {
  Swal.fire({
    title: "¿Eliminar estudiante?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545"
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Eliminado",
        text: `Estudiante con ID ${id} eliminado`,
        icon: "success"
      });
    }
  });
}

// Inicializar
document.addEventListener("DOMContentLoaded", initDashboard);
