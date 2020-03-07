import ConnectionState from 'Constants/States'
import ConnectionEvent from 'Constants/Events'

/**
 * @access private
 * @description Stores the connection state
 * @type {ConnectionState|NULL}
 */
let _connectionState = null
/**
 * @access private
 * @description Stores the checker instance
 * @type {number|NULL}
 */
let _checkerInstance = null

/**
 * @access private
 * @function _getState
 * @description Retrieves the stored connection state.
 * @returns {ConnectionState}
 */
const _getState = () => {
  return _connectionState
}

/**
 * @access private
 * @function _setState
 * @description Set _connectionState value to state.
 * @param {ConnectionState|NULL} state
 */
const _setState = (state) => {
  _connectionState = state
}

/**
 * @access private
 * @function _resetState
 * @description Reset _connectionState value.
 */
const _resetState = () => {
  _setState(null)
}

/**
 * @access private
 * @description Contains the main logic part of the connection checker library.
 * @class Checker
 */
class Checker {
  /**
   * @access private
   * @description Creates an instance of Checker.
   * @constructs
   * @memberof Checker
   */
  constructor () {
    /**
     * @access private
     * @description Represents the network state stored, it can be 'CONNECTED', 'DISCONNECTED' or null.
     * @property {ConnectionState|NULL}
     * @memberof Checker
    */
    this.networkState = null
    /**
     * @access private
     * @description Stores the generated interval for checker.
     * @property {number|NULL}
     * @memberof Checker
    */
    this.checkerInterval = null
  }

  /**
   * @access private
   * @function onNetworkChecking
   * @description Retrieves a ON_NETWORK_CHECKING event.
   * @returns {ConnectionEvent}
   * @memberof Checker
   */
  onNetworkChecking () {
    return new Event(ConnectionEvent.ON_NETWORK_CHECKING)
  }

  /**
   * @access private
   * @function onNetworkChanged
   * @description Retrieves a ON_NETWORK_CHANGED custom event, retrives connection states when emitted.
   * @param {Object} data Contains connection states 'from' and 'to'.
   * @returns {ConnectionEvent}
   * @memberof Checker
   */
  onNetworkChanged (data) {
    return new CustomEvent(ConnectionEvent.ON_NETWORK_CHANGED, { detail: data })
  }

  /**
   * @access private
   * @function onNetworkConnected
   * @description Retrieves a ON_NETWORK_CONNECTED event.
   * @returns {ConnectionEvent}
   * @memberof Checker
   */
  onNetworkConnected () {
    return new Event(ConnectionEvent.ON_NETWORK_CONNECTED)
  }

  /**
   * @access private
   * @function onNetworkDisconnected
   * @description Retrieves a ON_NETWORK_DISCONNECTED event.
   * @returns {ConnectionEvent}
   * @memberof Checker
   */
  onNetworkDisconnected () {
    return new Event(ConnectionEvent.ON_NETWORK_DISCONNECTED)
  }

  /**
   * @access private
   * @function _checkNetwork
   * @description Executes ON_NETWORK_CHECKING event dispatcher, generates a Promise
   * which resolves or rejects depending on the resolution of fetch requesting a remote server.
   * @returns {Promise}
   * @memberof Checker
   */
  _checkNetwork () {
    this._dispatchNetworkChecking()
    return new Promise((resolve, reject) => {
      fetch('https://google.com', {
        method: 'HEAD',
        mode: 'cors',
        timeout: 2000
      }).then((response) => {
        response.ok
          ? resolve(this._evaluateNetwork(ConnectionState.CONNECTED))
          : reject(this._evaluateNetwork(ConnectionState.DISCONNECTED))
      }).catch(() => {
        reject(this._evaluateNetwork(ConnectionState.DISCONNECTED))
      })
    })
  }

  /**
   * @access private
   * @function _getNetworkState
   * @description Retrieves networkState value.
   * @returns {ConnectionState|NULL}
   * @memberof Checker
   */
  _getNetworkState () {
    return this.networkState
  }

  /**
   * @access private
   * @function _setNetworkState
   * @description Assigns state value to networkState.
   * @param {ConnectionState|NULL} state
   * @memberof Checker
   */
  _setNetworkState (state) {
    this.networkState = state
  }

  /**
   * @access private
   * @function _resetState
   * @description Resets the networkState value to origin.
   * @memberof Checker
   */
  _resetState () {
    this._setNetworkState(null)
  }

  /**
   * @access private
   * @function _hasNetworkChanged
   * @description Validates if there has been a change on network state.
   * @param {ConnectionState|NULL} state
   * @returns {boolean}
   * @memberof Checker
   */
  _hasNetworkChanged (state) {
    return this._getNetworkState() !== state
  }

