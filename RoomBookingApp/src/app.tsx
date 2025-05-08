import { createRoot } from 'react-dom/client';
import resourceManager from './Utilities/ResourceManager';
import RootPage from './pages/RootPage';
import { jwtDecode } from 'jwt-decode';

declare global {
    interface Window {
        api: {
            saveAuthToken: (authToken: string) => void;
            getAuthToken: () => Promise<string>;
            deleteAuthToken: () => void;
        }
    }
}

resourceManager.setBaseUrl("http://localhost:8000");

const getUser = (userId: string) => {
    resourceManager.makeRequest("/api/user/getUser/" + userId, "GET").getResponse().then((response) => {
        document.body.dataset["user"] = JSON.stringify(response.data.user);
    }).catch((error) => {
        if (error.status == 401) {
            document.body.dataset["isAuthed"] = "false";
            window.api.deleteAuthToken();
        }
    });
}

window.api.getAuthToken().then(authToken => {
    if (authToken) {
        resourceManager.setAuthTokenHeader(authToken);
        document.body.dataset["isAuthed"] = "true";
        const parsedTokenData = jwtDecode(authToken);
        getUser(parsedTokenData.sub + "");
    }
});

const root = createRoot(document.body);
root.render(<RootPage />);
