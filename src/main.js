import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ELIcons from '@element-plus/icons'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import mitt from "mitt";
import request from "./utils/request";
import storage from "./utils/storage";


console.log(process.env)

const app = createApp(App)
// 全局挂载
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$emitter = mitt();

for (const icon in ELIcons) {
    app.component(icon, ELIcons[icon]);
}
app
    .use(ElementPlus, {locale})
    .use(router)
    .mount('#app')
