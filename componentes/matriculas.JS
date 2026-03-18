const matriculas = {
    props: ['forms'],
    data() {
        return {
            matricula: { idMatricula: 0, codigo: "", idAlumno: '', fecha: '' },
            accion: 'nuevo',
            idMatricula: 0,
            alumnos: []
        };
    },
    methods: {
        async buscarMatricula() {
            this.forms.busqueda_matriculas.mostrar = !this.forms.busqueda_matriculas.mostrar;
            this.$emit('buscar');
        },
        modificarMatricula(matricula) {
            this.accion      = 'modificar';
            this.idMatricula = matricula.idMatricula;
            this.matricula.codigo    = matricula.codigo;
            this.matricula.idAlumno  = matricula.idAlumno;
            this.matricula.fecha     = matricula.fecha;
        },
        async guardarMatricula() {
            const datos = {
                idMatricula: this.accion === 'modificar' ? this.idMatricula : new Date().getTime(),
                codigo:      this.matricula.codigo,
                idAlumno:    this.matricula.idAlumno,
                fecha:       this.matricula.fecha
            };
            const res  = await fetch(`${API}?tabla=matriculas&accion=guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const json = await res.json();
            if (json.error) { alertify.error(json.error); return; }
            this.limpiarFormulario();
            alertify.success(`Matrícula ${datos.codigo} guardada correctamente`);
        },
        limpiarFormulario() {
            this.accion      = 'nuevo';
            this.idMatricula = 0;
            this.matricula.codigo   = '';
            this.matricula.idAlumno = '';
            this.matricula.fecha    = '';
        }
    },
    async mounted() {
        const res = await fetch(`${API}?tabla=matriculas&accion=alumnos`);
        this.alumnos = await res.json();
    },
    template: `
    <div class="row"><div class="col-6">
        <form id="frmMatriculas" @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
            <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                <div class="card-header">REGISTRO DE MATRÍCULAS</div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-3">CODIGO:</div>
                        <div class="col-4"><input placeholder="codigo" required v-model="matricula.codigo" type="text" class="form-control"></div>
                    </div>
                    
                    <div class="row p-1">
                        <div class="col-3">ALUMNO:</div>
                        <div class="col-8">
                            <select required v-model="matricula.idAlumno" class="form-select">
                                <option value="">Seleccione un alumno</option>
                                <option v-for="a in alumnos" :key="a.idAlumno" :value="a.idAlumno">
                                    {{ a.codigo }} - {{ a.nombre }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">FECHA:</div>
                        <div class="col-4"><input required v-model="matricula.fecha" type="date" class="form-control"></div>
                    </div>
                </div>
                <div class="card-footer"><div class="row"><div class="col text-center">
                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                    <button type="reset"  class="btn btn-warning">NUEVO</button>
                    <button type="button" @click="buscarMatricula" class="btn btn-success">BUSCAR</button>
                </div></div></div>
            </div>
        </form>
    </div></div>`
};
