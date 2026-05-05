const express = require('express');
const produtosRoutes = require('./routes/produtos');

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Rotas
app.use('/produtos', produtosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/produtos`);
});
