
export interface PropertiesProps {
    stations: {
        name: string
        href: string
        properties: string[]
    }[]
}

export default function Properties({ stations }: PropertiesProps) {
    return (
        <ul className="list-disc list-inside">
            {
                stations.map((station) => (
                    <li key={station.name}>
                        <a href={station.href} className="font-bold effect-underline text-blue-600" target="_blank" rel="noopener noreferrer">
                            {station.name}
                        </a>
                        <ul className="list-disc list-inside ml-5">
                            {station.properties.map((name, index) => (
                                <li key={index}>{name}</li>
                            ))}
                        </ul>
                    </li>
                ))
            }
        </ul>
    );
}
