
var STRIPE_PUBLISH_KEY = 'pk_test_RGKxkdEnSS44hHOTqtPSgmKZ';
var STRIPE_API_KEY = 'sk_test_6ABXsM0XhaYnRnnv39c726N9';

var accounts = [];
var accounts_table;

var app = {
	
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", onDeviceReady, false);
        } else {
            this.onDeviceReady();
        }
    },

    onDeviceReady: function() {

    	/*
    	console.log(cordova.file.dataDirectory);
    	
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    	    console.log('file system open: ' + fs.name);
    	    fs.root.getFile("bunker-data.txt", { create: true, exclusive: false }, function (fileEntry) {

    	        console.log("fileEntry is file?" + fileEntry.isFile.toString());
    	        // fileEntry.name == 'someFile.txt'
    	        // fileEntry.fullPath == '/someFile.txt'
    	        writeFile(fileEntry, null);

    	    }, function (one, two, three){
    	    	console.log(one);
    	    	console.log(two);
    	    	console.log(three);
    	    });

    	}, onErrorLoadFs);
		*/

    }
};

$(document).ready(function () {

	Stripe.setPublishableKey(STRIPE_PUBLISH_KEY);

	accounts_table = $('#accounts-table');

    draw_accounts();

});


app.initialize();

function Account(name, initial_amount){
	this.balance = initial_amount;
	this.name = name;
}

function draw_accounts(){

	console.log('drawing', accounts);

	var html = '<tr><th></th><th>Name</th><th>Balance</th></tr>';
	for(var i = 0; i < accounts.length; i++){
		html += draw_account(accounts[i], i);
	}

	accounts_table.empty().append(html);
}

function draw_account(account, index){
	var buttons = '<td><input id="deposit-form-' + index + '" type="text"/>';
	buttons += '<button class="btn" onclick="change_account(' + index + ', true)">+</button>';
	buttons += '<button class="btn" onclick="change_account(' + index + ', false)">-</button></td>';

	var html = '';
	html += '<tr><td>' + (index + 1) + '</td>';
	html += '<td>' + account.name + '</td>';
	html += '<td>' + account.balance + '</td>';
	html += buttons;
	html += '</tr>';

	return html;
}

// add the account to the global object and update the list in the UI
function add_account(){

	var name = $('#new-account-form').val();

	var account = new Account(name, 0);
	accounts.push(account);

	draw_accounts();
}

function change_account(account_index, is_deposit){

	var amount = Number($('#deposit-form-' + account_index).val());

	if(is_deposit){
		accounts[account_index].balance += amount;
	}else{
		accounts[account_index].balance -= amount;
	}

	draw_accounts();
}

function deposit_money(){
	Stripe.card.createToken({
	    number: $('credit-card').val(),
	    cvc: $('cvc').val(),
	    exp_month: $('expr-month').val(),
	    exp_year: $('expr-year').val()
	}, use_stripe_token);
}

function use_stripe_token(status, response){
	if(status === 200){
		$.ajax({
	        method: 'POST',
	        url: "https://api.stripe.com/v1/charges",
	        headers: {
	            "Authorization": "Bearer " + STRIPE_API_KEY
	        },
	        data: "amount=400&currency=usd&source=" + token + "&description='Charging a credit card.'"
	    }).done(function(data){
	        console.log(data);
	    }).error(function(error){
	        console.log(error);
	    });
	}else{
		console.log(status, response);
	}	
}