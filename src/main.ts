import "./assets/main.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const app = createApp(App)

app.use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(ToastService)
    .use(ConfirmationService)
    .component("QuillEditor", QuillEditor)
    .mount('#app')
