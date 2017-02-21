const fsp = require('fs-promise');
const SPARQLet = require('./sparqlet');
const path = require('path');

module.exports = class Repository {
  constructor(path) {
    this.path = path;
  }

  sparqletPath(name) {
    return path.join(this.path, name + '.md');
  }

  isValidName(name) {
    return name.match(/^[a-zA-Z0-9_-]+$/);// FIXME condition
  }

  async find(name) {
    if (!this.isValidName(name)) {
      return null;
    }
    const markdown = await fsp.readFile(this.sparqletPath(name));
    return SPARQLet.load(name, markdown);
  }

  async update(name, markdown) {
    if (!this.isValidName(name)) {
      return null;
    }
    await fsp.writeFile(this.sparqletPath(name), markdown);
    return this.find(name);
  }

  async delete(name) {
    if (!this.isValidName(name)) {
      return null;
    }
    return await fsp.unlink(this.sparqletPath(name));
  }

  async all() {
    const list = await fsp.readdir(this.path);
    const sparqlets = list.map((markdownPath) => {
      const name = markdownPath.replace(/\.md$/, '');
      return this.find(name);
    });
    return Promise.all(sparqlets);
  }
};
