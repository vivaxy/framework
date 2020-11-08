/**
 * @since 2018-05-20 14:05:19
 * @author vivaxy
 */
export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   *
   * @param {string} event
   * @param {function} callback
   * @returns {EventEmitter}
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ callback });
    return this;
  }

  /**
   * Do not using polymorphism
   * @param {string} event
   * @param {*} [data]
   * @returns {EventEmitter}
   */
  emit(event, data) {
    // console.group('EventEmitter.emit');
    // console.log('%cEventEmitter.emit.event', 'background-color: #aaaaff;', event);
    // console.log('%cEventEmitter.emit.data', 'background-color: #aaaaff;', data);
    const handlers = this.events[event];
    if (handlers) {
      for (let i = 0; i < handlers.length; ) {
        const handler = handlers[i];
        if (handler) {
          handler.callback(data, {
            type: event,
          });
          // console.log('%cEventEmitter.emit.callback', 'background-color: #aaaaff;', handler.callback);
          if (handler === handlers[i]) {
            i++;
          }
        }
      }
    }
    // console.groupEnd();
    return this;
  }

  /**
   *
   * @param {string} event
   * @param {function} callback
   * @returns {EventEmitter}
   */
  off(event, callback) {
    const handlers = this.events[event];
    if (handlers) {
      const handlersLength = handlers.length;
      for (let i = 0; i < handlersLength; i++) {
        const handler = handlers[i];
        if (handler.callback === callback) {
          handlers.splice(i, 1);
          if (handlers.length === 0) {
            delete this.events[event];
          }
          return this;
        }
      }
    } else {
      this.events[event] = [];
    }
    return this;
  }
}
