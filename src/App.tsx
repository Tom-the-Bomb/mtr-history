import { Routes, Route } from 'react-router-dom';
import InteractiveMap from './components/Map'
import Article from './components/Article';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<InteractiveMap />} />
            <Route path="/article" element={<Article />} />
        </Routes>
    );
}
