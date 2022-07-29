/**
 * 环境配置
 */
const env = process.env.NODE_ENV || 'prod';
const EnvConfig = {
    dev: {
        baseApi: "http://114.212.101.141:8091",
        // mockApi: "http://127.0.0.1:8091"
        mockApi: "http://192.168.1.100:8091"
        // mockApi: "https://www.fastmock.site/mock/94566a192434d6fcf3b3ef6869fc99b0"
    },
    test: {
        baseApi: "http://114.212.101.141:8091",
        mockApi: "https://www.fastmock.site/mock/94566a192434d6fcf3b3ef6869fc99b0"
    },
    prod: {
        baseApi: "http://114.212.101.141:8090",
        mockApi: "https://www.fastmock.site/mock/94566a192434d6fcf3b3ef6869fc99b0"
    }
}
export default {
    env,
    mock: false,
    namespace: 'COLLECT',
    ...EnvConfig[env]
}