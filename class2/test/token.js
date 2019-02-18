const Token = artifacts.require("token");

contract("Token", accounts =>{
	it("should have 10 tokens", ()=>
		Token.deployed()
		.then(instance=>{
			instance.generateTokens();
			return instance.getBalance(accounts[0]);
		})
		.then(balance =>{
			assert.equal(balance.valueOf(), 10, "10 wasn't in the first account");
		})
		

		);
	it("should have 7 tokens on account 0", ()=>
		Token.deployed().then(instance=>{
			instance.transfer(accounts[1], 3);
			return instance.getBalance(accounts[0]);
		}).then(balance=>{
			assert.equal(balance.valueOf(), 7, "7 isn't the balance of account 0");
		})
		);
	it("should have 3 tokens on account 0", ()=>
		Token.deployed().then(instance=>{
			return instance.getBalance(accounts[1]);
		}).then(balance=>{
			assert.equal(balance.valueOf(), 3, "3 isn't the balance of account 1");
		})
		);
	it("should have a balance between 0 and 10", ()=>
		Token.deployed().then(instance=>{
			instance.transfer(accounts[1], 8)
			return instance.getBalance(accounts[0]);
		}).then(balance=>{
			console.log("This is the balance of the user 0:");
			console.log(parseInt(balance));
			let between = balance>=0 && balance<=10;
			assert.isTrue(between, "account 0 balance is not between 0 and 10")
		})
		);
});