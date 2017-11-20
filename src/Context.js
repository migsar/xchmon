const state = Symbol('state');

class Context {
  constructor() {
    this[state] = {
      public: {}
    };
  }

  setVar(name, value) {
    // todo: validate var names
    this[state][name] = value;
  }

  getVar(name) {
    return this[state][name];
  }
}

module.exports = Context;
