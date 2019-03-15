export class MenuItem {
  _data: any;

  constructor(data) {
    this._data = data;
  }

  getIcon() {
    return this._data.icon;
  }
  getName() {
    return this._data.name;
  }
  getTitle() {
    return this._data.title;
  }
  getLocation() {
    return this._data.location;
  }
}


