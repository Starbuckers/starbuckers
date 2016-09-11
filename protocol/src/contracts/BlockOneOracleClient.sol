contract BlockOneOracle{function requestOneByMarketTime(bytes32 ric,uint256 timestamp)returns(uint256 );}
contract Registry{function get(string _name)constant returns(address );}

contract BlockOneOracleClient {

  // the below address is for the Edgware blockchain only
  Registry registry = Registry(0xe5483c010d0f50ac93a341ef5428244c84043b54);

  // used by both BlockOneOracle and BlockOneOracleClient
  uint8 constant ERR_NO_DATA            = 1;
  uint8 constant ERR_MARKET_CLOSED      = 2;
  uint8 constant ERR_INVALID_RIC        = 3;
  uint8 constant ERR_GENERAL_FAILURE    = 4;

  function getOracle() constant returns(address) {
    return registry.get("com.tr.oracle");
  }

  // returns requestId
  function oracleRequestOneByMarketTime(bytes32 _ric, uint _timestamp) returns(uint) {
    return BlockOneOracle(getOracle()).requestOneByMarketTime(_ric, _timestamp);
  }

  // Please implement this method to receive a success response from the Oracle, ensuring to match up requestId
  function onOracleResponse(uint _requestId, uint ts_millis, bytes32 _ric, uint last_trade, uint bid, uint ask, uint bid_size, uint ask_size);

  // Please implement this method to receive a failure response from the Oracle, ensuring to match up requestId
  function onOracleFailure(uint _requestId, uint _reason);
}
