#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const Emprestimo = require('../Model/emprestimo.js');

const gestorAutorizacoes_queue = "GestorAutorizacoes_Queue";
const gestorUtilizadoresCommand_queue = "GestorUtilizadoresCommand_Queue";

const exchange = "GestorEmprestimosQuery_exchange";

module.exports = {
  sendFanout : function(emprestimo, eventType) {
    amqp.connect('amqp://srvbwpty:jT30ovrtxQanxJEh2qBNQ-p8mAzex7iy@cat.rmq.cloudamqp.com/srvbwpty', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        
     // Acrescenta o evenetType ao JSON enviado por mensagem
        msg = msg.substring(0, msg.length-1) + ",\"eventType\":\"" + eventType + "\"}";

        channel.assertExchange(exchange, 'fanout', {
          durable: true
        });

        channel.bindQueue(gestorAutorizacoes_queue, exchange, '');
        channel.bindQueue(gestorUtilizadoresCommand_queue, exchange, '');
        
        channel.publish(exchange, '', Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
      });
      setTimeout(function() {
        connection.close();
      }, 500);
    });
  }
}
