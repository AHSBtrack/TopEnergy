const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TopEnergy SGS</title>
        <style>
            body { font-family: Arial; background: #f0f7f0; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: auto; background: white; border-radius: 28px; padding: 24px; text-align: center; }
            input, button { padding: 10px; margin: 5px; width: 80%; }
            .resultado { background: #eef5ee; padding: 15px; border-radius: 20px; margin-top: 20px; display: none; text-align: left; }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>🌞 TopEnergy SGS</h1>
        <p>Área do telhado (m²):</p>
        <input type="number" id="area" placeholder="Ex: 50">
        <button onclick="simular()">Simular economia</button>
        <div id="resultado" class="resultado"></div>
        <footer style="margin-top:20px;">🔗 CertiChain Verified</footer>
    </div>
    <script>
        async function simular() {
            const area = document.getElementById('area').value;
            if (!area || area <= 0) { alert('Digite uma área válida'); return; }
            const res = await fetch('/api/simular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ area: parseFloat(area) })
            });
            const data = await res.json();
            if (res.ok) {
                document.getElementById('resultado').style.display = 'block';
                document.getElementById('resultado').innerHTML = \`
                    <strong>Potência:</strong> \${data.potencia} kWp<br>
                    <strong>Geração mensal:</strong> \${data.geracao} kWh<br>
                    <strong>Economia:</strong> R$ \${data.economia}<br>
                    <strong>Renda extra:</strong> R$ \${data.rendaExtra}
                \`;
            } else alert('Erro: ' + data.error);
        }
    </script>
    </body>
    </html>
    `);
});

app.post('/api/simular', (req, res) => {
    const { area } = req.body;
    if (!area) return res.status(400).json({ error: 'Área obrigatória' });
    const potencia = (area * 0.15).toFixed(1);
    const geracao = (potencia * 1650 / 12).toFixed(0);
    const consumoMedio = 180;
    const tarifa = 0.75;
    const economia = Math.min(consumoMedio, geracao) * tarifa;
    const excedente = Math.max(0, geracao - consumoMedio);
    const rendaExtra = excedente * 0.70;
    res.json({
        potencia,
        geracao,
        economia: economia.toFixed(0),
        rendaExtra: rendaExtra.toFixed(0)
    });
});

app.listen(PORT, () => console.log('App rodando na porta ' + PORT));
