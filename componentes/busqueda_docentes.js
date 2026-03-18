const busqueda_docentes = {
    data() { return { buscar: '', docentes: [] }; },
    methods: {
        modificarDocente(docente) { this.$emit('modificar', docente); },
        async obtenerDocentes() {
            const res = await fetch(`${API}?tabla=docentes&accion=obtener&buscar=${encodeURIComponent(this.buscar)}`);
            this.docentes = await res.json();
        },
        async eliminarDocente(docente, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar docente', `¿Está seguro de eliminar a ${docente.nombre}?`, async () => {
                const res  = await fetch(`${API}?tabla=docentes&accion=eliminar&id=${docente.idDocente}`, { method: 'DELETE' });
                const json = await res.json();
                if (json.error) { alertify.error(json.error); return; }
                alertify.success(`Docente ${docente.nombre} eliminado correctamente`);
                this.obtenerDocentes();
            }, () => {});
        }
    },
    template: `
    <div class="row"><div class="col-8">
        <table class="table table-striped table-hover">
            <thead>
                <tr><th colspan="7"><input autocomplete="off" type="search" @keyup="obtenerDocentes()" v-model="buscar" placeholder="Buscar docente" class="form-control"></th></tr>
                <tr><th>CODIGO</th><th>NOMBRE</th><th>DIRECCION</th><th>EMAIL</th><th>TELEFONO</th><th>ESCALAFON</th><th></th></tr>
            </thead>
            <tbody>
                <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)">
                    <td>{{ docente.codigo }}</td>
                    <td>{{ docente.nombre }}</td>
                    <td>{{ docente.direccion }}</td>
                    <td>{{ docente.email }}</td>
                    <td>{{ docente.telefono }}</td>
                    <td>{{ docente.escalafon }}</td>
                    <td><button class="btn btn-danger btn-sm" @click="eliminarDocente(docente, $event)">DEL</button></td>
                </tr>
                <tr v-if="docentes.length===0"><td colspan="7" class="text-center">No hay docentes</td></tr>
            </tbody>
        </table>
    </div></div>`
};