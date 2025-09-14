class PasarelaPagosAdapter {
  constructor(pasarela) {
    this.pasarela = pasarela;
  }
  procesarPago(monto, metodo) {
    return this.pasarela.pagar(monto, metodo);
  }
}
