let cuentas = [];
let totalPagar = 0;
let totalPagado = 0;

function agregarCuenta() {
    const nombre = document.getElementById('nombre-cuenta').value;
    const monto = parseInt(document.getElementById('monto').value);
    const fechaVencimiento = document.getElementById('fecha-vencimiento').value;

    if (nombre.trim() === '' || isNaN(monto) || fechaVencimiento === '') {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const cuenta = {
        id: Date.now(),
        nombre,
        monto,
        fechaVencimiento,
        pagada: false
    };

    cuentas.push(cuenta);
    actualizarTotalPagar(monto);
    actualizarListaCuentas();
    limpiarFormulario();
}

function actualizarTotalPagar(monto) {
    totalPagar += monto;
    document.getElementById('total-pagar').textContent = totalPagar.toLocaleString('es-CL');
}

function actualizarListaCuentas() {
    const listaCuentas = document.getElementById('lista-cuentas');
    listaCuentas.innerHTML = '';
    
    cuentas.forEach(cuenta => {
        const li = document.createElement('li');
        li.classList.add(obtenerClaseCuenta(cuenta));
        li.innerHTML = `
            <span>${cuenta.nombre} - $${cuenta.monto.toLocaleString('es-CL')} - Vence: ${cuenta.fechaVencimiento}</span>
            <div>
                <button onclick="togglePagada(${cuenta.id})">${cuenta.pagada ? 'Desmarcar' : 'Marcar'} como pagada</button>
                <button onclick="eliminarCuenta(${cuenta.id})">Eliminar</button>
            </div>
        `;
        listaCuentas.appendChild(li);
    });
}

function togglePagada(id) {
    const cuenta = cuentas.find(c => c.id === id);
    if (cuenta) {
        cuenta.pagada = !cuenta.pagada;
        if (cuenta.pagada) {
            totalPagar -= cuenta.monto;
            totalPagado += cuenta.monto;
        } else {
            totalPagar += cuenta.monto;
            totalPagado -= cuenta.monto;
        }
        document.getElementById('total-pagar').textContent = totalPagar.toLocaleString('es-CL');
        document.getElementById('total-pagado').textContent = totalPagado.toLocaleString('es-CL');
        actualizarListaCuentas();
    }
}

function eliminarCuenta(id) {
    const index = cuentas.findIndex(c => c.id === id);
    if (index !== -1) {
        const cuenta = cuentas[index];
        if (!cuenta.pagada) {
            totalPagar -= cuenta.monto;
        } else {
            totalPagado -= cuenta.monto;
        }
        cuentas.splice(index, 1);
        document.getElementById('total-pagar').textContent = totalPagar.toLocaleString('es-CL');
        document.getElementById('total-pagado').textContent = totalPagado.toLocaleString('es-CL');
        actualizarListaCuentas();
    }
}

function obtenerClaseCuenta(cuenta) {
    const hoy = new Date();
    const fechaVencimiento = new Date(cuenta.fechaVencimiento);
    const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (cuenta.pagada) {
        return 'pagada';
    } else if (diferenciaDias <= 3 && diferenciaDias > 0) {
        return 'por-vencer';
    } else if (diferenciaDias <= 0) {
        return 'vencida';
    }
    return '';
}

function limpiarFormulario() {
    document.getElementById('nombre-cuenta').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('fecha-vencimiento').value = '';
}

// Verificar cuentas por vencer cada día
setInterval(() => {
    const cuentasPorVencer = cuentas.filter(cuenta => {
        const hoy = new Date();
        const fechaVencimiento = new Date(cuenta.fechaVencimiento);
        const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
        return !cuenta.pagada && diferenciaDias <= 3 && diferenciaDias > 0;
    });

    if (cuentasPorVencer.length > 0) {
        alert(`Tienes ${cuentasPorVencer.length} cuenta(s) por vencer en los próximos 3 días.`);
    }
}, 86400000); // Verificar cada 24 horas