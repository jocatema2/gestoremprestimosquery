module.exports = (app) => {
    const emprestimos = require('../Controller/emprestimoController.js');

    // Create a new emprestimo
    app.post('/emprestimos', emprestimos.create);

    // Retrieve all emprestimos
    app.get('/emprestimos', emprestimos.findAll);

    // Retrieve a single emprestimo by id
    app.get('/emprestimos/:id', emprestimos.findOne);

    // Update a emprestimo with id
    app.put('/emprestimos/:id', emprestimos.update);

    // Delete a emprestimo by id
    app.delete('/emprestimos/:id', emprestimos.delete);
}
