const API_URL = "https://laimserver.duckdns.org/api";

fetch('https://laimserver.duckdns.org/api/ValidarPIN', { credentials: 'include', method: 'GET' })
  .then(res => res.json())
  .then(data => {
    alert(data);
    if (!data.autenticado) {
      window.location.href = "../index.html";
    }
  });



const form = document.getElementById("form-producto");
const cancelarBtn = document.getElementById("cancelar");
const tablaProductos = document.getElementById("tabla-productos");
const categoriaSelect = document.getElementById("categoria");
const categoriaPreview = document.getElementById("categoria-preview");

let productos = [];

// Cargar categorías al iniciar
async function cargarCategorias() {
    try {
        const res = await fetch(`${API_URL}/categorias`, { credentials: 'include' });
        const categorias = await res.json();

        categoriaSelect.innerHTML = "";
        categorias.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.nombre; // fallback, algunos navegadores no muestran <img> en option
            option.dataset.icon = c.imagen; // guardar ruta imagen en dataset
            categoriaSelect.appendChild(option);
        });

        actualizarPreview();
    } catch (err) {
        console.error("❌ Error cargando categorías:", err);
    }
}

function actualizarPreview() {
    const opt = categoriaSelect.selectedOptions[0];
    if (!opt) return;
    const icon = `https://laimserver.duckdns.org${opt.dataset.icon}`;
    if (icon) {
        categoriaPreview.src = icon;
        categoriaPreview.style.display = "inline-block";
    } else {
        categoriaPreview.style.display = "none";
    }
}

categoriaSelect.addEventListener("change", actualizarPreview);

// Cargar productos al iniciar
async function cargarProductos() {
    try {
        const res = await fetch(`${API_URL}/productos`, { credentials: 'include' });
        productos = await res.json();

        tablaProductos.innerHTML = "";
        productos.forEach(p => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>${p.descripcion || ""}</td>
                <td>${p.imagen ? `<img src=https://laimserver.duckdns.org${p.imagen} alt="${p.nombre}" width="100">` : ""}</td>
                <td>
                     ${p.categoria ? `<img src=https://laimserver.duckdns.org${p.categoria.icono} width="30"> ${p.categoria.nombre}` : ""}
                </td>
                <td>
                    <button onclick="editarProducto(${p.id}, '${p.nombre}', ${p.precio}, '${p.descripcion || ""}', '${p.imagen || ""}')">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            `;
            tablaProductos.appendChild(fila);
        });
    } catch (err) {
        console.error("❌ Error cargando productos:", err);
    }
}


// Guardar (crear o editar)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("producto-id").value;

    const formData = new FormData(form); // incluye imagen + datos

    try {
        let res;
        if (id) {
            // Editar producto
            res = await fetch(`${API_URL}/productos/${id}`, {
                credentials: 'include',
                method: "PUT",
                body: formData
            });
        } else {
            // Crear producto
            res = await fetch(`${API_URL}/productos`, {
                credentials: 'include',
                method: "POST",
                body: formData
            });
        }

        if(res.status === 401){
            alert("Sesión expirada. Por favor, ingresa nuevamente.");
            window.location.href = "../index.html";
        }

        const data = await res.json();
        console.log("✅ Respuesta servidor:", data);

        if (res.ok) {
            alert(id ? "Producto actualizado ✅" : "Producto creado ✅");
            form.reset();
            document.getElementById("producto-id").value = "";
            cancelarBtn.style.display = "none";
            cargarProductos();
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (err) {
        console.error("❌ Error en fetch:", err);
    }
});

// Editar producto (rellenar formulario)
window.editarProducto = (id, nombre, precio, descripcion, image, CategoriaId) => {
    const producto = productos.find(p => p.id === id);
    if(!productos) return;

    document.getElementById("producto-id").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("categoria").value = CategoriaId;
    document.getElementById("imagen").value = "";

    let preview = document.getElementById("preview");

    if(!preview){
        preview=document.createElement("img");
        preview.id="preview";
        preview.width =120;
        document.getElementById("form-producto").appendChild(preview);
    }

    if (producto.imagen) {
        preview.src = producto.imagen;   // aquí llega la ruta que guardaste en DB (/imgs/imgP/Chaufa.jpg, etc.)
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
    cancelarBtn.style.display = "inline";
};

// Cancelar edición
cancelarBtn.onclick = () => {
    form.reset();
    document.getElementById("producto-id").value = "";
    cancelarBtn.style.display = "none";
};

// Eliminar producto
window.eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
        const res = await fetch(`${API_URL}/productos/${id}`,
             {credentials:"include" ,method: "DELETE" });
        if(res.status === 401){
            alert("Sesión expirada. Por favor, ingresa nuevamente.");
            window.location.href = "../index.html";
        }
        const data = await res.json();
        console.log("🗑️ Producto eliminado:", data);
        if (res.ok) {
            cargarProductos();
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (err) {
        console.error("❌ Error al eliminar:", err);
    }
};

// Inicial
cargarCategorias();
cargarProductos();
