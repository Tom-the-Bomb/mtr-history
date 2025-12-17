import mtrLogo from '../assets/mtr.svg';

export default function Article({ setRenderArticle }: { setRenderArticle: (value: boolean) => void }) {
    return (
        <div className="max-w-dvw min-h-dvh flex flex-col">
            <header>
                <nav className="p-3">
                    <button type="button" className="nav-btn" onClick={() => setRenderArticle(false)}>
                        Return to Map
                    </button>
                </nav>
            </header>
            <main className="grow">
                <article className="grow flex flex-col gap-8 items-center justify-center px-10 sm:px-20 md:px-30 lg:px-60 pt-20">
                    <img src={mtrLogo} alt="" className="h-50"/>
                    <div className="flex flex-col gap-3 items-center text-center">
                        <h1 className="text-5xl font-bold font-serif text-shadow-lg">The MTR System of Hong Kong</h1>
                        <h2 className="text-xl font-medium mb-8">By Tommy Shen</h2>
                    </div>
                    <div className="flex flex-col gap-7 text-base/7">
                        <p>
                            In a world with ever-evolving transportation technology, metro systems remain one of the most prevalent modes of transportation globally. For various cities,
                            a good metro system represents the bloodline of the metropolis, providing the population with a more convenient, affordable, and environmentally friendly
                            alternative for their daily commute. Yet, designing and constructing a successful, robust system can be quite a daunting task, especially for developing nations.
                            Even today, we still observe a significant discrepancy in the quality of systems across various cities worldwide, with some systems being objectively inferior to others,
                            even in comparably sized cities. Among these many metropolises, Hong Kong stands out as one that boasts one of the best transit networks globally.
                            With a robust metro system featuring 10 heavy rail lines and 98 stations, a 68-station light rail network, and a large network of buses and trams throughout the city,
                            amounting to over 11 million passenger journeys made on public transit (5 million on the MTR) as of 2024, in a city of just over 7 million people.
                        </p>
                        <p>
                            For most cities, public transit is seen as social welfare, and is only used by the young and lower class. Driving remains the primary method of transportation,
                            and transit fares are kept low for those who cannot afford to drive. As a result, most systems operate at a deficit and require substantial government subsidies.
                            Thus, many systems’ infrastructure is built and maintained at a bare minimum, leading to low frequencies, on-time rates, and minimal coverage.
                            The MTR operates under a unique business model that allows it to be one of the only metro systems that operate at a profit. By also working in the real estate sector,
                            the MTR’s Rail + Property model allows them to profit from the land value increase following transit development.
                            As a result, numerous properties in Hong Kong were built and owned by the MTR, including numerous shopping malls, office buildings,
                            and satellite towns that exist solely due to the MTR. By being self-sustaining and not reliant on government subsidies, the MTR can operate a highly efficient,
                            modern metro system (with a 99.9% on-time rate) that is preferred over any other method of transportation.
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