  /**
   * @access private
   * @function _evaluateNetwork
   * @description Evaluates state to execute the ON_NETWORK_CHANGED event dispatcher if conditions are valid.
   * @param {ConnectionState|NULL} state
   * @memberof Checker
   */
  _evaluateNetwork (state) {
    this._hasNetworkChanged(state) && this._dispatchNetworkChanged(state)
  }

  /**
   * @access private
   * @function _dispatchNetworkChecking
   * @description Method that emits an event ON_NETWORK_CHECKING.
   * @fires ON_NETWORK_CHECKING
   * @memberof Checker
   */
  _dispatchNetworkChecking () {
    window.dispatchEvent(this.onNetworkChecking())
  }

  /**
   * @access private
   * @function _dispatchNetworkChanged
   * @description Emits an ON_NETWORK_CHANGED event with states changed 'from' and 'to', then validates
   * state to execute dispatchers of ON_NETWORK_CONNECTED or ON_NETWORK_DISCONNECTED events.
   * @fires ON_NETWORK_CHANGED
   * @param {ConnectionState|NULL} state
   * @memberof Checker
   */
  _dispatchNetworkChanged (state) {
    window.dispatchEvent(this.onNetworkChanged({ from: this._getNetworkState(), to: state }))
    state === ConnectionState.CONNECTED ? this._dispatchNetworkConnected() : this._dispatchNetworkDisconnected()
  }

  /**
   * @access private
   * @function _dispatchNetworkConnected
   * @description Emits an ON_NETWORK_CONNECTED event.
   * @fires ON_NETWORK_CONNECTED
   * @memberof Checker
   */
  _dispatchNetworkConnected () {
    this._setNetworkState(ConnectionState.CONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkConnected())
  }

  /**
   * @access private
   * @function _dispatchNetworkDisconnected
   * @description Emits an ON_NETWORK_DISCONNECTED event.
   * @fires ON_NETWORK_DISCONNECTED
   * @memberof Checker
   */
  _dispatchNetworkDisconnected () {
    this._setNetworkState(ConnectionState.DISCONNECTED)
    _setState(this._getNetworkState())
    window.dispatchEvent(this.onNetworkDisconnected())
  }

  /**
   * @access private
   * @function _isCheckerActive
   * @description Checks if there is an active checker.
   * @returns {boolean}
   * @memberof Checker
   */
  _isCheckerActive () {
    return !!this.checkerInterval
  }

  /**
   * @access private
   * @function _startConnectionChecker
   * @description Starts the periodical execution of network validations.
   * @memberof Checker
   */
  _startConnectionChecker () {
    if (!this._isCheckerActive()) {
      this.checkerInterval = setInterval(() => {
        this._checkNetwork()
      }, 10000)
    }
  }

  /**
   * @access private
   * @function _stopConnectionChecker
   * @description Stops any periodical execution of network validations and resets network state.
   * @memberof Checker
   */
  _stopConnectionChecker () {
    if (this._isCheckerActive()) {
      clearInterval(this.checkerInterval)
      this._resetState()
    }
  }

  /**
   * @access private
   * @function _checkConnectionOnDemand
   * @description Executes _checkNetwork method and retrieves its Promise result once.
   * @returns {Promise}
   * @memberof Checker
   */
  _checkConnectionOnDemand () {
    return this._checkNetwork()
  }
}

/**
 * @access public
 * @function getConnectionState
 * @description Retrieves the stored network state.
 * @returns {ConnectionState|NULL}
 */
const getConnectionState = () => {
  return _getState()
}

/**
 * @access public
 * @function isCheckerActive
 * @description Checks if exist an instance of Checker class.
 * @returns {boolean}
 */
const isCheckerActive = () => {
  return !!_checkerInstance
}

/**
 * @access public
 * @function startChecker
 * @description Generates an instance of a Checker which keeps executing network validations.
 */
const startChecker = () => {
  if (!isCheckerActive()) {
    _resetState()
    _checkerInstance = new Checker()
    _checkerInstance._startConnectionChecker()
  }
}

/**
 * @access public
 * @function stopChecker
 * @description Stops the execution of network validations and destroys active instance of Checker.
 */
const stopChecker = () => {
  if (isCheckerActive()) {
    _checkerInstance._stopConnectionChecker()
    _checkerInstance = null
  }
}

/**
 * @access public
 * @function checkOnDemand
 * @description Creates instance of Checker, execute a network validation once, and destroys the created instance.
 */
const checkOnDemand = () => {
  let instance = new Checker()
  instance._checkConnectionOnDemand()
    .finally(() => {
      instance = null
    })
}

export {
  getConnectionState,
  isCheckerActive,
  startChecker,
  stopChecker,
  checkOnDemand
}
