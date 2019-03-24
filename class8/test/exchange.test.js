const Erc20 = artifacts.require("erc20");

const Exchange = artifacts.require("exchange");

contract("Exchange", async accounts=>{
	let exchangeAddress;
	let erc20Address;
	it("Should deploy the ERC20", async ()=>{
		await Erc20.deployed();
		erc20Address = Erc20.address;
		console.log("ERC20 address is");
		console.log(erc20Address);
		assert.notEqual(erc20Address, null, "the address is null");
	});
	it("Should deploy the exchange", async ()=>{
		await Exchange.deployed();
		exchangeAddress = Exchange.address;
		console.log("Exchange address is");
		console.log(exchangeAddress);
		assert.notEqual(exchangeAddress, null, "the address is null");
	});

	it("Should allow exchange to spend user balance", async ()=>{
		let instance = await Erc20.deployed();
		await instance.approve(exchangeAddress, 100);
		let exchangeAllowance = await instance.allowance(accounts[0], exchangeAddress);
		assert.equal(exchangeAllowance.valueOf(), 100, "the exchange is not allowed to move 100 tokens");
	});
	it("Should fund the user balance", async () =>{
		let token = await Erc20.deployed();
		let exchange = await Exchange.deployed();
		await exchange.depositToken(erc20Address, 100);
		await exchange.sendTransaction({from: accounts[0], value: 100});
		let tokenBalance = await exchange.getTokenBalance(accounts[0], erc20Address);
		let ethBalance = await exchange.getEthBalance(accounts[0]);
		console.log("token balance:");
		console.log(tokenBalance);
		assert.equal(tokenBalance, 100, "the user does not have 100 tokens in balance");
		assert.equal(ethBalance, 100, "the user does not have 100 wei in balance");

	});
	// it("User balance should have 100 tokens,", async ()=>
	// 	Exchange.deployed().then(instance=>{
	// 		instance.depositToken(erc20Address, 100);
	// 		return instance.getTokenBalance(accounts[0], erc20Address);
	// 	}).then(tokenBalance=>{
	// 		console.log("token balance:");
	// 		console.log(tokenBalance);
	// 		assert.equal(tokenBalance, 100, "the user does not have 100 tokens in balance");
	// 	})
	// );
	// it("User balance should have 100 wei", async ()=>
	// 	Exchange.deployed().then(instance=>{
	// 		instance.sendTransaction({from: accounts[0], value: 100});
	// 		return instance.getEthBalance(accounts[0]);
	// 	}).then(ethBalance=>{
	// 		assert.equal(ethBalance, 100, "the user does not have 100 wei in balance");
	// 	})
	// );
	it("Should place sell orders", async ()=>{
		let instance = await Exchange.deployed();
		await instance.sellToken(erc20Address, 20, 10);
		await instance.sellToken(erc20Address, 21, 10);
		await instance.sellToken(erc20Address, 22, 10);
		let sellOrders = await instance.getSellOrders(erc20Address);

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

	});
	it("Should buy 15 tokens", async ()=>{
		let instance = await Exchange.deployed();
		await instance.sendTransaction({from: accounts[0], value: 500});
		await instance.buyToken(erc20Address, 21, 15);
		let sellOrders = await instance.getSellOrders(erc20Address);

		let firstOrderPrice = sellOrders[0][0];
		let firstOrderVolume = sellOrders[1][0];
		let secondOrderPrice = sellOrders[0][1];
		let secondOrderVolume = sellOrders[1][1];

		assert.equal(firstOrderPrice, 21, "the first order is not priced at 21");
		assert.equal(firstOrderVolume, 5, "the first order does not have 5 tokens");
		assert.equal(secondOrderPrice, 22, "the second order is not priced at 22");
		assert.equal(secondOrderVolume, 10, "the second order does not have 10 tokens");

	});
});