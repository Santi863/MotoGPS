// Inicialización del mapa
let map = L.map('map').setView([4.7110, -74.0721], 6); // Colombia
let routeLayer = null;
let mechanicsLayer = L.layerGroup().addTo(map);
let currentLocation = null;

// Añadir tiles del mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Clase para implementar algoritmo de Dijkstra
class Graph {
    constructor() {
        this.vertices = {};
    }

    addVertex(vertex) {
        if (!this.vertices[vertex]) {
            this.vertices[vertex] = {};
        }
    }

    addEdge(vertex1, vertex2, weight) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        this.vertices[vertex1][vertex2] = weight;
        this.vertices[vertex2][vertex1] = weight;
    }

    dijkstra(start, end) {
        const distances = {};
        const previous = {};
        const unvisited = new Set();

        // Inicializar distancias
        for (let vertex in this.vertices) {
            distances[vertex] = vertex === start ? 0 : Infinity;
            previous[vertex] = null;
            unvisited.add(vertex);
        }

        while (unvisited.size > 0) {
            // Encontrar el vértice no visitado con menor distancia
            let current = null;
            for (let vertex of unvisited) {
                if (current === null || distances[vertex] < distances[current]) {
                    current = vertex;
                }
            }

            if (current === end) break;
            if (distances[current] === Infinity) break;

            unvisited.delete(current);

            // Actualizar distancias de vecinos
            for (let neighbor in this.vertices[current]) {
                if (unvisited.has(neighbor)) {
                    const alt = distances[current] + this.vertices[current][neighbor];
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = current;
                    }
                }
            }
        }

        // Reconstruir ruta
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }

        return {
            distance: distances[end],
            path: path
        };
    }
}

// Datos simulados de mecánicos en Colombia
let mecanicos = [
    { id: 1, nombre: "Taller Moto Sport", lat: 4.7110, lng: -74.0721, especialidad: "Reparación General", telefono: "321-555-0101", ciudad: "bogota" },
    { id: 2, nombre: "Mecánica Los Andes", lat: 6.2442, lng: -75.5812, especialidad: "Motores", telefono: "304-555-0102", ciudad: "medellin" },
    { id: 3, nombre: "Servicio Técnico Bogotá", lat: 4.6097, lng: -74.0817, especialidad: "Eléctrico", telefono: "315-555-0103", ciudad: "bogota" },
    { id: 4, nombre: "Taller Cali Motos", lat: 3.4516, lng: -76.5320, especialidad: "Transmisión", telefono: "318-555-0104", ciudad: "cali" },
    { id: 5, nombre: "Mecánica Cartagena", lat: 10.3910, lng: -75.4794, especialidad: "Frenos", telefono: "300-555-0105", ciudad: "cartagena" },
    { id: 6, nombre: "Taller Bucaramanga", lat: 7.1193, lng: -73.1227, especialidad: "Suspensión", telefono: "312-555-0106", ciudad: "bucaramanga" },
    { id: 7, nombre: "Motos del Valle", lat: 3.8703, lng: -76.2900, especialidad: "Reparación General", telefono: "317-555-0107", ciudad: "cali" },
    { id: 8, nombre: "Serviteca Paisa", lat: 6.2518, lng: -75.5636, especialidad: "Llantas", telefono: "314-555-0108", ciudad: "medellin" }
];

// Datos completos de ciudades colombianas
const ciudades = {
    'bogota': { name: 'Bogotá', lat: 4.7110, lng: -74.0721 },
    'medellin': { name: 'Medellín', lat: 6.2442, lng: -75.5812 },
    'cali': { name: 'Cali', lat: 3.4516, lng: -76.5320 },
    'cartagena': { name: 'Cartagena', lat: 10.3910, lng: -75.4794 },
    'barranquilla': { name: 'Barranquilla', lat: 10.9639, lng: -74.7964 },
    'bucaramanga': { name: 'Bucaramanga', lat: 7.1193, lng: -73.1227 },
    'pereira': { name: 'Pereira', lat: 4.8133, lng: -75.6961 },
    'manizales': { name: 'Manizales', lat: 5.0670, lng: -75.5174 },
    'ibague': { name: 'Ibagué', lat: 4.4389, lng: -75.2322 },
    'cucuta': { name: 'Cúcuta', lat: 7.8939, lng: -72.5078 },
    'villavicencio': { name: 'Villavicencio', lat: 4.1420, lng: -73.6266 },
    'neiva': { name: 'Neiva', lat: 2.9273, lng: -75.2819 },
    'pasto': { name: 'Pasto', lat: 1.2136, lng: -77.2811 },
    'monteria': { name: 'Montería', lat: 8.7479, lng: -75.8814 },
    'valledupar': { name: 'Valledupar', lat: 10.4631, lng: -73.2532 },
    'popayan': { name: 'Popayán', lat: 2.4448, lng: -76.6147 }
};

