class Usuario {
  constructor(nombre, email, estadoSubscripcion = new EstadoGratuito()) {
    this.nombre = nombre;
    this.email = email;
    this.estadoSubscripcion = estadoSubscripcion;
  }

  upgradePremium() {
    this.estadoSubscripcion = new EstadoPremium();
  }

  // Cambio a gratuito
  gratuito() {
    this.estadoSubscripcion = new EstadoGratuito();
  }
}
