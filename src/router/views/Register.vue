<template>
  <div class="container-fluid h-100">
    <div class="wrap">

        <div class="card">
        
        <!-- Right form -->
        <div class="right">
            <div class="title-row">
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
                {{ loading ? 'Loading...' : 'Masuk' }}
                </b-button>
                <!-- <button class="submit" type="submit">Masuk</button> -->
            </form>

            <p v-if="message" :class="jenis">{{ message }}</p>

            <div class="foot muted">
            Sudah punya akun ?
            <span class="signup" @click="$router.push('/login')" >Login</span>
            </div>
        </div>

        <!-- Left image -->
        <div class="left" aria-hidden="true" title="Replace with your image if you like"></div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data() {
    return {
        // form: [],
        form: {
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: ''
        },
        loading: false,
        message: '',
        jenis: '',
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
        this.message = res.data.message;
        this.jenis = 'text-success mt-2'
      } catch (err) {
        this.message = err.response?.data?.message
        this.jenis = 'text-danger mt-2'
      } finally {
        this.loading = false
      }
    },
    // notifikasi(message) {
    //   this.$bvToast.toast(message, {
    //     title: 'Success',
    //     variant: 'success',
    //     solid: true,
    //     autoHideDelay: 10000, // 10 seconds
    //     toaster: 'b-toaster-top-right'
    //   });
    // }
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
      --primary:red;        /* golden button color */
      --primary-pressed:red;
      --ring:#e5e7eb;
    }
    *{box-sizing:border-box}
    html,body{margin:0;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Arial,sans-serif;color:var(--text);background:var(--bg)}
    .wrap{
  max-width:1060px;
  margin:0 auto;
  padding:0 16px;

  /* make the page tall and center the card within */
  min-height:100vh;
  display:flex;            /* column layout so margin:auto can center */
  flex-direction:column;
}

    h1{font-weight:700;text-align:center;margin:18px 0 26px}
    .card{
      display:grid;grid-template-columns:1.1fr 1fr;gap:0;background:var(--card);
      border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.06);overflow:hidden;margin:auto; 
    }
    .left{
      min-height:520px;background:#111 url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat;
      filter:grayscale(100%); /* black & white like screenshot */
    }
    .right{padding:42px 46px;display:flex;flex-direction:column;justify-content:flex-start}
    .title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
    .title{font-size:32px;font-weight:800}
    .social{display:flex;gap:12px}
    .social .btn{
      width:40px;height:40px;border-radius:999px;border:1px solid var(--ring);
      display:grid;place-items:center;color:#9ca3af;background:#fff;cursor:pointer;user-select:none;
      transition:transform .06s ease, background .15s ease;
    }
    .social .btn:hover{transform:translateY(-1px);background:#fafafa}
    label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#4b5563;margin-bottom:8px;display:block}
    .input{width:100%;height:48px;border:1px solid var(--ring);border-radius:10px;padding:0 14px;font-size:15px;outline:none;transition:border .12s ease, box-shadow .12s ease;background:#fff}
    .input::placeholder{color:#b6b9c2}
    .input:focus{border-color:#c8ccd6;box-shadow:0 0 0 4px rgba(0,0,0,.03)}
    .field{margin-bottom:18px}
    .submit{
      width:100%;height:52px;border:none;border-radius:10px;background:var(--primary);color:#fff;
      font-weight:700;font-size:16px;cursor:pointer;transition:transform .06s ease, background .15s ease;
    }
    .submit:hover{background:var(--primary-pressed);transform:translateY(-1px)}
    .row{display:flex;align-items:center;justify-content:space-between;margin-top:14px}
    .remember{display:flex;gap:10px;align-items:center;color:#6b7280}
    .checkbox{appearance:none;width:18px;height:18px;border:2px solid var(--primary);border-radius:4px;display:inline-grid;place-items:center;cursor:pointer}
    .checkbox:checked{background:var(--primary)}
    .link{color:#6b7280;cursor:pointer}
    .link:hover{text-decoration:underline}
    .muted{color:#6b7280}
    .signup{color:#d3932c;font-weight:600;cursor:pointer}
    .foot{margin-top:auto;padding-top:6px}
    @media (max-width: 900px){
      .card{grid-template-columns:1fr}
      .left{height:260px}
    }
  </style>