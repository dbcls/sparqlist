export default class LogEntry {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message
    };
  }
};
