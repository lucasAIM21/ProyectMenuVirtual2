const btnCategorias = document.getElementById('btn-categorias');
const sidebar = document.getElementById('sidebar');
const cerrarSidebar = document.getElementById('cerrar-sidebar');
const overlay = document.getElementById('overlay');

// Abrir barra lateral
btnCategorias.addEventListener('click', () => {
  sidebar.classList.add('active');
  overlay.classList.add('active');
});

// Cerrar barra lateral
cerrarSidebar.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

// Cerrar si se hace clic fuera
overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});
