// Interfaz/base para EstadoUsuario
class EstadoUsuario {
  calcularCostoRuta(ruta) {
    throw new Error("Método abstracto. Implementar en subclase.");
  }

  puedeVerRutasPersonalizadas() {
    throw new Error("Método abstracto. Implementar en subclase.");
  }
}