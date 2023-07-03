const express = require('express');
const uuid = require('uuid');
const app = express();

app.use(express.json()); // config do uso de JSON no envio e leitura de dados nas ROTAS

const ordereds = [];

const methodUrl = (request, response, next) => {
    const { method, url } = request;

    console.log(`${method} - ${url}`);

    next();
};

const verifyIdUser = (request, response, next) => {
    const { id } = request.params;

    const index = ordereds.findIndex(order => order.id === id);

    if(index < 0) {
        return response.status(404).json({error: "User not found"});
    }

    request.userIndex = index;
    request.userId = id;
    
    next();
};

app.get('/order', methodUrl, (request, response) => {
    return response.status(200).json(ordereds);
});

app.post('/order', methodUrl, (request, response) => {
    const { order, clientName, price } = request.body;

    const newOrder = { 
        id: uuid.v4(), 
        order, 
        clientName, 
        price,
        status: "Em preparação"
    };

    ordereds.push(newOrder);

    return response.status(201).json(newOrder);
});

app.put('/order/:id', methodUrl, verifyIdUser, (request, response) => {
    const index = request.userIndex;
    // const id = request.userId;

    const { order, clientName, price } = request.body;

    const updatedOrder = ordereds[index];
    
    updatedOrder.order = order;
    updatedOrder.clientName = clientName;
    updatedOrder.price = price;

    return response.status(202).json(updatedOrder);
});

app.delete('/order/:id', methodUrl, verifyIdUser, (request, response) => {
    const index = request.userIndex;

    ordereds.splice(index, 1);

    return response.status(204).json({});
});

app.get('/order/:id', methodUrl, verifyIdUser, (request, response) => {
    const index = request.userIndex;
    
    const orderSelected = ordereds[index];

    return response.status(200).json(orderSelected);
});

app.patch('/order/:id', methodUrl, verifyIdUser, (request, response) => {
    const index = request.userIndex;

    const updateStatus = ordereds[index];
    updateStatus.status = "Pronto"

    return response.status(202).json(updateStatus);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀✨ Server is running on PORT: ${PORT}`);
});
