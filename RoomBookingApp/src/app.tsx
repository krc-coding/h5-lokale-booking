import { createRoot } from 'react-dom/client';
import resourceManager from './Utilities/ResourceManager';
import RootPage from './pages/RootPage';

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

window.api.getAuthToken().then(authToken => {
    if (authToken) {
        resourceManager.setAuthTokenHeader(authToken);
        document.body.dataset["isAuthed"] = "true";
    }
});

const root = createRoot(document.body);
root.render(<RootPage />);
