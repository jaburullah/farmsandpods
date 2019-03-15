/**
 * Created by jaburur on 16-07-2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var theApp = require('./server/app.js');
var app = express();

var _sessionTimeOutCheck = function (sessionValue) {
  var howManyMinutes = moment().diff(_session[sessionValue].loggedInTime, 'minutes');
  console.log(_session[sessionValue].getEmail(),"Minutes Ago: " + howManyMinutes);
  if(howManyMinutes >  theApp.sessionExpiresTime){
    return false;
  }
  else {
    return true;
  }
};
function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err)
}
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
function errorHandler (err, req, res, next) {
  res.status(500);
  res.render('error', { error: err })
}
var sessionValue = null;
//Public enable folder
app.use(express.static(__dirname +'/web'));
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

/// visit later
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);

  sessionValue = req.query.session;
  var isLogin = req.query.login || false;


  if((req.originalUrl.indexOf('/') >= 0 || req.originalUrl.indexOf('favicon') >= 0) && !sessionValue){ //favicon
    // isLogin = true;
    next();
  }
  else if(!sessionValue){
    _session[sessionValue] = '';
    res.json(utils.jsonResponse(_session[sessionValue],false,{'msg': 'Invalid session'}));

  } else if(_session[sessionValue]) {
    if(_sessionTimeOutCheck(sessionValue)){
      _session[sessionValue].loggedInTime = new Date();
      next();
    }
    else{
      delete _session[sessionValue];
      res.json(utils.jsonResponse(_session[sessionValue],false,{'msg': 'session expired'}));
    }
  }
  else{
    if(isLogin && !_session[sessionValue]){
      next();
    }
    else{
      _session[sessionValue] = '';
      res.json(utils.jsonResponse(_session[sessionValue],false,{'msg': 'Invalid session'}));
    }
  }



});

/// custom module
var theApp = require('./server/app.js');

var db = require('./server/db.js');
db.init();
var fo = require('./server/file.js');
var sessionModel = require('./server/session.js');
var _session =  {};
var utils = require('./server/utils.js');
var _sessionCheck = function (req, res) {
  var sessionValue = req.query.session;
  if(!sessionValue && !_session[sessionValue]){
    var status = true;
    var data = {'msg': 'Invalid session'};
    res.json(utils.jsonResponse(_session,status,data));
    return false;
  }
  return sessionValue;
};

// routes will go here
// start the server
//get Views
app.get('/getView',function(req,res){

    var file = "login";
    if(_session){
        if(_session.isAdmin() && req.query.view=='login'){
            file ="dashboard";
        }
        else {
            file = req.query.view;
        }
    }
    else {
        file = req.query.view;
    }

    fo.readHTML(file,function(state,data){
        var result = utils.viewResponse(_session,state,file,data);
        res.json(result);
    });
});

//Landing
app.get('/index', function (req, res) {
  res.sendFile( __dirname + "/web/index.html" );
});
app.get('/session', function (req, res) {
  var makeHash = function () {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };
  sessionValue = makeHash();
  res.json(utils.jsonResponse(null,true,{ session: sessionValue}));
});

//Current User Details
app.get('/userDetails',function(req,res){
    if(_session){
        res.json(utils.jsonResponse(_session,true,_session.getRawData()));
    }
    else {
        res.json(utils.jsonResponse(_session,true,{}));
    }
});

// Home
app.get('/homeDetails',function(req,res){
    db.getHomeDetails(function(status,data){
        res.json(utils.jsonResponse(_session,status,data));
    });
});

// Dashboard
app.get('/dashboardDetails',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.getDashboardDetails(function (status, data) {
      res.json(utils.jsonResponse(_session, status, data));
    }, _session[sessionValue]);
  }

});


//Mobile Login
app.post('/mobileLogin',function(req,res) {


    var userName = req.body.username;
    var password = req.body.password;
    var fireBaseId = req.body.fireBaseId;

    var searchObj = {
        fireBaseId:fireBaseId,
        password: password
    };
    if (isNaN(userName)) {
        searchObj.email = userName.toLowerCase();
    }
    else {
        searchObj.mobileNo = userName
    }

    db.mobileLogin(searchObj, function (status, data) {
        //_session.update(data);
        res.json(utils.jsonResponse(_session, status, data));
    });

});
app.post('/appInfo',function(req,res){

    var userID = req.body.userId;

    db.appInfo({userId:userID}, function (status, data) {
        //_session.update(data);
        res.json(utils.jsonResponse(_session, status, data));
    });

});
// mobile logout
app.post('/mobileLogout',function(req,res) {
    var email = req.body.email;
    var searchObj = {
        email: email.toLowerCase()
    };

    db.mobileLogout(searchObj, function (status, data) {
        //_session.update(data);
        res.json(utils.jsonResponse(_session, status, data));
    });

});
//Login
app.post('/login',function(req,res) {
  //fcm.send(fcm.prepareNotification());

  var _response = function (sessionValue, status,data) {
    // data.hashKey = sessionValue;
    data.isProduction = theApp.isProduction;
    res.json(utils.jsonResponse(_session[sessionValue],status,data));
  };

  db.login(req.body,function(status,data){
    var sessionValue = req.body.hashKey;
    status = false;
    if(data){

      if(data.lastVisited){
        var dateDiff = moment(data.lastVisited, 'days').calendar();
        data.lastVisited = dateDiff;
      }
      else {
        data.lastVisited = 'Now';
      }

      if(sessionValue && _session[sessionValue]) {
        if (_sessionTimeOutCheck(sessionValue)) {
          _session[sessionValue].loggedInTime = new Date();
          data.hashKey = sessionValue;
          _response(sessionValue, true, data);
        }
        else {
          delete _session[sessionValue];
          data = {'msg': 'session expired'};
          _response(sessionValue, false, data);
        }
      }
      else {
        var secret = data.email + '_' + data.password;
        utils.encrypt(secret, function (encrypt) {
          var sessionValue = encrypt;
          utils.decrypt(sessionValue, function (decrypt) {
            var newSession = sessionModel(data);
            _session[sessionValue] = newSession;
            _session[sessionValue].loggedInTime = new Date();
            data.hashKey = sessionValue;
              _response(sessionValue, true, data);
          });
        });
      }

    }
    else {
      status = true;
      data = {'msg': 'Invalid username and password'};
      _response(sessionValue, status, data)
    }
    db.setSession(_session[sessionValue]);
  });

});
app.post('/logout', function (req, res) {
  var sessionValue = req.query.session;
  db.logout(req.body, function (status, data) {
    if (status) {
      delete _session[sessionValue];
      res.json(utils.jsonResponse(_session[sessionValue], true, {logout: true}));
    }
    else {
      res.json(utils.jsonResponse(_session[sessionValue], true, {logout: false }));
    }
  }, _session[sessionValue]);
});

//Appartement
app.post('/saveAppartement',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveAppartement(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.post('/deleteAppartement',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteAppartement(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

app.get('/appartementDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getAppartmentDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

//Farm Owner
app.post('/saveFarmOwner',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveFarmOwner(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/farmOwnerDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getFarmOwnerDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deleteFarmOwner',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteFarmOwner(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//Farms
app.post('/saveFarm',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveFarm(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/farmDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getFarmDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deleteFarm',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteFarm(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//Seeds
app.post('/saveSeed',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveSeed(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/seedDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getSeedDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deleteSeed',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteSeed(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//Pod Owner
app.post('/savePodOwner',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.savePodOwner(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/podOwnerDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getPodOwnerDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deletePodOwner',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deletePodOwner(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//Pod
app.post('/savePod',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.savePod(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/podDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getPodDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deletePod',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deletePod(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//bed
app.post('/saveBed',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveBed(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, data));
    }, _session[sessionValue]);
  }
});

app.get('/bedDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getBedDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

app.post('/deleteBed',function(req,res) {
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteBed(req.body, function (status, data) {
      res.json(utils.jsonResponse(_session[sessionValue], status, {}));
    }, _session[sessionValue]);
  }
});

//Manager
app.post('/saveManager',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.saveManager(req.body,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});
app.post('/deleteManager',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.deleteManager(req.body,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,{}));
      }, _session[sessionValue]);
    }
});
app.get('/allManagerDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getAllManagerDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});

//Tenant
app.post('/saveTenant',function(req,res){
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.saveTenant(req.body,function(status,data){
      res.json(utils.jsonResponse(_session[sessionValue],status,data));
    }, _session[sessionValue]);
  }
});
app.post('/deleteTenant',function(req,res){
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.deleteTenant(req.body,function(status,data){
      res.json(utils.jsonResponse(_session[sessionValue],status,data));
    }, _session[sessionValue]);
  }
});
app.get('/allTenantDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.getAllTenantDetails(function(status,data){
      res.json(utils.jsonResponse(_session[sessionValue],status,data));
    }, _session[sessionValue]);
  }
});

//User
app.post('/saveUser',function(req,res){
    var user = {
        id:req.body.id,
        name:req.body.name,
        password:req.body.password,
        email:req.body.email.toLowerCase(),
        mobileNo:req.body.mobileNo,
        roles:req.body.roles,
        appartements:req.body.appartements
    };

    db.saveUser(user,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
    });
});
app.post('/deleteUser',function(req,res){
    var user = {
        id:req.body.id
    };
    db.deleteUser(user,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,{}));
    });
});

///////////////////////////////////////////////////
app.get('/allUserDetails',function(req,res){
    db.getAllUserDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
    });
});

//Tickets
app.post('/saveTicket',function(req,res){
    /*
    Ticket Details
     Type: ["Electrical","Plumbing"]
     //User:
     //Manager:
     //Appartement:
     Priority: Critical, High, Medium, Low
     Status: Open, InProgress, Closed, Reopen,
     Summary:
     */
  var sessionValue = _sessionCheck(req, res);

    var ticket = req.body;
    ticket.createdDate = new Date();
    ticket.modifiedDate = new Date();
    ticket.isManagerAction = false;
    ticket.owner = _session[sessionValue].getUserId();

    ticket.no = new Date().getTime();

    if(ticket._id){
        delete ticket.createdDate;
        ticket.modifiedDate =new Date(req.body.modifiedDate);
    }


    if(sessionValue){
      db.saveTicket(ticket,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});
