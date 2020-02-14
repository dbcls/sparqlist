import _fs from 'fs';
import path from 'path';

import SPARQLet from './sparqlet.mjs';

const fs = _fs.promises;

export default class Repository {
  constructor(path, pathPrefix) {
    this.path       = path;
    this.pathPrefix = pathPrefix;
  }

  sparqletPath(name) {
    return path.join(this.path, `${name}.md`);
  }

  isValidName(name) {
    if (typeof name !== 'string') { return false; }

    return /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name);
  }

  async find(name) {
    if (!this.isValidName(name)) { return null; }

    const path     = this.sparqletPath(name);
    const stat     = await fs.lstat(path);
    const markdown = await fs.readFile(path, 'utf8');

    return SPARQLet.load(name, markdown, this.pathPrefix, stat.mtime);
  }

  async update(name, markdown) {
    if (!this.isValidName(name)) { return null; }

    await fs.writeFile(this.sparqletPath(name), markdown);

    return this.find(name);
  }

  async create(name, markdown) {
    if (!this.isValidName(name)) { return null; }

    await fs.writeFile(this.sparqletPath(name), markdown, {flag: 'wx'});

    return this.find(name);
  }

  async delete(name) {
    if (!this.isValidName(name)) { return null; }

    return await fs.unlink(this.sparqletPath(name));
  }

  async all() {
    const list = await fs.readdir(this.path);

    const sparqlets = list.map((markdownPath) => {
      return this.find(markdownPath.replace(/\.md$/, ''));
    });

    const all = await Promise.all(sparqlets);

    return all.filter(Boolean);
  }
};
