const login = {
    template: `
    <div class="container mt-5 col-md-4">
        <div class="card shadow">
            <div class="card-header text-center bg-primary text-white">
                <h4>Iniciar Sesión</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label>Usuario</label>
                        <input type="text" v-model="usuario" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label>Contraseña</label>
                        <input type="password" v-model="password" class="form-control" required>
                    </div>

                    <button class="btn btn-primary w-100">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            usuario:"",
            password:""
        }
    },
    methods:{
        login(){
            this.$emit("login",{
                usuario:this.usuario,
                password:this.password
            });
        }
    }
}