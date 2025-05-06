import axios, { AxiosRequestConfig, Method } from "axios";

class ResourceManager {
    private headers: object = { "Accept": "application/json" };
    private baseUrl: string;

    setAuthTokenHeader = (token: string) => {
        this.headers = { ...this.headers, "Authorization": "Bearer " + token };
    }

    setBaseUrl = (baseUrl: string) => {
        this.baseUrl = baseUrl;
    }

    makeRequest = (path: string, method: Method, body?: BodyInit, extraOptions: AxiosRequestConfig = {}): RequestHandler => {
        let options: AxiosRequestConfig = {
            method: method,
            headers: { ...this.headers, ...extraOptions.headers },
            url: this.baseUrl + path,
        }

        if (body) {
            options.data = body;
        }

        options = { ...extraOptions, ...options }

        return new RequestHandler(options);
    }
}

class RequestHandler {
    private requestConfig;

    constructor(requestConfig: AxiosRequestConfig) {
        this.requestConfig = requestConfig;
    }

    getResponse = () => {
        return axios(this.requestConfig);
    }
}

const resourceManager = new ResourceManager();
export default resourceManager;