// Variable global para almacenar las rutas
let conexiones = [
    ['bogota', 'medellin', 415],
    ['bogota', 'cali', 462],
    ['bogota', 'bucaramanga', 384],
    ['bogota', 'ibague', 203],
    ['bogota', 'villavicencio', 117],
    ['bogota', 'neiva', 344],
    ['medellin', 'cali', 420],
    ['medellin', 'cartagena', 461],
    ['medellin', 'pereira', 166],
    ['medellin', 'manizales', 65],
    ['medellin', 'monteria', 275],
    ['cartagena', 'barranquilla', 106],
    ['cartagena', 'valledupar', 295],
    ['barranquilla', 'valledupar', 167],
    ['pereira', 'cali', 166],
    ['pereira', 'manizales', 52],
    ['manizales', 'ibague', 109],
    ['bucaramanga', 'cucuta', 195],
    ['cali', 'pasto', 285],
    ['cali', 'neiva', 269],
    ['cali', 'popayan', 120],
    ['popayan', 'pasto', 165],
    ['villavicencio', 'neiva', 242],
    ['ibague', 'neiva', 148]
];

// Función para actualizar los selectores de ciudad en el formulario
function actualizarSelectoresCiudad() {
    const selects = [
        document.getElementById('ciudadOrigen'),
        document.getElementById('ciudadDestino'),
        document.getElementById('ciudadMecanico'),
        document.getElementById('rutaCiudadOrigen'),
        document.getElementById('rutaCiudadDestino')
    ];

    selects.forEach(select => {
        if (!select) return;

        // Guardar el valor actual seleccionado
        const selectedValue = select.value;

        // Limpiar opciones (excepto la primera opción por defecto)
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Agregar todas las ciudades
        for (const [id, ciudad] of Object.entries(ciudades)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = ciudad.name;
            select.appendChild(option);
        }

        // Restaurar la selección anterior si aún existe
        if (ciudades[selectedValue]) {
            select.value = selectedValue;
        }
    });
}

// Función para añadir una nueva ciudad
function agregarCiudad(id, nombre, lat, lng) {
    // Validar que la ciudad no exista ya
    if (ciudades[id]) {
        console.warn(`La ciudad con ID ${id} ya existe`);
        return false;
    }

    // Validar coordenadas
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert('Coordenadas inválidas. Latitud debe estar entre -90 y 90, Longitud entre -180 y 180');
        return false;
    }

    // Agregar la nueva ciudad
    ciudades[id] = {
        name: nombre,
        lat: lat,
        lng: lng
    };

    // Actualizar los selectores
    actualizarSelectoresCiudad();

    console.log(`Ciudad ${nombre} agregada exitosamente`);
    return true;
}

// Función para agregar ciudad desde el formulario
function agregarCiudadDesdeFormulario() {
    const id = document.getElementById('nuevaCiudadId').value.trim();
    const nombre = document.getElementById('nuevaCiudadNombre').value.trim();
    const lat = parseFloat(document.getElementById('nuevaCiudadLat').value);
    const lng = parseFloat(document.getElementById('nuevaCiudadLng').value);

    // Validaciones
    if (!id || !nombre || isNaN(lat) || isNaN(lng)) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }

    if (ciudades[id]) {
        alert('Ya existe una ciudad con ese ID');
        return;
    }

    // Agregar la ciudad
    const agregada = agregarCiudad(id, nombre, lat, lng);

    if (agregada) {
        // Limpiar formulario
        document.getElementById('nuevaCiudadId').value = '';
        document.getElementById('nuevaCiudadNombre').value = '';
        document.getElementById('nuevaCiudadLat').value = '';
        document.getElementById('nuevaCiudadLng').value = '';

        updateStatus(`Ciudad "${nombre}" agregada exitosamente`);
    }
}

