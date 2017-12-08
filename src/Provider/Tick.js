class Tick {
  constructor(data, book, options) {
    this.timestamp = (new Date).valueOf();
    this.book = book;
    this.assign(data, options.map);
  }

  assign(props, map) {
    for(let prop in props){
      this[map[prop]] = props[prop];
    };
  }
}

module.exports = Tick;
