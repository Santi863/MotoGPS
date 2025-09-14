class DatabaseConnection {
  static instance = null;
  constructor() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = this;
      this.connection = {}; // Simulación
    }
    return DatabaseConnection.instance;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  query(sql) {
    // Simulación de ejecucion SQL
    return {};
  }
}