// Función para agregar ruta desde el formulario
function agregarRutaDesdeFormulario() {
    const ciudadOrigen = document.getElementById('rutaCiudadOrigen').value;
    const ciudadDestino = document.getElementById('rutaCiudadDestino').value;
    const distancia = parseFloat(document.getElementById('rutaDistancia').value);
    const tipo = document.getElementById('rutaTipo').value;

    // Validaciones
    if (!ciudadOrigen || !ciudadDestino) {
        alert('Por favor selecciona ciudades de origen y destino');
        return;
    }

    if (ciudadOrigen === ciudadDestino) {
        alert('La ciudad de origen y destino no pueden ser la misma');
        return;
    }

    if (isNaN(distancia) || distancia <= 0) {
        alert('Por favor ingresa una distancia válida');
        return;
    }

    // Verificar si la ruta ya existe
    const rutaExistente = conexiones.find(conexion =>
        (conexion[0] === ciudadOrigen && conexion[1] === ciudadDestino) ||
        (conexion[0] === ciudadDestino && conexion[1] === ciudadOrigen)
    );

    if (rutaExistente) {
        if (!confirm('Esta ruta ya existe. ¿Deseas actualizar la distancia?')) {
            return;
        }
        // Actualizar la distancia existente
        rutaExistente[2] = distancia;
    } else {
        // Agregar nueva ruta (en ambos sentidos)
        conexiones.push([ciudadOrigen, ciudadDestino, distancia]);
        conexiones.push([ciudadDestino, ciudadOrigen, distancia]); // Ruta bidireccional
    }

    // Limpiar formulario
    document.getElementById('rutaDistancia').value = '';

    updateStatus(`Ruta entre ${ciudades[ciudadOrigen].name} y ${ciudades[ciudadDestino].name} agregada (${distancia} km)`);

    // Si hay una ruta mostrada, recalcular para ver cambios
    if (routeLayer) {
        setTimeout(() => {
            calcularRuta();
        }, 500);
    }
}

