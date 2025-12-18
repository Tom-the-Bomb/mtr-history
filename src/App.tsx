import { useState } from 'react';
import InteractiveMap from './components/Map'
import Article from './components/Article';

export default function App() {
    const [renderArticle, setRenderArticle] = useState(false);

    document.body.style.overflow = renderArticle ? 'auto' : 'hidden';
    return (
        renderArticle
            ? <Article setRenderArticle={setRenderArticle} />
            : <InteractiveMap setRenderArticle={setRenderArticle} />
    );
}