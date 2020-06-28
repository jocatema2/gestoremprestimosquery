const Emprestimo = require('../Model/emprestimo.js');
const Send = require('../MessageBroker/sender.js');


// Retrieve and return all emprestimos from the database.
exports.findAll = (req, res) => {
    Emprestimo.find()
    .then(emprestimos => {
        res.send(emprestimos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error!"
        });
    });
};

// Find a single emprestimo with a id
exports.findOne = (req, res) => {
    Emprestimo.findById(req.params.id)
    .then(emprestimo => {
        if(!emprestimo) {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.id
            });
        }
        res.send(emprestimo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving emprestimo with id " + req.params.id
        });
    });
};

//Create and Save a new Emprestimo
exports.create = (req, res) => {
    // Validate request
    if(!req.body.inicio || !req.body.fim || !req.body.nomeUser || !req.body.tituloObra) {
        return res.status(400).send({
            message: "Emprestimo is not valid"
        });
    }

    // Create a Emprestimo
    const emprestimo = new Emprestimo({
        inicio: req.body.inicio,
        fim: req.body.fim,
        nomeUser: req.body.nomeUser,
        tituloObra: req.body.tituloObra,
    });

    // Save Emprestimo in the database
    emprestimo.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Emprestimo."
        });
    });
};

// Update a emprestimo identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.inicio || !req.body.fim || !req.body.idUtilizador || !req.body.idObra) {
        return res.status(400).send({
            message: "Emprestimo is not valid"
        });
    }

    // Find emprestimo and update it with the request body
    Emprestimo.findByIdAndUpdate(req.params.id, {
         inicio: req.body.inicio,
        fim: req.body.fim,
        nomeUser: req.body.nomeUser,
        tituloObra: req.body.tituloObra,
    }, {new: true})
    .then(emprestimo => {
        if(!emprestimo) {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.id
            });
        }
        res.send(emprestimo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating emprestimo with id " + req.params.id
        });
    });
};

// Delete a emprestimo with the specified id in the request
exports.delete = (req, res) => {
    Emprestimo.findByIdAndRemove(req.params.id)
    .then(emprestimo => {
        if(!emprestimo) {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.id
            });
        }
        res.send({message: "Emprestimo deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Emprestimo not found with id " + req.params.emprestimo
            });
        }
        return res.status(500).send({
            message: "Could not delete emprestimo with id " + req.params.id
        });
    });
};