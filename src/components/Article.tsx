
export default function Article({ setRenderArticle }: { setRenderArticle: (value: boolean) => void }) {
    return (
        <div className="w-screen h-screen flex flex-col">
            <header>
                <nav className="p-3">
                    <button type="button" className="nav-btn" onClick={() => setRenderArticle(false)}>
                        Return to Map
                    </button>
                </nav>
            </header>
            <main className="grow">
                <article className="grow flex flex-col items-center justify-center px-40 pt-20">
                    <div className="flex flex-col gap-3 items-center">
                        <h1 className="text-5xl font-bold font-serif">The MTR System of Hong Kong</h1>
                        <h2 className="text-xl font-medium mb-8">By Tommy Shen</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p>
                            React components are the building blocks of any React application. They allow you to split the UI into independent, reusable pieces that can be managed separately.
                        </p>
                        <p>
                            There are two main types of components in React: functional components and class components. Functional components are simpler and are defined as JavaScript functions, while class components are defined using ES6 classes.
                        </p>
                    </div>
                </article>
            </main>
            <footer className="flex justify-center items-center p-6 font-mono text-gray-500">
                Made by&nbsp;
                <a href="https://github.com/Tom-the-Bomb" className="effect-underline text-gray-800" target="_blank" rel="noopener noreferrer">
                    Tom-the-Bomb
                </a>&nbsp;2025
            </footer>
        </div>
    );
}