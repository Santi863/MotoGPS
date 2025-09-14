// Estado gratuito
class EstadoGratuito extends EstadoUsuario {
  calcularCostoRuta(ruta) {
    // Recargo del 10%
    return ruta.costo * 1.10;
  }

  puedeVerRutasPersonalizadas() {
    return false;
  }
}