// Función para obtener ubicación actual
function obtenerUbicacion() {
    updateStatus("Obteniendo ubicación...");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setView([currentLocation.lat, currentLocation.lng], 13);

                L.marker([currentLocation.lat, currentLocation.lng])
                    .addTo(map)
                    .bindPopup("📍 Tu ubicación actual")
                    .openPopup();

                updateStatus("Ubicación obtenida");

                // Buscar mecánicos automáticamente
                buscarMecanicos();
            },
            function (error) {
                updateStatus("Error al obtener ubicación");
                alert("No se pudo obtener tu ubicación. Por favor, ingresa manualmente el origen.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

// Función para calcular distancia entre dos puntos
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Función para buscar mecánicos cercanos
function buscarMecanicos() {
    const radio = parseInt(document.getElementById('radioMecanicos').value);
    const mecanicosList = document.getElementById('mecanicosList');

    if (!currentLocation) {
        mecanicosList.innerHTML = '<div class="loading">Primero obtén tu ubicación</div>';
        return;
    }

    updateStatus("Buscando mecánicos...");

    // Filtrar mecánicos por distancia
    const mecanicosCercanos = mecanicos
        .map(mecanico => ({
            ...mecanico,
            distancia: calcularDistancia(currentLocation.lat, currentLocation.lng, mecanico.lat, mecanico.lng)
        }))
        .filter(mecanico => mecanico.distancia <= radio)
        .sort((a, b) => a.distancia - b.distancia);

    // Limpiar marcadores anteriores
    mechanicsLayer.clearLayers();

    // Mostrar mecánicos en el mapa
    mecanicosCercanos.forEach(mecanico => {
        const marker = L.marker([mecanico.lat, mecanico.lng], {
            icon: L.divIcon({
                html: '🔧',
                className: 'custom-icon',
                iconSize: [20, 20]
            })
        });

        marker.bindPopup(`
            <strong>${mecanico.nombre}</strong><br>
            Especialidad: ${mecanico.especialidad}<br>
            Teléfono: ${mecanico.telefono}<br>
            Distancia: ${mecanico.distancia.toFixed(1)} km
        `);

        mechanicsLayer.addLayer(marker);
    });

    // Mostrar lista de mecánicos
    if (mecanicosCercanos.length > 0) {
        mecanicosList.innerHTML = mecanicosCercanos
            .map(mecanico => `
                <div class="mechanic-card">
                    <div class="mechanic-name">${mecanico.nombre}</div>
                    <div>Especialidad: ${mecanico.especialidad}</div>
                    <div>Teléfono: ${mecanico.telefono}</div>
                    <div class="mechanic-distance">📍 ${mecanico.distancia.toFixed(1)} km</div>
                </div>
            `)
            .join('');

        updateStatus(`${mecanicosCercanos.length} mecánicos encontrados`);
    } else {
        mecanicosList.innerHTML = '<div class="loading">No hay mecánicos en el radio seleccionado</div>';
        updateStatus("No se encontraron mecánicos");
    }
}

// Función para agregar un nuevo mecánico
function agregarMecanico() {
    const nombre = document.getElementById('nombreTaller').value.trim();
    const ciudad = document.getElementById('ciudadMecanico').value;
    const especialidad = document.getElementById('especialidadMecanico').value;
    const telefono = document.getElementById('telefonoMecanico').value.trim();

    // Validaciones
    if (!nombre) {
        alert('Por favor, ingresa el nombre del taller');
        return;
    }

    if (!ciudad) {
        alert('Por favor, selecciona una ciudad');
        return;
    }

    if (!telefono) {
        alert('Por favor, ingresa el número de teléfono');
        return;
    }

    // Validar formato de teléfono (básico)
    const telefonoRegex = /^[0-9\-\s\+\(\)]+$/;
    if (!telefonoRegex.test(telefono)) {
        alert('Por favor, ingresa un teléfono válido');
        return;
    }

    // Obtener coordenadas de la ciudad seleccionada
    const coordenadas = ciudades[ciudad];
    if (!coordenadas) {
        alert('Error: Ciudad no encontrada');
        return;
    }

    // Generar variación pequeña en las coordenadas para simular ubicación exacta del taller
    const lat = coordenadas.lat + (Math.random() - 0.5) * 0.1;
    const lng = coordenadas.lng + (Math.random() - 0.5) * 0.1;

    // Crear nuevo mecánico
    const nuevoMecanico = {
        id: mecanicos.length + 1,
        nombre: nombre,
        lat: lat,
        lng: lng,
        especialidad: especialidad,
        telefono: telefono,
        ciudad: ciudad
    };

    // Agregar a la lista
    mecanicos.push(nuevoMecanico);

    // Agregar marcador al mapa
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            html: '🔧',
            className: 'custom-icon',
            iconSize: [20, 20]
        })
    });

    marker.bindPopup(`
        <strong>${nombre}</strong><br>
        Especialidad: ${especialidad}<br>
        Teléfono: ${telefono}<br>
        Ciudad: ${ciudades[ciudad].name}<br>
        <em>Recién agregado</em>
    `);

    mechanicsLayer.addLayer(marker);

    // Limpiar formulario
    document.getElementById('nombreTaller').value = '';
    document.getElementById('ciudadMecanico').value = '';
    document.getElementById('especialidadMecanico').value = 'Reparación General';
    document.getElementById('telefonoMecanico').value = '';

    // Centrar mapa en el nuevo mecánico
    map.setView([lat, lng], 12);
    marker.openPopup();

    updateStatus(`Mecánico "${nombre}" agregado exitosamente`);

    // Actualizar lista de mecánicos si hay una búsqueda activa
    if (currentLocation) {
        setTimeout(() => {
            buscarMecanicos();
        }, 500);
    }
}

