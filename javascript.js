var guardar_cuentas = []
function generar_cuenta() {
    var nuevo = {

        correo: "",
        user: "",
        telefono: "",
        contrasena: "",
        columna: 0
    }


    var correo = document.getElementById("mail").value;
    var user = document.getElementById("user").value;
    var telefono = document.getElementById("number").value;
    var contrasena = document.getElementById("contrasena").value;
    var recontrasena = document.getElementById("re-contrasena").value;

    if (correo == "" || user == "") {
        alert("Error faltan datos")
    } else {

        if (contrasena != recontrasena || contrasena < 8) {
            alert("Error, las contraseñas no son iguales (Revisa que la contraseña tenga al menos 8 caracteres)")
        } else {

            var encontrar = true;

            for (var i = 0; i < guardar_cuentas.length; i++) {
                if (correo == guardar_cuentas[i].correo) {
                    encontrar = false;
                    break;
                }
            }

            if (encontrar) {
                nuevo.correo = correo;
                nuevo.user = user;
                nuevo.telefono = telefono;
                nuevo.contrasena = contrasena;
                nuevo.columna = 1;

                guardar_cuentas.push(nuevo);
                console.log(guardar_cuentas);

                var txt = JSON.stringify(guardar_cuentas);
                localStorage.setItem("datos", txt);

                alert("Se ha registrado nuevo usuario ");
                alert("Regresa a Inicio De Sesion e ingresa tu NUEVO usuario");
                localStorage.setItem("sesion", 'out');
                window.location.href = 'index.html';
            } else {
                alert("Error correo ya usado");
            }
        }
    }
}
function iniciar() {

    var txt = localStorage.getItem("datos");

    if (txt != null) {
        guardar_cuentas = JSON.parse(txt);
    } else {
        guardar_cuentas = [];
    }
}

function continuar1() {
    var correo1 = document.getElementById("user-valide").value;
    var contrasena1 = document.getElementById("contrasena-valide").value;
    var txt = localStorage.getItem("datos");
    var marca = false;

    if (txt != null) {
        guardar_cuentas = JSON.parse(txt);
        for (var i = 0; i < guardar_cuentas.length; i++) {
            if (correo1 == guardar_cuentas[i].user && contrasena1 == guardar_cuentas[i].contrasena) {
                localStorage.setItem("sesion", 'out');
                alert("Bienvenido " + correo1 + " disfruta tu experiencia");
                window.location.href = 'mapa.html';
                marca = true;
                break;
            }
        }
        if (marca) {
            localStorage.setItem("sesion", 'out');
            window.location.href = 'mapa.html';
        } else {
            alert("Correo o Contraseña Incorrecta, (asegurate que las casillas no esten vacias");
        }

    }
}
function recuperar() {
    var name2 = document.getElementById("user2").value;
    var telefono2 = document.getElementById("number2").value;
    var correo2 = document.getElementById("mail2").value;
    var marca = false;
    var txt = localStorage.getItem("datos");

    if (txt != null) {
        guardar_cuentas = JSON.parse(txt);

        for (var i = 0; i < guardar_cuentas.length; i++) {
            if (name2 == guardar_cuentas[i].user && telefono2 == guardar_cuentas[i].telefono && correo2 == guardar_cuentas[i].correo) {
                marca = true;
                break;
            }
        }
        if (marca) {
            alert("Tu contraseña es:  " + guardar_cuentas[i].contrasena + "  " + "vuelve al inicio de sesión");
            localStorage.setItem("sesion", 'out');
            window.location.href = 'index.html';
        } else {
            alert("La informacion es erronea");
        }
    }
}
