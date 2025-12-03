import InteractiveMap from './components/InteractiveMap'

export default function App() {
    return (
        <div className="flex flex-col min-h-dvh min-w-dvw">
            <header></header>
            <InteractiveMap />
            <footer></footer>
        </div>
    )
}