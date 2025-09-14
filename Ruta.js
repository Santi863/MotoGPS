class Ruta {
  constructor(distancia, tiempo, geometria) {
    this.distancia = distancia; // double
    this.tiempo = tiempo; // double
    this.geometria = geometria; // arreglo Point
  }

  getConsumo(consumoPromedio) {
    return (this.distancia / 100) * consumoPromedio; // Ejemplo
  }
}
