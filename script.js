const { useEffect, useState } = React;

const API_KEY = "156fb6101b67a4f581dca91befb70265";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const QUICK_SEARCHES = [
    "Sao Paulo",
    "Rio de Janeiro",
    "Lisboa",
    "Tokyo",
    "New York",
];

function formatNow() {
    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date());
}

function getWeatherTheme(temp) {
    if (temp >= 30) {
        return "theme-warm";
    }

    if (temp <= 16) {
        return "theme-cool";
    }

    return "theme-mild";
}

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(formatNow());

    useEffect(() => {
        handleSearch("São Paulo");
    }, []);

    async function handleSearch(customCity) {
        const query = (customCity ?? city).trim();

        if (!query) {
            setError("Digite o nome de uma cidade para consultar o clima.");
            setWeather(null);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const url =
                `${API_BASE_URL}?q=${encodeURIComponent(query)}` +
                `&appid=${API_KEY}&units=metric&lang=pt_br`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok || Number(data.cod) !== 200) {
                throw new Error(data.message || "Cidade não encontrada.");
            }

            setWeather(data);
            setCity(data.name);
            setLastUpdated(formatNow());
        } catch (requestError) {
            setWeather(null);
            setError(
                "Nao foi possivel encontrar essa cidade. Tente um nome como 'Recife' ou 'Paris'."
            );
        } finally {
            setLoading(false);
        }
    }

    const themeClass = weather ? getWeatherTheme(weather.main.temp) : "theme-mild";

    const metrics = weather
        ? [
            {
                label: "Sensação",
                value: `${Math.round(weather.main.feels_like)}°C`,
            },
            {
                label: "Umidade",
                value: `${weather.main.humidity}%`,
            },
            {
                label: "Vento",
                value: `${weather.wind.speed.toFixed(1)} m/s`,
            },
            {
                label: "Pressão",
                value: `${weather.main.pressure} hPa`,
            },
        ]
        : [];

    return (
        <main className={`app-shell ${themeClass}`}>
            <div className="bg-orb orb-left" aria-hidden="true"></div>
            <div className="bg-orb orb-right" aria-hidden="true"></div>

            <section className="hero-panel">
                <div className="hero-copy">
                    <p className="eyebrow">Climaxxcity</p>
                    <h1>Confira o clima de qualquer cidade com uma interface muito mais viva.</h1>
                    <p className="hero-text">
                        A busca continua ligada na OpenWeather API, mas agora com uma
                        experiência mais clara, responsiva e elegante.
                    </p>

                    <form
                        className="search-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSearch();
                        }}
                    >
                        <label className="sr-only" htmlFor="city-input">
                            Nome da cidade
                        </label>
                        <input
                            id="city-input"
                            type="text"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Ex.: Curitiba, Madrid, Toronto"
                            autoComplete="off"
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Buscando..." : "Buscar clima"}
                        </button>
                    </form>

                    <div className="quick-searches">
                        {QUICK_SEARCHES.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                className="chip"
                                onClick={() => {
                                    setCity(suggestion);
                                    handleSearch(suggestion);
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <p className="helper-text">
                        Dica: a API ainda trabalha com nomes de cidades. Se houver ambiguidade,
                        tente algo como "Campinas" ou "Campinas,BR".
                    </p>
                </div>

                <div className="weather-card">
                    {error ? (
                        <div className="status-card error-card">
                            <span className="status-badge">Busca não concluída</span>
                            <h2>Não encontrei essa cidade.</h2>
                            <p>{error}</p>
                        </div>
                    ) : null}

                    {loading ? (
                        <div className="status-card empty-card">
                            <span className="status-badge">Consultando</span>
                            <h2>Buscando os dados mais recentes da cidade.</h2>
                            <p>
                                Estou consultando a OpenWeather API para montar o painel com
                                temperatura, descrição e indicadores principais.
                            </p>
                        </div>
                    ) : null}

                    {!weather && !error && !loading ? (
                        <div className="status-card empty-card">
                            <span className="status-badge">Pronto para buscar</span>
                            <h2>Escolha uma cidade para ver o clima atual.</h2>
                            <p>
                                Temperatura, descrição, umidade, vento e pressão aparecem aqui
                                assim que a consulta for concluída.
                            </p>
                        </div>
                    ) : null}

                    {weather ? (
                        <div className="weather-content">
                            <div className="weather-header">
                                <div>
                                    <p className="weather-location">
                                        {weather.name}
                                        {weather.sys?.country ? `, ${weather.sys.country}` : ""}
                                    </p>
                                    <p className="weather-updated">
                                        Atualizado em {lastUpdated}
                                    </p>
                                </div>
                                <img
                                    id="icone-clima"
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                    alt={`Ícone de ${weather.weather[0].description}`}
                                />
                            </div>

                            <div className="temperature-row">
                                <strong>{Math.round(weather.main.temp)}°C</strong>
                                <span>{weather.weather[0].description}</span>
                            </div>

                            <div className="details-grid">
                                {metrics.map((item) => (
                                    <article key={item.label} className="detail-tile">
                                        <span>{item.label}</span>
                                        <strong>{item.value}</strong>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
