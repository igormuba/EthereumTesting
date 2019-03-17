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
	it("Should place sell orders", ()=>
		Exchange.deployed().then(instance=>{
			instance.sellToken(erc20Address, 20, 10);
			instance.sellToken(erc20Address, 21, 10);
			instance.sellToken(erc20Address, 22, 10);
			return instance.getSellOrders(erc20Address);
		}).then(sellOrders=>{
			let firstOrderPrice = sellOrders[0][0];
			let firstOrderVolume = sellOrders[1][0];
			let secondOrderPrice = sellOrders[0][1];
			let secondOrderVolume = sellOrders[1][1];
			let thirdOrderPrice = sellOrders[0][2];
			let thirdOrderVolume = sellOrders[1][2];

			assert.equal(firstOrderPrice, 20, "the first order is not priced at 20");
			assert.equal(firstOrderVolume, 10, "the first order does not have 10 tokens");
			assert.equal(secondOrderPrice, 21, "the second order is not priced at 21");
			assert.equal(secondOrderVolume, 10, "the second order does not have 10 tokens");
			assert.equal(thirdOrderPrice, 22, "the third order is not priced at 22");
			assert.equal(thirdOrderVolume, 10, "the third order does not have 10 tokens");
		})
	);
	it("Should buy 15 tokens", ()=>
		Exchange.deployed().then(instance=>{
			instance.sendTransaction({from: accounts[0], value: 500});
			instance.buyToken(erc20Address, 21, 15);
			return instance.getSellOrders(erc20Address);
		}).then(sellOrders=>{
			let firstOrderPrice = sellOrders[0][0];
			let firstOrderVolume = sellOrders[1][0];
			let secondOrderPrice = sellOrders[0][1];
			let secondOrderVolume = sellOrders[1][1];

			assert.equal(firstOrderPrice, 21, "the first order is not priced at 21");
			assert.equal(firstOrderVolume, 5, "the first order does not have 5 tokens");
			assert.equal(secondOrderPrice, 22, "the second order is not priced at 22");
			assert.equal(secondOrderVolume, 10, "the second order does not have 10 tokens");
		})
	);
	it("Should buy the remainder tokens and make a new buy order", ()=>
		Exchange.deployed().then(instance=>{
			instance.sendTransaction({from: accounts[0], value: 1000});
			console.log("buying 5 at 21");
			instance.buyToken(erc20Address, 21, 5);
			console.log("buying 10 at 22");
			instance.buyToken(erc20Address, 22, 10);
			console.log("buying 10 at 23");
			instance.buyToken(erc20Address, 23, 10);
			console.log("bought");
			return instance.getSellOrders(erc20Address);
			console.log("returned");
		}).then(sellOrders=>{
			console.log("Buy Book");
			console.log(buyOrders);
		})
	);
});