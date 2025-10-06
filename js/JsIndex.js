const pinDisplay = document.getElementById("pin-display");
const keys = document.querySelectorAll(".key");
let pin = "";

// Actualiza el display con círculos
function updateDisplay() {
  if (pin.length === 0) {
    pinDisplay.textContent = "----";
  } else {
    pinDisplay.textContent = "●".repeat(pin.length);
  }
}

// Eventos de teclas
keys.forEach(key => {
  key.addEventListener("click", () => {
    const value = key.textContent;

    if (key.id === "clear") {
      pin = pin.slice(0, -1);
    } else if (key.id === "enter") {
      validarPIN(pin);
    } else {
      if (pin.length < 6) { // máximo 6 dígitos
        pin += value;
      }
    }
    updateDisplay();
  });
});

// Funcion de validacion
function validarPIN(PIN){
    try {
        fetch('https://laimserver.duckdns.org/api/ValidarPIN', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ pin: PIN })
        }).then(res => res.json()).then(data=>{
            if(data.success){
                alert("ingreso correcto");
                window.location.href = "/views/Adm.html";
            }else{
                alert("ingreso incorreto");
                pin = "";
                updateDisplay();
            }
        }).catch(error => console.error("error en :", error));

    
    }catch (error) {
        console.error("Error al validar el PIN:", error);
    }
}