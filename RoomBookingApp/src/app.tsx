import { createRoot } from 'react-dom/client';
import resourceManager from './Utilities/ResourceManager';
import RootPage from './pages/RootPage';

resourceManager.setBaseUrl("http://localhost:8000");

const root = createRoot(document.body);
root.render(<RootPage />);
