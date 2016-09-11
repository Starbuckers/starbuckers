// pragma solidity ^0.4.1;
import "strings.sol";
import "BlockOneOracleClient.sol";

contract withEnlistedSecurities {
    using strings for *;
    modifier validSecurityCode(string securityCode) {
        var v1 = "BARC.L".toSlice();
        var v2 = securityCode.toSlice();
        
        if (v1.equals(v2)) {
            _
        }
    }
}

contract Starbuckers is withEnlistedSecurities, BlockOneOracleClient(){
    
    struct Account {
        uint cash;
        mapping (string => uint256) securitypositions;
    }
    
    enum State { PENDING, ACTIVE, REJECTED, CANCELLED }
    enum BuySell {BUY, SELL}
    enum TradeState {PENDING, EXECUTED, CANCELLED}
    
    struct Agreement{
        address from;
        address to;
        string securitycode; //e.g. BARC.L
        uint16 haircut; //in basis points, 1 basis point is 0.01% so 16 bit (65536) should be enough
        uint16 lendingrate; // in basis points
        State state;
    }
    
    struct Order {
        address from;
        address to;
        BuySell buysell;
        string securitycode;
        uint16 units;
        uint32 unitprice;
    }
    
    struct Trade {
        address buyer;
        address seller;
        string securitycode;
        uint16 units;
        uint32 unitprice;
        TradeState state;
    }
    
    Order[] buyOrders;
    Order[] sellOrders;
    Trade[] trades;
    
    uint256 marketprice;
    
    mapping (address => Account) accounts;
    
    function getAccountBalance(address _who, string _security) constant returns (uint cash, uint securitybalance) {
        cash = accounts[_who].cash;
        securitybalance = accounts[_who].securitypositions[_security];
    }
    
    Agreement[] public agreements;
    function getAgreement(uint _lendingId) constant returns (address from, address to, string securitycode, uint16 haircut, uint16 lendigrate) {
        var a = agreements[_lendingId];
        from = a.from;
        to = a.to;
        securitycode = a.securitycode;
        haircut = a.haircut;
        lendigrate = a.lendingrate;
    }
    
    function getAgreementArraySize() constant returns(uint256 size){
        size = agreements.length;
    }
    
    function processOrder(address _from, address _to, uint _buysell, string _securitycode, string _currency, uint16 _units, uint32 _unitprice) {
        BuySell bs = BuySell(_buysell);
    
        if (BuySell.BUY == bs){
            buyOrders.push( Order (_from, _to, bs, _securitycode, _units, _unitprice));
        }else{
            sellOrders.push( Order (_from, _to, bs, _securitycode, _units, _unitprice));
        }
    }    

        // if yes: 
        // delete the matched trade from Trades_pending
        // insert the trade into Trades_matched
        // and then call the trade processing function
        
        
        // if not, create hash and append it to Trades_pending

    function matchesOrders(uint256 indexBuy, uint256 indexSell) constant returns (bool matches){
        Order buy = buyOrders[indexBuy];
        Order sell = sellOrders[indexSell];
        if (buy.from != sell.to) return false;
        if (buy.to != sell.from) return false;
        var bcode = buy.securitycode.toSlice();
        var scode = sell.securitycode.toSlice();
        if (!bcode.equals(scode)) return false;
        if (buy.units != sell.units) return false;
        if (buy.unitprice != sell.unitprice) return false;
        return true;
    }
    
    function makeTrade(uint256 indexBuy, uint256 indexSell){
        if (!matchesOrders(indexBuy, indexSell)) throw;
        Order buy = buyOrders[indexBuy];
        trades.push(Trade(buy.from, buy.to, buy.securitycode, buy.units, buy.unitprice, TradeState.PENDING));
        delete buyOrders[indexBuy];
        delete sellOrders[indexSell];
    }
    
    function processTrade() {
    
        // check trade price
        
        //trade_price
        //if (trade_price > 0 and abs((market_price - trade price)/trade_price > 0.05 ) then
        //  cancelTrade();  
        //end
        
        // does the buyer have enough cash?
        //if (buyer does not have enough cash) {
        //  cancelTrade();
        //}
        
        // does the seller have enough securities
        //if (seller has enough securities) {
        //  bookTrade();
        //  return;
        //}
        
        // check lending agreements
        //securities_in_account
        
        //cycle through all lending agreements and get sum of available_securities to be lent
        
        //if (securities_in_account + available_securities) >= volume {
            // ok, we have enough
            // generate the securities loans and put securities into the sellers account
            
            // book the trade
            //bookTrade();

        //} else {
         //   cancelTrade();        
    }
    
    function proposeLendingAgreement(address _to, string _securitycode, uint16 _haircut, uint16 _lendigrate) validSecurityCode(_securitycode) {
       if (msg.sender == _to) throw; // don't propose to your self, selfish proposer.
       var a = Agreement(msg.sender, _to, _securitycode, _haircut, _lendigrate, State.PENDING);
       uint256 lendingId = agreements.length; //shortcut because lenght-1 is pos
       agreements.push(a);
       
       LogAgreementStateChange(a.from, a.to, lendingId, State.PENDING);
    }
    
    function  acceptLendingAgreement(uint _lendingId){
        bool found=false;
        var a = agreements[_lendingId];
        if (msg.sender != a.from) throw;
        if (State.PENDING != a.state) throw;
        
        a.state= State.ACTIVE;
        LogAgreementStateChange(a.from, a.to, _lendingId, State.ACTIVE);
    }
    
    function Starbuckers(){
    }
    
    event LogAgreementStateChange(address indexed _from, address indexed _to, uint indexed _lendingId, State  state);
    event BlockOneOracleClientTest_onOracleRequest(bytes32 _ric, uint _timestamp, uint _requestId);
  event BlockOneOracleClientTest_onOracleResponse(uint _requestId, uint last_trade);
  event BlockOneOracleClientTest_onOracleFailure(uint _requestId, uint _reason);

  function makeOracleRequest(bytes32 _ric, uint _timestamp) {
      BlockOneOracleClientTest_onOracleRequest(_ric,_timestamp,oracleRequestOneByMarketTime(_ric,_timestamp));
  }

  // Please implement this method to receive a success response from the Oracle, ensuring to match up requestId
  function onOracleResponse(uint _requestId, uint ts_millis, bytes32 _ric, uint last_trade, uint bid, uint ask, uint bid_size, uint ask_size) {
    // TODO
  }

  // Please implement this method to receive a failure response from the Oracle, ensuring to match up requestId
  function onOracleFailure(uint _requestId, uint _reason) {
    // TODO
  }
} 

contract StarbuckersDemo is Starbuckers{
    
    function init(address newGuy){
        mapping (string => uint256) secs;
        secs["BARC.L"] = 1000;
        accounts[newGuy] = Account(3000);
        accounts[newGuy].securitypositions["BARC.L"] = 500;
    }

    function StarbuckersDemo() {
        init(msg.sender);
    }
}
