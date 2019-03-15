import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Observable, of} from 'rxjs';

export class SessionModel {
  private _data;
  hasSession;
  // private shouldRememberUserNameAndPassword;
  constructor() {
    this.hasSession = false;
    this._data = {};
    this._data.email = getCookie('email');
    this._data.password = getCookie('password');
    this._data.hashKey = getCookie('hashKey');
    this._data.shouldRememberUserNameAndPassword = getCookie('rememberMe');
    this._data.roles = [];
    console.log(document.cookie);
  }

  isUserLoggedIn() {
    return this._data.hashKey !== undefined;
  }

  clearSession() {
    this.hasSession = false;
    if (!this._data.shouldRememberUserNameAndPassword) {
      deleteCookies();
    }
    // this._data = {};
  }

  init(data) {
    this._data = data;
    this.hasSession = true;
    setACookie('email', this._data.email, 2);
    setACookie('password', this._data.password, 2);
    setACookie('hashKey', this._data.hashKey, 2);
    setACookie('rememberMe', this._data.shouldRememberUserNameAndPassword, 2);
  }

  getHashKey() {
    return this._data && this._data.hashKey || '';
  }

  getUserId() {
    return this._data._id;
  }

  getEmail() {
    return this._data && this._data.email || '';
  }

  getPassword() {
    return this._data && this._data.password || '';
  }

  getLastVisited() {
    return this._data.lastVisited;
  }

  shouldRememberUserNameAndPassword() {
    if (this._data.shouldRememberUserNameAndPassword === 'false') {
      return false;
    }
    return this._data.shouldRememberUserNameAndPassword || false;
  }

  isAdmin() {
    return this._data.roles.indexOf('admin') >= 0;
  }
  isManager() {
    return this._data.roles.indexOf('manager') >= 0;
  }
  isTenant() {
    return this._data.roles.indexOf('tenant') >= 0;
  }
  getAppartement() {
    return this._data.appartement;
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 1000 * 60 * 60 * 24));
  const expires = 'expires=' + d.toUTCString();
  window.document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/' ;
}

function getCookie(cname) {
  const name = cname + '=';
  const cArr = window.document.cookie.split(';');
  for (let i = 0; i < cArr.length; i++) {
    const c = cArr[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function deleteCookies() {
  const cArr = window.document.cookie.split(';');
  for (let i = 0; i < cArr.length; i++) {
    deleteCookie(cArr[i]);
  }
}

function deleteCookie(cname) {
  const d = new Date();
  window.document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie(cname) {
  const cookie = getCookie(cname);
  if (cookie !== '') {
    return true;
  } else {
    return false;
  }
}

function setACookie(name, value, expiryDays) {
  const cname = name;
  const cvalue = value;
  const exdays = expiryDays;

  setCookie(cname, cvalue, exdays);
}

function deleteACookie(name) {
  const cname = name;
  deleteCookie(cname);
}

function disPlayAllCookies() {
  const cArr = window.document.cookie.split(';');
  for (let i = 0; i < cArr.length; i++) {
    console.log(cArr[i].trim());
  }
}
