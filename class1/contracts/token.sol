pragma solidity ^0.5.0;

contract token{
	mapping (address => uint) balances;

	function generateTokens() public{
		balances[msg.sender]+=10;
	}

	function transfer(address _receiver, uint _amount) public{
		balances[msg.sender]-=_amount;
		balances[_receiver]+=_amount;
	}

	function getBalance(address _owner)public view returns(uint){
		return balances[_owner];
	}
}