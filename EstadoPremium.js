// Estado premium
class EstadoPremium extends EstadoUsuario {
  calcularCostoRuta(ruta) {
    // Sin recargo
    return ruta.costo;
  }

  puedeVerRutasPersonalizadas() {
    return true;
  }
}