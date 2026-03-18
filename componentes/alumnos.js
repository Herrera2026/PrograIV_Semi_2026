const alumnos = {
    props: ['forms'],
    data() {
        return {
            alumno: {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fechaNacimiento: "",
                sexo: ""
            },
            accion: 'nuevo',
            idAlumno: 0
        };
    },
    methods: {
        buscarAlumno() {
            this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno.codigo          = alumno.codigo;
            this.alumno.nombre          = alumno.nombre;
            this.alumno.direccion       = alumno.direccion;
            this.alumno.municipio       = alumno.municipio;
            this.alumno.departamento    = alumno.departamento;
            this.alumno.telefono        = alumno.telefono;
            this.alumno.fechaNacimiento = alumno.fechaNacimiento;
            this.alumno.sexo            = alumno.sexo;
        },
        async guardarAlumno() {
            const datos = {
                idAlumno:        this.accion === 'modificar' ? this.idAlumno : UUID.generate(),
                codigo:          this.alumno.codigo,
                nombre:          this.alumno.nombre,
                direccion:       this.alumno.direccion,
                municipio:       this.alumno.municipio,
                departamento:    this.alumno.departamento,
                telefono:        this.alumno.telefono,
                fechaNacimiento: this.alumno.fechaNacimiento,
                sexo:            this.alumno.sexo
            };

            const res  = await fetch(`${API}?tabla=alumnos&accion=guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const json = await res.json();

            if (json.error) {
                alertify.error(json.error);
                return;
            }
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
        },
        limpiarFormulario() {
            this.accion                 = 'nuevo';
            this.idAlumno               = 0;
            this.alumno.codigo          = '';
            this.alumno.nombre          = '';
            this.alumno.direccion       = '';
            this.alumno.municipio       = '';
            this.alumno.departamento    = '';
            this.alumno.telefono        = '';
            this.alumno.fechaNacimiento = '';
            this.alumno.sexo            = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmAlumnos" @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                        <div class="card-header">REGISTRO DE ALUMNOS</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">CODIGO:</div>
                                <div class="col-3">
                                    <input placeholder="codigo" required v-model="alumno.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">NOMBRE:</div>
                                <div class="col-6">
                                    <input placeholder="nombre" required v-model="alumno.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">DIRECCION:</div>
                                <div class="col-9">
                                    <input placeholder="direccion" required v-model="alumno.direccion" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">MUNICIPIO:</div>
                                <div class="col-6">
                                    <input placeholder="municipio" required v-model="alumno.municipio" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">DEPARTAMENTO:</div>
                                <div class="col-6">
                                    <input required v-model="alumno.departamento" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">TELEFONO:</div>
                                <div class="col-4">
                                    <input placeholder="telefono" required v-model="alumno.telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">FECHA NAC:</div>
                                <div class="col-4">
                                    <input required v-model="alumno.fechaNacimiento" type="date" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">SEXO:</div>
                                <div class="col-4">
                                    <select required v-model="alumno.sexo" class="form-select">
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset"  class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarAlumno" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};