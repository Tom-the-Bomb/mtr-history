import { useState } from 'react';
import InteractiveMap from './components/Map'
import Article from './components/Article';

export default function App() {
    const [renderArticle, setRenderArticle] = useState(true);

    return (
        renderArticle
            ? <Article setRenderArticle={setRenderArticle} />
            : <InteractiveMap setRenderArticle={setRenderArticle} />
    );
}