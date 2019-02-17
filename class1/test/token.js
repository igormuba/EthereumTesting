const Token = artifacts.require("token");

contract("Token", accounts =>{
	it("should have 10 tokens", ()=>
		Token.deployed()
		.then(instance=>{
			instance.generateTokens();
			return instance.getBalance(accounts[0]);
		})
		.then(balance =>{
			assert.equal(balance.valueOf(), 20, "20 wasn't in the first account");
		})
		

		);
});