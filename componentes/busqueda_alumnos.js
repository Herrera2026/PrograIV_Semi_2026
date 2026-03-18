const busqueda_alumnos = {
    data() {
        return {
            buscar: '',
            alumnos: []
        };
    },
    methods: {
        modificarAlumno(alumno) {
            this.$emit("modificar", alumno);
        },
        async obtenerAlumnos() {
            const res = await fetch(`${API}?tabla=alumnos&accion=obtener&buscar=${encodeURIComponent(this.buscar)}`);
            this.alumnos = await res.json();
        },
        async eliminarAlumno(idAlumno, e) {
            e.stopPropagation();
            if (confirm("¿Está seguro de eliminar el alumno?")) {
                const res  = await fetch(`${API}?tabla=alumnos&accion=eliminar&id=${idAlumno}`, { method: 'DELETE' });
                const json = await res.json();
                if (json.error) { alertify.error(json.error); return; }
                alertify.success("Alumno eliminado correctamente");
                this.obtenerAlumnos();
            }
        }
    },
    template: `
        <div class="row">
            <div class="col-8">
                <table class="table table-striped table-hover" id="tblAlumnos">
                    <thead>
                        <tr>
                            <th colspan="9">
                                <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="Buscar alumno" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>MUNICIPIO</th>
                            <th>DEPARTAMENTO</th>
                            <th>TELEFONO</th>
                            <th>F. NAC</th>
                            <th>SEXO</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)">
                            <td>{{ alumno.codigo }}</td>
                            <td>{{ alumno.nombre }}</td>
                            <td>{{ alumno.direccion }}</td>
                            <td>{{ alumno.municipio }}</td>
                            <td>{{ alumno.departamento }}</td>
                            <td>{{ alumno.telefono }}</td>
                            <td>{{ alumno.fechaNacimiento }}</td>
                            <td>{{ alumno.sexo }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" @click="eliminarAlumno(alumno.idAlumno, $event)">DEL</button>
                            </td>
                        </tr>
                        <tr v-if="alumnos.length === 0">
                            <td colspan="9" class="text-center">No hay alumnos para mostrar</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};