app.post('/deleteTicket',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.deleteTicket(req.body,function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status));
      }, _session[sessionValue]);
    }
});
app.post('/userTicket',function(req,res) {
    var userID = req.body.userID;
    var apartmentID = req.body.apartmentID;
    db.userTicket({userID:userID,apartmentID:apartmentID},function (status, data) {
        res.json(utils.jsonResponse(_session[sessionValue], status, data));
    });
});
app.post('/managerTicket',function(req,res) {
    var userID = req.body.userId;
    var appartementId = req.body.appartementId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;


    db.managerTicket({userId:userID,appartementId:appartementId,startDate:startDate,endDate:endDate},function (status, data) {
        res.json(utils.jsonResponse(_session[sessionValue], status, data));
    });
});

app.get('/allTickets',function(req,res){
  var sessionValue = _sessionCheck(req, res);
  if(sessionValue){
    db.getAllTicketDetails(function(status,data){
      res.json(utils.jsonResponse(_session[sessionValue],status,data));
    }, _session[sessionValue]);
  }
});

app.get('/allTicketDetails',function(req,res){
  var sessionValue = _sessionCheck(req, res);
    if(sessionValue){
      db.getAllTicketDetails(function(status,data){
        res.json(utils.jsonResponse(_session[sessionValue],status,data));
      }, _session[sessionValue]);
    }
});



if(theApp.isProduction){
  // Serve only the static files form the dist directory
  app.use(express.static(__dirname + '/dist/SAMAPP'));

  app.get('/*', function(req,res) {

    // res.sendFile(path.join(__dirname+'/dist/SAMAPP/index.html'));
    res.sendFile(__dirname+'/dist/SAMAPP/index.html');
  });
}
//end server
//app.listen(theApp.port);
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket) {
  console.log('a user connected' + socket.id);
  socket.on('TicketCreated', function () {
    console.log('Ticket Created By: ' + socket.id);
    var allSocket = io.sockets.sockets;
    allSocket.forEach(function (soc) {

      if (soc.id != socket.id) {
        soc.emit('Ticket', {data: "test"})
      }

    });


  });

  socket.on('disconnect', function () {
    console.log('a user disconnected' + socket.id);
  });
  socket.on('message', function (message) {
    console.log("Message Received: " + message);
    io.emit('message', {type: 'new-message', text: message});
  });
});

http.listen(theApp.port, function(){
    console.log('listening on *:'+theApp.port);
});

console.log('Server started! At http://'+theApp.ip+':' + theApp.port);



