import {TOKEN_TIME_LIMIT} from "@/utils/constant";
import storage from "@/utils/storage";
import router from "@/router";

export const setTokenTime = () => {
    storage.setItem("tokenTime", Date.now());
}

export const getTokenTIme = () => {
    return storage.getItem("tokenTime");
}

export const diffTokenTime = () => {
    const currentTime = Date.now();
    const tokenTime = getTokenTIme();
    return currentTime - tokenTime > TOKEN_TIME_LIMIT;
}

export const logout = () => {
    storage.clearItem("token");
    storage.clearItem("userInfo");
    storage.clearItem("tokenTime");
    storage.clearItem("query")
    router.push("/login");
}