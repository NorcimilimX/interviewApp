import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.min.css'

import { initializeApp } from "firebase/app";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import Aura from '@primevue/themes/aura';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2IJXyaqv6KQjUB2FBZ5ejXkTJt0BOCRo",
  authDomain: "interviewappdb.firebaseapp.com",
  projectId: "interviewappdb",
  storageBucket: "interviewappdb.firebasestorage.app",
  messagingSenderId: "849182577212",
  appId: "1:849182577212:web:5ee2844e797d054371a939"
};
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(router)
app.use(PrimeVue)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
});
app.component('interview-menu', Menubar)
app.component('interview-button', Button)
app.component('interview-inputtext', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner )

app.mount('#app')
