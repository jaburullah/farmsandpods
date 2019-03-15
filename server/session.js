/**
 * Created by jaburur on 21-07-2017.
 */
// Model & session
var theApp = require('./app.js');
var sessionModel = function(data){
    var _data = data;
    console.log('session has been created');
    var $sessionTimer = null;
    var _setSessionTimeout = function (){
        console.log('session has been reset');
        clearTimeout($sessionTimer);
        $sessionTimer = setTimeout(function(){
            _data = null;
            console.log('session has been cleared');
        },theApp.sessionExpiresTime);
    };
    //_setSessionTimeout();
    return {
      getUserId: function () {
        return _data ? (_data._id ? _data._id.toString() : undefined) : undefined;
      },
      getUserName: function () {
        return _data ? (_data.username ? _data.username : undefined) : undefined;
      },
      getEmail: function () {
        return _data ? (_data.email ? _data.email : undefined) : undefined;
      },
      getName: function () {
        return _data ? (_data.name ? _data.name : undefined) : undefined;
      },
      isAdmin: function () {
        return _data ? _data.roles.indexOf('admin')>= 0 : false;
      },
      isManager: function () {
        return _data ? _data.roles.indexOf('manager')>=0: false;
      },
      isTenant: function () {
        return _data ? _data.roles.indexOf('tenant')>=0: false;
      },
      getAppartement:function () {
        return _data ? _data.appartement : [];
      },
      getPrimaryAppartement:function () {
        return _data ? _data.primaryAppartements : [];
      },
      getSecondaryAppartement:function () {
        return _data ? _data.secondaryAppartements: [];
      },
      getRoles: function () {
        return _data ? (_data.roles ? _data.roles : []) : [];
      },
      getRawData: function () {
        return _data;
      },
      update: function (data) {
        console.log('session has been updated');
        _data = data;
      },
      resetSession: function () {
        //_setSessionTimeout();
      },
      isBuild: function () {
        return this._data.isBuild;
      }
    }
};

module.exports = sessionModel;
