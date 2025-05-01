import { createRoot } from 'react-dom/client';
import BookingPage from './pages/BookingPage';
import resourceManager from './Utilities/ResourceManager';

resourceManager.setBaseUrl("http://localhost:8000");

const root = createRoot(document.body);
root.render(<BookingPage />);