// Función para calcular ruta usando algoritmo de grafos
async function calcularRuta() {
    const ciudadOrigen = document.getElementById('ciudadOrigen').value;
    const ciudadDestino = document.getElementById('ciudadDestino').value;
    const tipoRuta = document.getElementById('tipoRuta').value;

    if (!ciudadOrigen || !ciudadDestino) {
        alert('Por favor, selecciona ciudad de origen y destino');
        return;
    }

    if (ciudadOrigen === ciudadDestino) {
        alert('La ciudad de origen y destino no pueden ser la misma');
        return;
    }

    updateStatus("Calculando ruta óptima...");

    try {
        // Crear grafo con todas las ciudades
        const graph = new Graph();

        // Agregar todas las conexiones al grafo
        conexiones.forEach(([ciudad1, ciudad2, distancia]) => {
            graph.addEdge(ciudad1, ciudad2, distancia);
        });

        // Calcular ruta óptima
        const resultado = graph.dijkstra(ciudadOrigen, ciudadDestino);

        if (resultado.distance === Infinity) {
            alert('No se encontró una ruta entre las ciudades seleccionadas');
            updateStatus("No se pudo calcular la ruta");
            return;
        }

        // Mostrar ruta en el mapa
        if (routeLayer) {
            map.removeLayer(routeLayer);
        }

        const coordenadas = resultado.path.map(ciudad => [ciudades[ciudad].lat, ciudades[ciudad].lng]);
        routeLayer = L.polyline(coordenadas, {
            color: '#4f46e5',
            weight: 5,
            opacity: 0.8
        }).addTo(map);

        // Agregar marcadores para origen y destino
        L.marker([ciudades[ciudadOrigen].lat, ciudades[ciudadOrigen].lng], {
            icon: L.divIcon({
                html: '🏁',
                className: 'custom-icon',
                iconSize: [25, 25]
            })
        }).addTo(map).bindPopup(`Origen: ${ciudades[ciudadOrigen].name}`);

        L.marker([ciudades[ciudadDestino].lat, ciudades[ciudadDestino].lng], {
            icon: L.divIcon({
                html: '🏆',
                className: 'custom-icon',
                iconSize: [25, 25]
            })
        }).addTo(map).bindPopup(`Destino: ${ciudades[ciudadDestino].name}`);

        // Ajustar vista del mapa
        map.fitBounds(routeLayer.getBounds(), { padding: [20, 20] });

        // Mostrar información de la ruta
        const routeInfo = document.getElementById('routeInfo');
        const routeDetails = document.getElementById('routeDetails');

        let tiempoEstimado = Math.round(resultado.distance / 60); // Asumiendo 60 km/h promedio
        let factorTipo = 1;
        let descripcionTipo = '';

        switch (tipoRuta) {
            case 'scenic':
                factorTipo = 1.2;
                descripcionTipo = ' (ruta escénica)';
                break;
            case 'safe':
                factorTipo = 1.1;
                descripcionTipo = ' (ruta segura)';
                break;
            default:
                descripcionTipo = ' (ruta rápida)';
        }

        tiempoEstimado = Math.round(tiempoEstimado * factorTipo);

        // Precio de la gasolina por litro (15827 COP por galón / 3.78541 litros por galón)
        const precioGasolinaPorLitro = 15827 / 3.78541;
        // Consumo de combustible: 0.05 L/km (equivalente a 20 km/L). Puedes ajustar este valor si tienes una estimación más precisa.
        const consumoCombustibleLPorKm = 0.05;

        const combustibleEstimadoLitros = resultado.distance * consumoCombustibleLPorKm;
        const costoCombustibleEstimado = combustibleEstimadoLitros * precioGasolinaPorLitro;


        routeDetails.innerHTML = `
            <strong>🏁 Origen:</strong> ${ciudades[ciudadOrigen].name}<br>
            <strong>🏆 Destino:</strong> ${ciudades[ciudadDestino].name}<br>
            <strong>🛣️ Distancia:</strong> ${Math.round(resultado.distance)} km<br>
            <strong>⏱️ Tiempo estimado:</strong> ${tiempoEstimado} horas${descripcionTipo}<br>
            <strong>🛤️ Ruta:</strong> ${resultado.path.map(c => ciudades[c].name).join(' → ')}<br>
            <strong>⛽ Combustible aprox:</strong> ${combustibleEstimadoLitros.toFixed(2)} litros<br>
            <strong>💰 Costo combustible:</strong> ${Math.round(costoCombustibleEstimado).toLocaleString()} COP
        `;

        routeInfo.style.display = 'block';
        updateStatus("Ruta calculada exitosamente");

    } catch (error) {
        updateStatus("Error al calcular ruta");
        console.error('Error:', error);
        alert('Error al calcular la ruta. Por favor, intenta nuevamente.');
    }
}


// Función auxiliar para encontrar la ciudad más cercana
function findClosestCity(busqueda, ciudades) {
    const busquedaLower = busqueda.toLowerCase();
    for (let key in ciudades) {
        if (ciudades[key].name.toLowerCase().includes(busquedaLower) ||
            busquedaLower.includes(ciudades[key].name.toLowerCase())) {
            return key;
        }
    }
    // Si no encuentra coincidencia exacta, retornar Bogotá como default
    return 'bogota';
}

// Función para actualizar el indicador de estado
function updateStatus(message) {
    document.getElementById('statusIndicator').textContent = message;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    actualizarSelectoresCiudad();

    // Configurar algunos valores por defecto
    document.getElementById('ciudadOrigen').value = 'bogota';
    document.getElementById('ciudadDestino').value = 'medellin';
    document.getElementById('especialidadMecanico').value = 'Reparación General';
});