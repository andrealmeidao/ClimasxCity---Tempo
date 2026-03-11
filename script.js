const cidade = document.getElementById('cidade');
const buscar = document.getElementById('buscar');
const nomeCidade = document.getElementById('nome-cidade');
const iconeClima = document.getElementById('icone-clima');
const temperatura = document.getElementById('temperatura');
const descricao = document.getElementById('descricao');
const umidade = document.getElementById('umidade');
const vento = document.getElementById('vento');

buscar.addEventListener('click', () => {

    const cidadenome = cidade.value.trim();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidadenome}&appid=156fb6101b67a4f581dca91befb70265&units=metric&lang=pt_br`;

    fetch(url)
        .then(resposta => resposta.json())
        .then(dados => {

            if (dados.cod !== 200) {
                alert("Cidade não encontrada");
                return;
            }

            nomeCidade.textContent = dados.name;

            temperatura.textContent =
                `🌡️ Temperatura: ${dados.main.temp}°C`;

            descricao.textContent =
                `☁️ Clima: ${dados.weather[0].description}`;

            umidade.textContent =
                `💧 Umidade: ${dados.main.humidity}%`;

            vento.textContent =
                `🌬️ Vento: ${dados.wind.speed} m/s`;

            const icone = dados.weather[0].icon;

            iconeClima.src =
                `https://openweathermap.org/img/wn/${icone}@2x.png`;

        });

});
