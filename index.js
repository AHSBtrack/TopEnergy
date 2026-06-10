const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota principal com o simulador HTML
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TopEnergy SGS - Simulador Solar</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f0f7f0; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .container { max-width: 500px; background: white; border-radius: 28px; padding: 24px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); text-align: center; }
            h1 { color: #1a3b1a; margin-bottom: 8px; }
            input { width: 80%; padding: 12px; border-radius: 40px; border: 1px solid #ccc; font-size: 16px; margin-bottom: 15px; text-align: center; }
            button { background: #f5a623; border: none; padding: 12px 24px; border-radius: 40px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.3s; }
            button:hover { background: #e09512; }
            .resultado { background: #eef5ee; padding: 15px; border-radius: 20px; margin-top: 20px; text-align: left; display: none; }
            footer { margin-top: 25px; font-size: 11px; color: #8a9a8a; }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>🌞 TopEnergy SGS</h1>
        <p>Simule a economia do seu telhado</p>
        <input type="number" id="area" placeholder="Área (m²) ex: 50">
        <br>
        <button onclick="simular()">Simular economia</button>
        <div id="resultado" class="resultado"></div>
        <footer>🔗 CertiChain Verified | cooperativa em formação</footer>
    </div>
    <script>
        async function simular() {
            const area = document.getElementById('area').value;
            if (!area || area <= 0) { alert('Digite uma área válida'); return; }
            try {
                const res = await fetch('/api/simular', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ area: parseFloat(area) })
                });
                const data = await res.json();
                if (res.ok) {
                    document.getElementById('resultado').style.display = 'block';
                    document.getElementById('resultado').innerHTML = \`
                        <strong>🔆 Potência estimada:</strong> \${data.potencia} kWp<br>
                        <strong>⚡ Geração mensal:</strong> \${data.geracao} kWh<br>
                        <strong>💰 Economia na conta:</strong> R$ \${data.economia}<br>
                        <strong>✨ Renda extra (CSGS):</strong> R$ \${data.rendaExtra}
                    \`;
                } else alert('Erro: ' + data.error);
            } catch(e) { alert('Erro de conexão'); }
        }
    </script>
    </body>
    </html>
    `);
});

// Rota da API de simulação
app.post('/api/simular', (req, res) => {
    const { area } = req.body;
    if (!area) return res.status(400).json({ error: 'Área é obrigatória' });
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

app.listen(PORT, () => console.log(\`App rodando na porta \${PORT}\`));
