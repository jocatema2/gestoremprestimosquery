const Emprestimo = require('../Model/emprestimo.js');
const Send = require('../MessageBroker/sender.js');
const ObjectID = require('mongodb').ObjectID;
const async = require('async');

module.exports = {

  createEmprestimoPendente : function(response) {

    // não se define ID, pois é a primeira vez que se está a guardar o emprestimo na DB
    var emprestimo = new Emprestimo({
        _id: response._id,
        inicio: response.inicio,
        fim: response.fim,
        nomeUser: response.nomeUser,
        tituloObra: response.tituloObra,
        estado: response.estado
    });

    // Save Emprestimo in the database
    emprestimo.save()
      .then(data => {
        //Send.sendFanout(data, "EMPRESTIMO_CHECK_AUTH"); // to GA
        console.log(data)
      }).catch(err => {
        console.log("[ERROR][emprestimoServices.services.js - createEmprestimoPendente] - Failed to save Emprestimo in database! " + err.message);
      });

  },

  createEmprestimo : function(response) {

    // aqui define-se o ID à mão, pois este Empréstimo já existe e é para se dar update ao estado
    var emprestimo = new Emprestimo({
        _id: response._id,
        inicio: response.inicio,
        fim: response.fim,
        idUtilizador: response.idUtilizador,
        tituloObra: response.tituloObra,
        estado: response.estado
    });

    console.log("[INFO][emprestimoServices.services.js - createEmprestimoDefinitivo] - Emprestimo para ser guardado: " + JSON.stringify(emprestimo));

    // Save Emprestimo in the database
    Emprestimo.findByIdAndUpdate({ _id: emprestimo._id },{ estado: emprestimo.estado })
      .then(data => {
        console.log("[INFO][emprestimoServices.services.js - createEmprestimoDefinitivo] - Emprestimo guardado com sucesso: " + data);
      }).catch(err => {
        console.log("[ERROR][emprestimoServices.services.js - createEmprestimoDefinitivo] - Failed to save Emprestimo in database!");
      });
  },

  closeEmprestimo : function(response) {

    var emprestimo = new Emprestimo({
        _id: new ObjectID.createFromHexString(response.idEmp),
        inicio: response.inicio,
        fim: response.fim,
        nomeUser: response.nomeUser,
        tituloObra: response.tituloObra,
        estado: response.estado
    });

    var deliveryDate = Date.now();

    // Save Emprestimo in the database
    emprestimo.updateOne({ estado: emprestimo.estado })
      .then(data => {
        var finalEmprestimo = JSON.parse(emprestimoJSON);
/*
        if(deliveryDate > emprestimo.fim) {
            Send.sendFanout(finalEmprestimo, "EMPRESTIMO_CLOSED_LATE"); // to GU_C
        } else {
            Send.sendFanout(finalEmprestimo, "EMPRESTIMO_CLOSED_ON_TIME"); // to GU_C
        }
        */
      }).catch(err => {
        console.log("[ERROR][emprestimoServices.services.js - closeEmprestimo] - Failed to update Emprestimo in database!");
      });

  }

}
