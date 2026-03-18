const materias = {
    props: ['forms'],
    data() {
        return {
            materia: { idMateria: 0, codigo: "", nombre: "", uv: '' },
            accion: 'nuevo',
            idMateria: 0
        };
    },
    methods: {
        buscarMateria() {
            this.forms.busqueda_materias.mostrar = !this.forms.busqueda_materias.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia) {
            this.accion   = 'modificar';
            this.idMateria = materia.idMateria;
            this.materia.codigo = materia.codigo;
            this.materia.nombre = materia.nombre;
            this.materia.uv     = materia.uv;
        },
        async guardarMateria() {
            const datos = {
                idMateria: this.accion === 'modificar' ? this.idMateria : UUID.generate(),
                codigo: this.materia.codigo,
                nombre: this.materia.nombre,
                uv:     this.materia.uv
            };
            const res  = await fetch(`${API}?tabla=materias&accion=guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const json = await res.json();
            if (json.error) { alertify.error(json.error); return; }
            this.limpiarFormulario();
            alertify.success(`Materia ${datos.nombre} guardada correctamente`);
        },
        limpiarFormulario() {
            this.accion    = 'nuevo';
            this.idMateria = 0;
            this.materia.codigo = '';
            this.materia.nombre = '';
            this.materia.uv     = '';
        }
    },
    template: `
    <div class="row"><div class="col-6">
        <form id="frmMaterias" @submit.prevent="guardarMateria" @reset.prevent="limpiarFormulario">
            <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                <div class="card-header">REGISTRO DE MATERIAS</div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-3">CODIGO:</div>
                        <div class="col-3"><input placeholder="codigo" required v-model="materia.codigo" type="text" class="form-control"></div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">NOMBRE:</div>
                        <div class="col-6"><input placeholder="nombre" required v-model="materia.nombre" type="text" class="form-control"></div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">UV:</div>
                        <div class="col-4"><input placeholder="uv" required v-model="materia.uv" type="number" class="form-control"></div>
                    </div>
                </div>
                <div class="card-footer"><div class="row"><div class="col text-center">
                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                    <button type="reset"  class="btn btn-warning">NUEVO</button>
                    <button type="button" @click="buscarMateria" class="btn btn-success">BUSCAR</button>
                </div></div></div>
            </div>
        </form>
    </div></div>`
};