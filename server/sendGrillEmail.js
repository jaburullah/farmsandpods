var theApp = require('./app.js');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(theApp.sendGridKey);
// const msg = {
//   to: 'jaburullah13@gmail.com',
//   from: 'no-replay@samappartement.herokuapp.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

module.exports = function () {

  function _sendMail(mail) {
    sgMail.send(mail, function (err, json) {
      if (err) {
        console.log(err);
      }
      //console.log(json);
    });
  }

  return {
    sendNewTicketMailToCustomer: function (ticket, appartement, manager, customer) {
      var msg = '<div style="background: white;">\n' +
        '      <div style="text-indent: 10px;">Hellow,</div><br><br>\n' +
        '      <div style="text-indent: 50px;">Your Ticket created successfully and the ticket is assigned to respective manager, soon we will take action and keep update you.</div><br>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket Details</strong></div>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket No: </strong> '+ticket.no+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Category:</strong> '+ticket.category+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Priority:</strong> '+ticket.priority+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Status:</strong> '+ticket.status+'</div><br><br><br><br><br><br><br><br>\n' +
        '      <div style="text-indent: 10px;">Regards,</div>\n' +
        '      <div style="text-indent: 10px;">Admin</div>\n' +
        '  </div>';

      var mail = {
        to: 'jaburullah13@gmail.com',
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'New Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);

      var mail = {
        to: ticket.reporter,
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'New Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);
    },
    sendNewTicketMailToManager: function (ticket, appartement, manager, customer) {
      var msg ='<div style="background: white;">\n' +
        '    <div style="text-indent: 10px;">Hellow,</div><br><br>\n' +
        '    <div style="text-indent: 50px;">New Ticket created. Kindly take action and address this ticket as soon as possible</div><br>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket Details</strong></div>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket No: </strong> '+ticket.no+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Category:</strong> '+ticket.category+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Priority:</strong> '+ticket.priority+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Status:</strong> '+ticket.status+'</div><br><br><br><br><br><br><br><br>\n' +
        '    <div style="text-indent: 10px;">Regards,</div>\n' +
        '    <div style="text-indent: 10px;">Admin</div>\n' +
        '  </div>';
      var mail = {
        to: 'jaburullah13@gmail.com',
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'New Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);
    },
    sendUpdateTicketMail: function (ticket, appartement, manager, customer) {
      var msg = '<div style="background: white;">\n' +
        '    <div style="text-indent: 10px;">Hellow,</div><br><br>\n' +
        '    <div style="text-indent: 50px;">Ticket updated.</div><br>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket Details</strong></div>\n' +
        '      <div style="text-indent: 50px;"><strong>Ticket No: </strong> '+ticket.no+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Category:</strong> '+ticket.category+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Priority:</strong> '+ticket.priority+'</div>\n' +
        '      <div style="text-indent: 50px;"><strong>Status:</strong> '+ticket.status+'</div><br><br><br><br><br><br><br><br>\n' +
        '    <div style="text-indent: 10px;">Regards,</div>\n' +
        '    <div style="text-indent: 10px;">Admin</div>\n' +
        '  </div>';

      var mail = {
        to: 'jaburullah13@gmail.com',
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'Updated Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);

      //
      var mail = {
        to: ticket.reporter,
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'Updated Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);

      var mail = {
        to: ticket.assignee,
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'Updated Ticket, No: '+ ticket.no, //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);

    },
    sendNewUserMail: function (newUser) {
      var msg ='<div style="background: white;">\n' +
        '    <div style="text-indent: 10px;">Hellow,</div><br><br>\n' +
        '    <div style="text-indent: 50px;">Welcome to SAM appartement ticket tracking application. Your new login details given below.</div><br>\n' +
        '    <div style="text-indent: 50px;"><strong>Login Details</strong></div>\n' +
        '    <div style="text-indent: 50px;"><strong>Username: </strong> '+ newUser.email +'</div>\n' +
        '    <div style="text-indent: 50px;"><strong>password:</strong> '+ newUser.password +'</div>\n' +
        '    <br>\n' +
        '    <div style="text-indent: 50px;"><strong><a href="https://samappartement.herokuapp.com/login">click here</a></strong> login</div><br><br><br><br><br><br><br><br>\n' +
        '    <div style="text-indent: 10px;">Regards,</div>\n' +
        '    <div style="text-indent: 10px;">Admin</div>\n' +
        '  </div>';

      var mail = {
        to: 'jaburullah13@gmail.com',
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'Welcome to SAMAPPARTEMENT TICKET TRACKING APPLICATION', //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);

      var mail = {
        to: newUser.email,
        from: '' || 'no-replay@samappartement.herokuapp.com',
        subject: 'Welcome to SAMAPPARTEMENT TICKET TRACKING APPLICATION', //'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        html: msg //'<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      _sendMail(mail);
    }
  };
};
