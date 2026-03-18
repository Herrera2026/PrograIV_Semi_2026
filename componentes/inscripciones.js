const inscripciones = {
    props: ['forms'],
    data() {
        return {
            inscripcion: { idInscripcion: 0, idMatricula: '', idMateria: '' },
            accion: 'nuevo',
            idInscripcion: 0,
            matriculas: [],
            materias: []
        };
    },
    methods: {
        async buscarInscripcion() {
            this.forms.busqueda_inscripciones.mostrar = !this.forms.busqueda_inscripciones.mostrar;
            this.$emit('buscar');
        },
        async cargarSelectores() {
            const res  = await fetch(`${API}?tabla=inscripciones&accion=selectores`);
            const data = await res.json();
            this.matriculas = data.matriculas;
            this.materias   = data.materias;
        },
        modificarInscripcion(inscripcion) {
            this.accion        = 'modificar';
            this.idInscripcion = inscripcion.idInscripcion;
            this.inscripcion.idMatricula = inscripcion.idMatricula;
            this.inscripcion.idMateria   = inscripcion.idMateria;
        },
        async guardarInscripcion() {
            if (!this.inscripcion.idMatricula || !this.inscripcion.idMateria) {
                alertify.error('Debe seleccionar matrícula y materia');
                return;
            }
            const datos = {
                idInscripcion: this.accion === 'modificar' ? this.idInscripcion : UUID.generate(),
                idMatricula:   this.inscripcion.idMatricula,
                idMateria:     this.inscripcion.idMateria
            };
            const res  = await fetch(`${API}?tabla=inscripciones&accion=guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const json = await res.json();
            if (json.error) { alertify.error(json.error); return; }
            this.limpiarFormulario();
            alertify.success('Inscripción guardada correctamente');
        },
        limpiarFormulario() {
            this.accion        = 'nuevo';
            this.idInscripcion = 0;
            this.inscripcion.idMatricula = '';
            this.inscripcion.idMateria   = '';
        }
    },
    mounted() { this.cargarSelectores(); },
    template: `
    <div class="row"><div class="col-6">
        <form id="frmInscripciones" @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
            <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-4">MATRÍCULA:</div>
                        <div class="col-8">
                            <select required v-model="inscripcion.idMatricula" class="form-select">
                                <option value="">Seleccione una matrícula</option>
                                <option v-for="m in matriculas" :key="m.idMatricula" :value="m.idMatricula">
                                    {{ m.codigo }} - {{ m.nombreAlumno }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">MATERIA:</div>
                        <div class="col-8">
                            <select required v-model="inscripcion.idMateria" class="form-select">
                                <option value="">Seleccione una materia</option>
                                <option v-for="m in materias" :key="m.idMateria" :value="m.idMateria">
                                    {{ m.codigo }} - {{ m.nombre }} ({{ m.uv }} UV)
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-footer"><div class="row"><div class="col text-center">
                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                    <button type="reset"  class="btn btn-warning">NUEVO</button>
                    <button type="button" @click="buscarInscripcion" class="btn btn-success">BUSCAR</button>
                </div></div></div>
            </div>
        </form>
    </div></div>`
};