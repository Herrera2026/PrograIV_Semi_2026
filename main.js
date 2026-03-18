// ============================================
// main.js  –  Sin Dexie, conectado a MySQL vía api.php
// ============================================

const { createApp } = Vue;
// API se declara en index.html como: const API = "api.php"

createApp({
    components: {
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes,
        matriculas,
        busqueda_matriculas,
        inscripciones,
        busqueda_inscripciones
    },

    data() {
        return {
            forms: {
                alumnos:               { mostrar: false },
                busqueda_alumnos:      { mostrar: false },
                materias:              { mostrar: false },
                busqueda_materias:     { mostrar: false },
                docentes:              { mostrar: false },
                busqueda_docentes:     { mostrar: false },
                matriculas:            { mostrar: false },
                busqueda_matriculas:   { mostrar: false },
                inscripciones:         { mostrar: false },
                busqueda_inscripciones:{ mostrar: false }
            }
        };
    },

    methods: {
        buscar(ventana, metodo) {
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana) {
            Object.keys(this.forms).forEach(key => {
                if (key.includes('busqueda_')) this.forms[key].mostrar = false;
            });
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data) {
            this.forms['busqueda_' + ventana].mostrar = false;
            this.$refs[ventana][metodo](data);
        }
    }

}).mount("#app");