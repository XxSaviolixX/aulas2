const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/produtos.json');

// Função auxiliar para ler dados
const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Função auxiliar para escrever dados
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET /produtos - Listar todos
router.get('/', (req, res) => {
    const produtos = readData();
    res.json(produtos);
});

// GET /produtos/:id - Buscar por ID
router.get('/:id', (req, res) => {
    const produtos = readData();
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
});

// POST /produtos - Cadastrar
router.post('/', (req, res) => {
    const { nome, preco, quantidade, categoria } = req.body;
    
    if (!nome || !preco) {
        return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
    }
    
    if (preco <= 0 || quantidade < 0) {
        return res.status(400).json({ erro: "Valores inválidos para preço ou quantidade" });
    }

    const produtos = readData();
    const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
    
    const novoProduto = {
        id: novoId,
        nome,
        preco,
        quantidade: quantidade || 0,
        categoria: categoria || "Geral"
    };

    produtos.push(novoProduto);
    writeData(produtos);
    res.status(201).json(novoProduto);
});

// PUT /produtos/:id - Atualizar
router.put('/:id', (req, res) => {
    const produtos = readData();
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado" });

    const { nome, preco, quantidade, categoria } = req.body;
    
    produtos[index] = {
        ...produtos[index],
        nome: nome || produtos[index].nome,
        preco: preco || produtos[index].preco,
        quantidade: quantidade !== undefined ? quantidade : produtos[index].quantidade,
        categoria: categoria || produtos[index].categoria
    };

    writeData(produtos);
    res.json(produtos[index]);
});

// DELETE /produtos/:id - Remover
router.delete('/:id', (req, res) => {
    let produtos = readData();
    const initialLength = produtos.length;
    produtos = produtos.filter(p => p.id !== parseInt(req.params.id));

    if (produtos.length === initialLength) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    writeData(produtos);
    res.status(204).send();
});

module.exports = router;
