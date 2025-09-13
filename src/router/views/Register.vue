<template>
  <div class="container-fluid h-100">
    <div class="wrap">

        <div class="card">
        
        <div class="left">
            <div class="title-row">
              <div class="logo-section">
                  <img src="../../assets/logo.png" alt="Company Logo" class="logo">
                  <span class="logo-text">HIS PPOB-DHEO PRASETYO</span>
              </div>
              <div class="title">Lengkapi data untuk membuat akun</div>
            </div>

            <form @submit.prevent="submit">
                <div class="field">
                    <input id="email" class="input" type="email" v-model.trim="form.email"  placeholder="email" autocomplete="email" required>
                </div>
                <div class="field">
                    <input id="first_name" class="input" type="text" v-model.trim="form.first_name"  placeholder="First Name" autocomplete="first_name" required>
                </div>
                <div class="field">
                    <input id="last_name" class="input" type="text" v-model.trim="form.last_name"  placeholder="Last Name" autocomplete="last_name" required>
                </div>
                <div class="field">
                    <input id="password" class="input" type="password"  v-model="form.password" placeholder="Password" autocomplete="current-password" required>
                </div>
                <div class="field">
                    <input id="confirm_password" class="input" type="password"  v-model="form.confirm_password" placeholder="Confirm Password" autocomplete="current-password" required>
                </div>
                <div v-if="passwordNotMatch" style="color: red;">
                    Passwords do not match.
                </div>
                <b-button :disabled="loading || passwordNotMatch || !form.password || !form.confirm_password" type="submit" block class="submit">
                {{ loading ? 'Loading...' : 'Registrasi' }}
                </b-button>
            </form>

            <div class="foot muted">
            Sudah punya akun ?
            <span class="signup" @click="$router.push('/login')" >Login</span>
            </div>
        </div>

          <div class="right" aria-hidden="true">
            <img alt="Vue logo" src="../../assets/imageLogin.png">
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  name: 'Register',
  data() {
    return {
        form: {
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: ''
        },
        loading: false,
        baseapi: localStorage.getItem("baseapi"),
    }
  },
  methods: {
    async submit () {
      this.loading = true
      this.message = ''
      this.jenis = ''
      try {
        const res = await axios.post(this.baseapi+'/registration', {
          email: this.form.email,
          password: this.form.password,
          first_name: this.form.first_name,
          last_name: this.form.last_name
        })
        this.form = []
        Swal.fire({
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
        })
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: err.response?.data?.message,
          showConfirmButton: false,
          timer: 1500
        })
      } finally {
        this.loading = false
      }
    },
  },
  computed: {
    passwordNotMatch(){
        return this.form.password && this.form.confirm_password && this.form.password !== this.form.confirm_password;
    }
  }
}
</script>

<style>
    :root{
      --bg:#f6f7fb;
      --card:#ffffff;
      --text:#2b2b2b;
      --muted:#6b7280;
      --primary:red;
      --primary-pressed:red;
      --ring:#e5e7eb;
    }
    *{box-sizing:border-box}
    .wrap{
      max-width:1060px;
      margin:0 auto;
      padding:0 16px;

      min-height:100vh;
      display:flex;            
      flex-direction:column;
    }

    .card{
      margin:auto;
    }
    
    h1{font-weight:700;text-align:center;margin:18px 0 26px}
    .card{
      display:grid;grid-template-columns:1.1fr 1fr;gap:0;background:var(--card);
      border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.06);overflow:hidden;
    }
    .right{
      min-height:520px;
      position: relative;
      overflow: hidden;
    }

    .right img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .left{padding:42px 46px;display:flex;flex-direction:column;justify-content:center}
    .title-row{display:flex;flex-direction:column;align-items:flex-start;margin-bottom:28px}
  
    .logo-section{
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:20px;
    }
    .logo{
      height:40px;
      width:auto;
      object-fit:contain;
    }
    .logo-text{
      font-size:20px;
      font-weight:700;
      color:var(--text);
    }
    
    .title{font-size:32px;font-weight:800}
    label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#4b5563;margin-bottom:8px;display:block}
    .input{width:100%;height:48px;border:1px solid var(--ring);border-radius:10px;padding:0 14px;font-size:15px;outline:none;transition:border .12s ease, box-shadow .12s ease;background:#fff}
    .input::placeholder{color:#b6b9c2}
    .field{margin-bottom:18px}
    .submit{
      width:100%;height:52px;border:none;border-radius:10px;background:var(--primary);color:#fff;
      font-weight:700;font-size:16px;cursor:pointer;transition:transform .06s ease, background .15s ease;
    }
    .submit:hover{background:var(--primary-pressed);}
    .row{display:flex;align-items:center;justify-content:space-between;margin-top:14px}
    .signup{color:#d3932c;font-weight:600;cursor:pointer}
    @media (max-width: 900px){
      .card{grid-template-columns:1fr}
      .right{height:260px}
      .logo-section{justify-content:center}
      .title-row{align-items:center;text-align:center}
    }
  </style>