
import Properties from './Properties';

import mtrLogo from '../assets/mtr.svg';
import crossPlatform from '../assets/crossplatform.webp';
import rp from '../assets/RP.jpg';

import propertiesData from '../assets/data/properties.json';

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
                <article className="grow flex flex-col gap-8 items-center justify-center px-10 sm:px-20 md:px-30 lg:px-60 py-20">
                    <img src={mtrLogo} alt="" className="h-50"/>
                    <div className="flex flex-col gap-3 items-center text-center">
                        <h1 className="text-5xl font-bold font-serif text-shadow-lg">The MTR System of Hong Kong</h1>
                        <h2 className="text-xl font-medium mb-8">By Tommy Shen</h2>
                    </div>
                    <div className="flex flex-col gap-7 text-base/7">
                        <div>
                            In a world with ever-evolving transportation technology, metro systems remain one of the most prevalent modes of transportation globally. For various cities,
                            a good metro system represents its bloodline, providing the population with a more convenient, affordable, and environmentally friendly
                            alternative for their daily commute. Yet, designing and constructing a successful, robust system can be quite a daunting task, especially for developing nations.
                            Even today, we still observe a significant discrepancy in the quality of systems across various cities worldwide, with some systems being objectively inferior to others,
                            even in comparably sized cities. Among these many metropolises, Hong Kong stands out as one that boasts one of the best transit networks globally.
                            With a robust public transit system featuring 10 heavy rail lines with 98 stations, a 68-station light rail network, and a vast network of buses and trams throughout the city,
                            amounting to around 12 million passenger journeys daily (6 million on the Mass Transit Railway) as of 2024, in a city of just over 7 million people.
                        </div>
                        <div>
                            For most cities, public transit is viewed as social welfare, and is only used by the young and lower class. Driving remains the primary method of transportation,
                            and thus, transit fares are kept low as an alternative for those who cannot afford to drive. As a result, most systems operate at a deficit and require substantial government subsidies.
                            Thus, many systems' infrastructure is built and maintained at a bare minimum, resulting in low frequencies, poor on-time rates, and minimal coverage.
                            The MTR operates under a unique business model that places it as one of the only metro systems in the world that operate at a profit. By involving itself in the real estate sector,
                            the MTR's Rail + Property model allows them to profit from the land value increase following transit development.
                            As a result, numerous properties in Hong Kong were built and owned by the MTR, including numerous shopping malls, office buildings,
                            and satellite towns that exist solely due to the MTR. By being self-sustaining and not reliant on government subsidies, the MTR can operate a highly efficient,
                            modern metro system (with a 99.9% on-time rate) that is preferred over any other method of transportation.
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">Rail + Property Model</h3>
                            <div>
                                When the MTR wants to built a new line, the government first provides them with
                                land development rights at stations or depots along the route. The MTR pays the government
                                the land's market value (pre-railway construction) and then constructs the railway line.
                                The MTR then partners with private devleopers to build properties on the land it has acquired,
                                and they end up receiving a share of the profits that the developers make from these properties.
                                Through this, the MTR generates funds for further railway projects and regular maintenance of the existing network.
                                As an example, the MTR made a profit of $16bn HKD in 2014, despite their fares still being maintained at a low
                                average of around $7 HKD per trip, as of this profit nearly half of it came from its properties.
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">History</h4>
                                In the 1960s, Hong Kong was a British colony experiencing rapid population growth and urbanization.
                                The colonial government recognized the need for an underground transportation system to alleviate traffic congestion and support economic development.
                                In 1975, the MTR Corporation was established as a government-owned entity to oversee the construction and operation of the metro system
                                and required that the MTR adhere to "prudent commercial principles" the main reason behind the system's success today. These principles
                                required the MTR to secure a satisfactory rate of return on its projects, and its day-to-day operating costs must be must be fully covered by revenues.
                                The motive behind this was to ensure that the MTR would be self-sustaining and not reliant on government subsidies, which the government at the time believed
                                to be was important to avoid dealing with the volatility of politics, something they had experience with back in the UK with the London Underground. These policies
                                forced the MTR to involve itself in other business activites and hence the Rail + Property model was born.
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Examples</h4>
                                <div className="flex flex-col xl:flex-row gap-5">
                                    <div className="flex flex-col gap-2 w-fit">
                                        Some of the most notable examples of properties<br/>
                                        developed by the MTR include:
                                        <Properties stations={propertiesData.stations} />
                                    </div>
                                    <div className="flex-1">
                                        <img src={rp} alt="" className="w-full h-auto rounded-md drop-shadow-lg"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Uniqueness to Hong Kong</h4>
                                We can see that unlike most metro systems that come after the development of a city, the MTR
                                was built alongside the growth of Hong Kong, with numerous properties and towns constructed
                                solely due to the MTR. Hong Kong is a small city with a high population density,
                                making land and new properties extremely in demand. Currently, only 25% of Hong Kong's land area is developed,
                                with the rest remaining as country parks and natural reserves. This scarcity has made the MTR's development of
                                satellite towns such as LOHAS Park and Tung Chung even more critical to Hong Kong's growth. The land
                                these towns are built on was previously empty and out of reach, giving the MTR a perfect opportunity to connect it via rail,
                                driving up land value, and building properties to accommodate the growing population, ...and of course turn a profit for the corporation.
                                <br/><br/>
                                The MTR is the past, present and future of Hong Kong, following its development back when Hong Kong
                                was a mess and not an economic powerhouse like it is today. Most of the population is reliant on public transit
                                more than anything else to get around the city. In fact, over 90% of daily journeys in Hong Kong are made using public transport,
                                one of the highest rates in the world. While the US has 800 cars for every 1000 people, Hong Kong only has 92. Car ownership in Hong Kong
                                is so expensive, and after factoring in parking and congestion it is simply not worth it for the majority of the population. With such a high reliance on public transit, the MTR has the ability
                                to influence where these 90% of people go everyday, and thus, making property around stations so valuable to businesses and developers.
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">MTR Spotlight</h3>
                            Aside from the well-maintained, efficiend, and modern metro system, the MTR also has various other
                            unique features that make it one of a kind, securing its spot as one of the best metro systems in the world.
                            <div>
                                <h4 className="text-xl font-bold">Cross-Platform Interchanges</h4>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col xl:flex-row gap-7">
                                        <div className="flex-1">
                                            Cross Platform interchanges are a feature that allows passengers to transfer between two lines
                                            by simply walking across the platform, without needing to go up or down stairs. This feature
                                            is extremely convenient, as it reduces transfer times and congestion in the station,
                                            especially during peak hours. Not only does the MTR have the highest number of cross-platform interchanges
                                            of any system in the world, it has taken it a step further by implementing both-direction cross-platform interchanges at
                                            2 consecutive stations. What this means is that between 2 lines, instead of being able to interchange at 1 station,
                                            passengers can interchange at either of 2 consecutive stations, depending on which direction they wish to go.
                                        </div>
                                        <div className="flex-1">
                                            <img src={crossPlatform} alt="" className="w-full h-auto rounded-md p-2 shadow-lg"/>
                                        </div>
                                    </div>
                                    <div>
                                        An example of this is the interchange between the Tseung Kwan O Line and Kwun Tong Line at Yau Tong and Tiu Keng Leng stations.
                                        At Yau Tong station, passengers traveling towards Whampoa on the Kwun Tong Line can simply cross the platform to board
                                        the Tseung Kwan O Line train heading towards Po Lam. This allows for opposite-direction cross-platform interchanges.
                                        Conversely, at Tiu Keng Leng station, passengers traveling towards North Point on the Kwun Tong Line can cross the platform
                                        to board the Tseung Kwan O Line train heading towards LOHAS Park, enabling same-direction cross-platform interchanges.
                                        The 2 station interchange allows for both same-direction and opposite-direction cross-platform interchanges, allowing passengers
                                        to take advantage of cross-platform interchanges regardless of their route. Combined with the high frequency of trains on both lines,
                                        this setup makes it feel like the 2 lines are effectively 1. This might seem simple, but it requires meticulous planning,
                                        as somewhere between the 2 stations, the tracks of at least 1 line must swap in order to achieve this effect.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Overseas Projects</h3>
                            The MTR's projects are not limited to Hong Kong. Due to its success, the MTR has been commissioned
                            to work on and operate several metro systems overseas, including several in mainland China such as
                            Line 4 of the Beijing Metro, Shenzhen Metro Line 4, Hangzhou Metro Line 1 & 5. The MTR has also aided in the development
                            and operation of other systems through partially owned subsidiaries such as Metro Trains Melbourne (Melbourne Metropolitan Rail),
                            Metro Trains Sydney (Sydney Metro), and MTR Tunnelbanan AB (Stockholm Metro).
                            <br/><br/>
                            A primary incentive for the MTR to participate in these projects is to limit brain drain from its own workforce.
                            Hong Kong does not have the capacity for new railway projects one after another, and thus many employees would be left without work,
                            leading them to seek employment elsewhere. These workers, with the valuable experience from past MTR projects,
                            are critical for the MTR to retain for the success of future projects, and thus the MTR does so through these projects outside of Hong Kong.
                        </div>
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