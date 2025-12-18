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
                            a good metro system represents its bloodline, providing the population with a more convenient, affordable, and environmentally friendly
                            alternative for their daily commute. Yet, designing and constructing a successful, robust system can be quite a daunting task, especially for developing nations.
                            Even today, we still observe a significant discrepancy in the quality of systems across various cities worldwide, with some systems being objectively inferior to others,
                            even in comparably sized cities. Among these many metropolises, Hong Kong stands out as one that boasts one of the best transit networks globally.
                            With a robust public transit system featuring 10 heavy rail lines with 98 stations, a 68-station light rail network, and a vast network of buses and trams throughout the city,
                            amounting to over 11 million passenger journeys daily (5 million on the Mass Transit Railway) as of 2024, in a city of just over 7 million people.
                        </p>
                        <p>
                            For most cities, public transit is viewed as social welfare, and is only used by the young and lower class. Driving remains the primary method of transportation,
                            and thus, transit fares are kept low as an alternative for those who cannot afford to drive. As a result, most systems operate at a deficit and require substantial government subsidies.
                            Thus, many systems' infrastructure is built and maintained at a bare minimum, resulting in low frequencies, poor on-time rates, and minimal coverage.
                            The MTR operates under a unique business model that places it as one of the only metro systems in the world that operate at a profit. By involving itself in the real estate sector,
                            the MTR's Rail + Property model allows them to profit from the land value increase following transit development.
                            As a result, numerous properties in Hong Kong were built and owned by the MTR, including numerous shopping malls, office buildings,
                            and satellite towns that exist solely due to the MTR. By being self-sustaining and not reliant on government subsidies, the MTR can operate a highly efficient,
                            modern metro system (with a 99.9% on-time rate) that is preferred over any other method of transportation.
                        </p>
                        <p className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold">Rail + Property Model</h3>
                            <div>
                                When the MTR wants to built a new line, the government first provides them with
                                land development rights at stations or depots along the route. The MTR pays the government
                                the land's market value (pre-railway construction) and then constructs the railway line.
                                The MTR then partners with private devleopers to build properties on the land it has acquired,
                                and they end up receiving a share of the profits that the developers make from these properties.
                                Through this, the MTR generates funds for further railway projects and regular maintenance of the existing network.
                                As an example, the MTR made a profit of $16bn HKD in 2014, despite their fares still being maintained at a low
                                average of around $7 HKD per trip.
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">History</h4>
                            </div>
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