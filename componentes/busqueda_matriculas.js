const busqueda_matriculas = {
    data() { return { buscar: '', matriculas: [] }; },
    methods: {
        modificarMatricula(matricula) { this.$emit('modificar', matricula); },
        async obtenerMatriculas() {
            const res = await fetch(`${API}?tabla=matriculas&accion=obtener&buscar=${encodeURIComponent(this.buscar)}`);
            this.matriculas = await res.json();
        },
        async eliminarMatricula(matricula, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar matrícula', `¿Está seguro de eliminar la matrícula ${matricula.codigo}?`, async () => {
                const res  = await fetch(`${API}?tabla=matriculas&accion=eliminar&id=${matricula.idMatricula}`, { method: 'DELETE' });
                const json = await res.json();
                if (json.error) { alertify.error(json.error); return; }
                alertify.success(`Matrícula ${matricula.codigo} eliminada correctamente`);
                this.obtenerMatriculas();
            }, () => {});
        }
    },
    template: `
    <div class="row"><div class="col-8">
        <table class="table table-striped table-hover">
            <thead>
                <tr><th colspan="4"><input autocomplete="off" type="search" @keyup="obtenerMatriculas()" 
                v-model="buscar" placeholder="Buscar matrícula o alumno" class="form-control"></th></tr>
                <tr><th>CODIGO</th>
                <th>ALUMNO</th>
                <th>FECHA</th>
                <th></th></tr>
            </thead>
            <tbody>
                <tr v-for="m in matriculas" :key="m.idMatricula" @click="modificarMatricula(m)">
                    <td>{{ m.codigo }}</td>
                    <td>{{ m.nombreAlumno }}</td>
                    <td>{{ m.fecha }}</td>
                    <td><button class="btn btn-danger btn-sm" @click="eliminarMatricula(m, $event)">DEL</button></td>
                </tr>
                <tr v-if="matriculas.length===0"><td colspan="4" class="text-center">No hay matrículas</td></tr>
            </tbody>
        </table>
    </div></div>`
};