const busqueda_inscripciones = {
    data() { return { buscar: '', inscripciones: [] }; },
    methods: {
        modificarInscripcion(inscripcion) { this.$emit("modificar", inscripcion); },
        async obtenerInscripciones() {
            const res = await fetch(`${API}?tabla=inscripciones&accion=obtener&buscar=${encodeURIComponent(this.buscar)}`);
            this.inscripciones = await res.json();
        },
        async eliminarInscripcion(inscripcion, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar inscripción',
                `¿Está seguro de eliminar la inscripción de ${inscripcion.alumnoNombre} - ${inscripcion.materiaNombre}?`,
                async () => {
                    const res  = await fetch(`${API}?tabla=inscripciones&accion=eliminar&id=${inscripcion.idInscripcion}`, { method: 'DELETE' });
                    const json = await res.json();
                    if (json.error) { alertify.error(json.error); return; }
                    alertify.success("Inscripción eliminada correctamente");
                    this.obtenerInscripciones();
                }, () => {}
            );
        }
    },
    template: `
    <div class="row"><div class="col-9">
        <table class="table table-striped table-hover">
            <thead>
                <tr><th colspan="6"><input autocomplete="off" type="search" @keyup="obtenerInscripciones()" v-model="buscar" placeholder="Buscar por matrícula, alumno o materia" class="form-control"></th></tr>
                <tr><th>MATRÍCULA</th><th>ALUMNO</th><th>MATERIA</th><th>UV</th><th>FECHA MAT.</th><th></th></tr>
            </thead>
            <tbody>
                <tr v-for="i in inscripciones" :key="i.idInscripcion" @click="modificarInscripcion(i)">
                    <td>{{ i.codigoMatricula }}</td><td>{{ i.alumnoNombre }}</td>
                    <td>{{ i.materiaNombre }} ({{ i.materiaCodigo }})</td>
                    <td>{{ i.materiaUv }}</td><td>{{ i.fechaMatricula }}</td>
                    <td><button class="btn btn-danger btn-sm" @click="eliminarInscripcion(i, $event)">ELIMINAR</button></td>
                </tr>
                <tr v-if="inscripciones.length===0"><td colspan="6" class="text-center">No hay inscripciones</td></tr>
            </tbody>
        </table>
    </div></div>`
};