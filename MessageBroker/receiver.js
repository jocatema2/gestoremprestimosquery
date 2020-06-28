#!/usr/bin/env node
const Service = require('../Service/emprestimoService.js');
var amqp = require('amqplib/callback_api');

const gestorEmprestimosQuery_queue = "GestorEmpestimosQuery_Queue";

const exchange = "GestorEmprestimosQuery_exchange";

module.exports = {
  executingReceiver : function() {
    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }    
          
          channel.assertQueue(gestorEmprestimosQuery_queue, {
              durable: false
          });

          console.log("Hallo", gestorEmprestimosQuery_queue);          

          channel.consume(gestorEmprestimosQuery_queue, function(msg) {
              var response = JSON.parse(msg.content.toString());
              console.log(response)
              switch(response.eventType) {
                case "EMPRESTIMO_PENDING":
                  Service.createEmprestimoPendente(response);
                  break;
                case "EMPRESTIMO_CREATED":
                  Service.createEmprestimo(response);
                  break;
                case "CLOSE_EMPRESTIMO":
                  Service.closeEmprestimo(response);
                  break;
                default:
                  console.log("hm");
              }
          }, {
              noAck: true
          });         
      });
    });
  }

}
