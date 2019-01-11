const fse = require('fs-extra');
const SPARQLet = require('./sparqlet');
const path = require('path');
const _ = require('lodash');

module.exports = class Repository {
  constructor(path, pathPrefix) {
    this.path = path;
    this.pathPrefix = pathPrefix;
  }

  sparqletPath(name) {
    return path.join(this.path, name + '.md');
  }

  isValidName(name) {
    return (typeof name === 'string') && name.match(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/);
  }

  async find(name) {
    if (!this.isValidName(name)) {
      return null;
    }
    const path = this.sparqletPath(name);
    const stat = await fse.lstat(path);
    const markdown = await fse.readFile(path);
    return SPARQLet.load(name, markdown, this.pathPrefix, stat.mtime);
  }

  async update(name, markdown) {
    if (!this.isValidName(name)) {
      return null;
    }
    await fse.writeFile(this.sparqletPath(name), markdown);
    return this.find(name);
  }

  async create(name, markdown) {
    if (!this.isValidName(name)) {
      return null;
    }
    await fse.writeFile(this.sparqletPath(name), markdown, { flag: 'wx' });
    return this.find(name);
  }

  async delete(name) {
    if (!this.isValidName(name)) {
      return null;
    }
    return await fse.unlink(this.sparqletPath(name));
  }

  async all() {
    const list = await fse.readdir(this.path);
    const sparqlets = list.map((markdownPath) => {
      const name = markdownPath.replace(/\.md$/, '');
      return this.find(name);
    });
    const all = await Promise.all(sparqlets);

    return _.compact(all);
  }
};
