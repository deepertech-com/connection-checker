import { ON_NETWORK_CHECKING, ON_NETWORK_CHANGED, ON_NETWORK_CONNECTED, ON_NETWORK_DISCONNECTED } from 'Constants/Events'
import { connectionState, startConnectionChecker, stopConnectionChecker, checkConnectionOnDemand } from 'Checker'

exports.ConnectionEvent = {
  ON_NETWORK_CHECKING,
  ON_NETWORK_CHANGED,
  ON_NETWORK_CONNECTED,
  ON_NETWORK_DISCONNECTED
}
exports.connectionState = connectionState
exports.startConnectionChecker = startConnectionChecker
exports.stopConnectionChecker = stopConnectionChecker
exports.checkConnectionOnDemand = checkConnectionOnDemand
