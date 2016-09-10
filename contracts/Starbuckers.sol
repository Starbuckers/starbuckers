pragma solidity ^0.4.1;
import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract withEnlistedSecurities {
    using strings for *;
    modifier validSecurityCode(string securityCode) {
        var v1 = "BARC.L".toSlice();
        var v2 = securityCode.toSlice();
        
        if (v1.equals(v2)) {
            _;
        }
    }
}

contract Starbuckers is withEnlistedSecurities{
    
    struct Account {
        uint cash;
        mapping (string => uint256) securitypositions;
    }
    
    enum State { PENDING, ACTIVE, REJECTED, CANCELLED }
    
    struct Agreement{
        address from;
        address to;
        string securitycode; //e.g. BARC.L
        uint16 haircut; //in basis points, 1 basis point is 0.01% so 16 bit (65536) should be enough
        uint16 lendingrate; // in basis points
        State state;
    }
    
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
} 

contract StarbuckersDemo is Starbuckers{
    
    function init(address newGuy){
        mapping (string => uint256) secs;
        secs["BARC.L"] = 1000;
        accounts[newGuy] = Account(1000);
        accounts[newGuy].securitypositions["BARC.L"] = 1000;
    }
}
