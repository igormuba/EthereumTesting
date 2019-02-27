const Erc20 = artifacts.require("erc20");

const Exchange = artifacts.require("exchange");

contract("Exchange", accounts=>{
	let exchangeAddress;
	let erc20Address;
	it("Should deploy the ERC20", ()=>
		Erc20.deployed().then(instance=>{
			erc20Address=Erc20.address;
			console.log("ERC20 address is");
			console.log(erc20Address);
			assert.notEqual(erc20Address, null, "the address is null");
		})
		);
	it("Should deploy the exchange", ()=>
		Exchange.deployed().then(instance=>{
			exchangeAddress=Exchange.address;
			console.log("Exchange address is");
			console.log(exchangeAddress);
			assert.notEqual(exchangeAddress, null, "the address is null");
		})
	);
	it("Should allow exchange to spend user balance", ()=>
		Erc20.deployed().then(instance=>{
			instance.approve(exchangeAddress, 100);
			return instance.allowance(accounts[0], exchangeAddress);
		}).then(exchangeAllowance=>{
			assert.equal(exchangeAllowance.valueOf(), 100, "the exchange is not allowed to move 100 tokens");
		})
	);
	it("User balance should have 100 tokens,", ()=>
		Exchange.deployed().then(instance=>{
			instance.depositToken(erc20Address, 100);
			return instance.getTokenBalance(accounts[0], erc20Address);
		}).then(tokenBalance=>{
			console.log("token balance:");
			console.log(tokenBalance);
			assert.equal(tokenBalance, 100, "the user does not have 100 tokens in balance");
		})
	);
	it("User balance should have 100 wei", ()=>
		Exchange.deployed().then(instance=>{
			instance.sendTransaction({from: accounts[0], value: 100});
			return instance.getEthBalance(accounts[0]);
		}).then(ethBalance=>{
			assert.equal(ethBalance, 100, "the user does not have 100 wei in balance");
		})
	);
});