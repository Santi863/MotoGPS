class ServicioRuta {
  constructor(calculadoraStrategy = new CalculadoraRutaRapida()) {
    this.calculadoraStrategy = calculadoraStrategy;
  }

  calcularRuta(origen, destino, tipo) {
    switch(tipo) {
      case "rapida":
        this.calculadoraStrategy = new CalculadoraRutaRapida();
        break;
      case "segura":
        this.calculadoraStrategy = new CalculadoraRutaSegura();
        break;
      case "escenica":
        this.calculadoraStrategy = new CalculadoraRutaEscenica();
        break;
    }
    return this.calculadoraStrategy.calcularRuta(origen, destino);
  }

  calcularConsumo(ruta) {
    // ejemplo: asinación de consumo
    return ruta.getConsumo(3.5);
  }

  calcularCosto(ruta) {
    // ejemplo simplificado
    return ruta.distancia * 0.05;
  }
}
