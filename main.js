// Ciudades originales
const ciudades = [
  { id: 'bogota', nombre: 'Bogotá', lat: 4.7110, lng: -74.0721 },
  { id: 'medellin', nombre: 'Medellín', lat: 6.2518, lng: -75.5636 },
  { id: 'cali', nombre: 'Cali', lat: 3.4516, lng: -76.5320 },
  { id: 'cartagena', nombre: 'Cartagena', lat: 10.3911, lng: -75.4794 },
  { id: 'barranquilla', nombre: 'Barranquilla', lat: 10.9639, lng: -74.7964 },
  { id: 'bucaramanga', nombre: 'Bucaramanga', lat: 7.1193, lng: -73.1227 },
  { id: 'pereira', nombre: 'Pereira', lat: 4.8087, lng: -75.6906 },
  { id: 'manizales', nombre: 'Manizales', lat: 5.0707, lng: -75.5138 },
  { id: 'ibague', nombre: 'Ibagué', lat: 4.4389, lng: -75.2322 },
  { id: 'cucuta', nombre: 'Cúcuta', lat: 7.8941, lng: -72.5056 },
  { id: 'villavicencio', nombre: 'Villavicencio', lat: 4.1423, lng: -73.6266 },
  { id: 'neiva', nombre: 'Neiva', lat: 2.9304, lng: -75.2819 },
  { id: 'pasto', nombre: 'Pasto', lat: 1.2089, lng: -77.2762 },
  { id: 'monteria', nombre: 'Montería', lat: 8.7541, lng: -75.8874 },
  { id: 'valledupar', nombre: 'Valledupar', lat: 10.4631, lng: -73.2515 },
];

// Importar clases desde archivos individuales
import Usuario from './Usuario.js';
import EstadoGratuito from './EstadoGratuito.js';
import EstadoPremium from './EstadoPremium.js';
import ServicioRuta from './ServicioRuta.js';
import CalculadoraRutaRapida from './CalculadoraRutaRapida.js';
import CalculadoraRutaSegura from './CalculadoraRutaSegura.js';
import CalculadoraRutaEscenica from './CalculadoraRutaEscenica.js';
import MecanicoService from './MecanicoService.js';
import DatabaseConnection from './DatabaseConnection.js';
import PasarelaPagosAdapter from './PasarelaPagosAdapter.js';
import AdaptarNequi from './AdaptarNequi.js';
import AdaptarDavidPlata from './AdaptarDavidPlata.js';

// Utilidad para llenar selects
function llenarSelectCiudades(selectId, data) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  data.forEach(ciudad => {
    const option = document.createElement('option');
    option.value = ciudad.id;
    option.textContent = ciudad.nombre;
    select.appendChild(option);
  });
}

class Main {
  constructor() {
    this.db = DatabaseConnection.getInstance();
    this.usuario = new Usuario('Iván', 'ivan@example.com', new EstadoGratuito());
    this.servicioRuta = new ServicioRuta(new CalculadoraRutaRapida());
    this.mecanicoService = new MecanicoService(this.db);
    this.nequiAdapter = new PasarelaPagosAdapter(new AdaptarNequi());
    this.daviplataAdapter = new PasarelaPagosAdapter(new AdaptarDavidPlata());

    this.inicializarUI();
  }

  inicializarUI() {
    // Llenar selects de ciudades en los paneles
    llenarSelectCiudades('ciudadOrigen', ciudades);
    llenarSelectCiudades('ciudadDestino', ciudades);
    llenarSelectCiudades('rutaCiudadOrigen', ciudades);
    llenarSelectCiudades('rutaCiudadDestino', ciudades);
    llenarSelectCiudades('ciudadMecanico', ciudades);

    document.getElementById('usuarioInfo').innerText =
      `Usuario: ${this.usuario.nombre}\nEstado: Gratuito`;

    // Calcular Ruta
    document.getElementById('btnCalcularRuta').addEventListener('click', () => {
      const origen = document.getElementById('ciudadOrigen').value;
      const destino = document.getElementById('ciudadDestino').value;
      const tipo = document.getElementById('tipoRuta').value;
      let strategy;
      switch (tipo) {
        case 'rapida': strategy = new CalculadoraRutaRapida(); break;
        case 'segura': strategy = new CalculadoraRutaSegura(); break;
        case 'escenica': strategy = new CalculadoraRutaEscenica(); break;
        default: strategy = new CalculadoraRutaRapida();
      }
      this.servicioRuta.calculadoraStrategy = strategy;
      const ruta = this.servicioRuta.calcularRuta(origen, destino, tipo);
      const costo = this.usuario.estadoSubscripcion.calcularCostoRuta(ruta);

      document.getElementById('routeDetails').innerText =
        `Distancia: ${ruta.distancia} km | Tiempo: ${ruta.tiempo} h | Costo: $${costo}`;
      document.getElementById('routeInfo').style.display = 'block';
    });

    // Buscar mecánicos
    document.getElementById('btnBuscarMecanicos').addEventListener('click', () => {
      const ciudad = document.getElementById('ciudadOrigen').value;
      const radio = parseInt(document.getElementById('radioMecanicos').value);
      const mecanicos = this.mecanicoService.buscarMecanicosCercanos(ciudad, radio);
      const lista = document.getElementById('mecanicosList');
      lista.innerHTML = '';
      mecanicos.forEach(m => {
        const item = document.createElement('div');
        item.className = 'card';
        item.textContent = `${m.nombre}, Tel: ${m.telefono}, calificación: ${m.calificacion}`;
        lista.appendChild(item);
      });
    });

    // Pago premium
    document.getElementById('btnPagarPremium').addEventListener('click', () => {
      const metodo = document.getElementById('metodoPago').value;
      let pagoOK;
      switch (metodo) {
        case 'nequi':
          pagoOK = this.nequiAdapter.procesarPago(50000, 'nequi');
          break;
        case 'daviplata':
          pagoOK = this.daviplataAdapter.procesarPago(50000, 'daviplata');
          break;
      }
      if (pagoOK) {
        this.usuario.upgradePremium();
        document.getElementById('usuarioInfo').innerText =
          `Usuario: ${this.usuario.nombre}\nEstado: Premium`;
      }
      document.getElementById('resultadoPago').innerText =
        pagoOK ? '¡Pago exitoso, ahora eres premium!' : 'Pago fallido.';
    });

    // Upgrade a premium gratis
    document.getElementById('btnUpgrade').addEventListener('click', () => {
      this.usuario.upgradePremium();
      document.getElementById('usuarioInfo').innerText =
        `Usuario: ${this.usuario.nombre}\nEstado: Premium`;
    });

    // Puedes agregar listeners para agregar ciudad, rutas y mecánicos usando los paneles
  }
}

// Lanzar aplicación principal
window.addEventListener('DOMContentLoaded', () => { new Main(); });
