class NavegacionService {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  iniciarNavegacion(ruta) {
    // Iniciar, simular movimiento
  }

  actualizarUbicacionActual(ubicacion) {
    for(let observer of this.observers) {
      observer.update(ubicacion);
    }
  }
}
