//Nick, don't delete the next line
/*global localStorage */


//varables for disaster ballence
var chancePerSecond = 60;                                       //Theoretically this is the average number of seconds from the end of one disaster to the start of the next. In practice I have found the actual average time is less than this number.
var dispersionCostMult = 1.5;                                   //When a disaster spawns this is the multiplier on your current funds that the dispersion cost will be
var livesLostPerSecond = [300000, 350000, 400000, 450000];      //How many lives per second each disaster will take
//end of sisaster ballence variables


var started = false;
var tickSpeed = 250;
var dollars = 0;
var disastersMade = 0;
var disastersDefeted = 0;
var livesLeft = 7500000000;
var livesLost = 0;
var disasterDispersementCost = 0;
var resources = ["worker", "rescueTeam", "medevac"];
var upgrades = ["harderHats","raftierRafts","biggerRotors"];
var disasters = ["tornado", "hurricane", "flood", "earthquake", "none"];
var resourceAmount = [];
var resourceMult = [];
var upgradeAmount = [];

var currentDisaster = 4;

function setupGame(){
	loadSave();

	for(var i = 0 ; i < resources.length; i++){
	    if(resourceAmount.length < 1){
            resourceAmount.push(0);
            upgradeAmount.push(0);
        }

        resourceMult.push((i + 1) * Math.pow(2, upgradeAmount[i]));
        
        document.getElementById(resources[i]).innerHTML = resourceAmount[i];
        document.getElementById(resources[i] + 'Cost').innerHTML = Math.floor(((i + 1) * 10) * Math.pow(1.1,resourceAmount[i]));
        document.getElementById(upgrades[i] + 'Mult').innerHTML = resourceMult[i];
        document.getElementById(upgrades[i] + 'Cost').innerHTML = Math.floor(((i + 1) * 100) * Math.pow(15,upgradeAmount[i]));
	}

	document.getElementById('DPS').innerHTML = calculateDPS();
	setDPSPercent();
	
	var x = document.getElementById('tornadoDiv');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
    var y = document.getElementById('hurricaneDiv');
    if (y.style.display === 'none') {
        y.style.display = 'block';
    } else {
        y.style.display = 'none';
    }
    var z = document.getElementById('floodDiv');
    if (z.style.display === 'none') {
        z.style.display = 'block';
    } else {
        z.style.display = 'none';
    }
    var q = document.getElementById('earthquakeDiv');
    if (q.style.display === 'none') {
        q.style.display = 'block';
    } else {
        q.style.display = 'none';
    }
}

function loadSave(){
	if (true){
		dollars = parseInt(localStorage.getItem("dollars"));
		
		console.log(isNaN(parseInt(localStorage.getItem("dollars"))));
		
		for(var i = 0 ; i < resources.length; i++){
		    resourceAmount[i] = parseInt(localStorage.getItem(resources[i]));
		    upgradeAmount[i] = parseInt(localStorage.getItem(upgrades[i]));
		}
    }
    console.log("Game Loaded");
}

function savegame(){
	if(!isNaN(dollars)){
	    localStorage.setItem("dollars", dollars);
	}
	else{
	    dollars = 0;
	    localStorage.setItem("dollars", 0);
	}

	for(var i = 0 ; i < resources.length; i++){
	    localStorage.setItem(resources[i], resourceAmount[i]);
	    localStorage.setItem(upgrades[i], upgradeAmount[i]);
	}
}

function resetGame(){
    console.log("Reset");
    
    dollars = 0;              //Change this to set how many dollars you get when you reset
	
	for(var i = 0 ; i < resources.length; i++){
	    resourceAmount[i] = 0;
	    resourceMult[i] = (i + 1);
	    upgradeAmount[i] = 0;
	    localStorage.setItem(resources[i], 0);
	    localStorage.setItem(upgrades[i], 0);
	    document.getElementById(resources[i]).innerHTML = resourceAmount[0];
	    document.getElementById(resources[i] + 'Cost').innerHTML = (i + 1) * 10;
	    document.getElementById(upgrades[i] + 'Mult').innerHTML = i + 1;
        document.getElementById(upgrades[i] + 'Cost').innerHTML = (i + 1) * 100;
	}
	
	document.getElementById('dollars').innerHTML = 0;
	document.getElementById('DPS').innerHTML = calculateDPS();
	setDPSPercent();
}

function moneyClick(number){
    dollars = dollars + number;									 //Get that cash money
    document.getElementById("dollars").innerHTML = dollars;
}

function popOut(){
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function debugPapa(){
    
    var screenWidth = window.innerWidth
||	document.documentElement.clientWidth
||	document.body.clientWidth;

    var screenHeight = window.innerHeight
||	document.documentElement.clientHeight
||	document.body.clientHeight;

    console.log(screenWidth);
    console.log(screenHeight);
    
    
}

function pickDisaster(number){
    switch(number) {
        case 1:
            //Tornado
            var x = document.getElementById('tornadoDiv');
            if (x.style.display === 'none') {
                x.style.display = 'block';
                currentDisaster = 0;
            } else {
                x.style.display = 'none';
                currentDisaster = 4;
            }
        break;
        case 2:
            //Hurricane
            var y = document.getElementById('hurricaneDiv');
            if (y.style.display === 'none') {
                y.style.display = 'block';
                currentDisaster = 1;
            } else {
                y.style.display = 'none';
                currentDisaster = 4;
            }
        break;
        case 3:
            //Flood
            var z = document.getElementById('floodDiv');
            if (z.style.display === 'none') {
                z.style.display = 'block';
                currentDisaster = 2;
            } else {
                z.style.display = 'none';
                currentDisaster = 4;
            }
        break;
        case 4:
            //Earthquake
            var q = document.getElementById('earthquakeDiv');
            if (q.style.display === 'none') {
                q.style.display = 'block';
                currentDisaster = 3;
            } else {
                q.style.display = 'none';
                currentDisaster = 4;
            }
        break;
    }
}

function removeTornado() {
    var x = document.getElementById('tornadoDiv');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        
        if(dollars >= disasterDispersementCost){
            x.style.display = 'none';
            dollars -= disasterDispersementCost;
            disastersDefeted ++;
            document.getElementById('disastersDefeted').innerHTML = disastersDefeted;
            currentDisaster = 4;
            document.getElementById('disasterDispersementCost').innerHTML = 0;
        }
    }
}

function removeHurricane() {
    var y = document.getElementById('hurricaneDiv');
    if (y.style.display === 'none') {
        y.style.display = 'block';
    } else {
        
        if(dollars >= disasterDispersementCost){
            y.style.display = 'none';
            dollars -= disasterDispersementCost;
            disastersDefeted ++;
            document.getElementById('disastersDefeted').innerHTML = disastersDefeted;
            currentDisaster = 4;
            document.getElementById('disasterDispersementCost').innerHTML = 0;
        }
    }
}

function removeFlood() {
    var z = document.getElementById('floodDiv');
    if (z.style.display === 'none') {
        z.style.display = 'block';
    } else {
        
        if(dollars >= disasterDispersementCost){
            z.style.display = 'none';
            dollars -= disasterDispersementCost;
            disastersDefeted ++;
            document.getElementById('disastersDefeted').innerHTML = disastersDefeted;
            currentDisaster = 4;
            document.getElementById('disasterDispersementCost').innerHTML = 0;
        }
    }
}

function removeEarthquake() {
    var q = document.getElementById('earthquakeDiv');
    if (q.style.display === 'none') {
        q.style.display = 'block';
    } else {
        
        if(dollars >= disasterDispersementCost){
            q.style.display = 'none';
            dollars -= disasterDispersementCost;
            disastersDefeted ++;
            document.getElementById('disastersDefeted').innerHTML = disastersDefeted;
            currentDisaster = 4;
            document.getElementById('disasterDispersementCost').innerHTML = 0;
        }
    }
}

function buyResource(number){
    var resourceCost = Math.floor(((number + 1) * 10) * Math.pow(1.1,resourceAmount[number]));      //works out the cost of this worker
    if(dollars >= resourceCost){                                                                    //checks that the player can afford the worker
        resourceAmount[number] = resourceAmount[number] + 1;                                        //increases number of workers
    	dollars = dollars - resourceCost;                                                           //removes the dollars spent
        document.getElementById(resources[number]).innerHTML = resourceAmount[number];              //updates the number of workers for the user
        document.getElementById('dollars').innerHTML = dollars;                                     //updates the number of dollars for the user
    }
    var nextCost = Math.floor(((number + 1) * 10) * Math.pow(1.1,resourceAmount[number]));          //works out the cost of the next worker
    document.getElementById(resources[number] + 'Cost').innerHTML = nextCost;                       //updates the worker cost for the user
    document.getElementById('DPS').innerHTML = calculateDPS();
    setDPSPercent();
    //console.log(resourceMult);
}

function buyUpgrade(number){
    var upgradeCost = Math.floor(((number + 1) * 100) * Math.pow(15,upgradeAmount[number]));
    if(dollars >= upgradeCost){                                                                    //checks that the player can afford the worker
        upgradeAmount[number] = upgradeAmount[number] + 1;                                        //increases number of workers
        resourceMult[number] = resourceMult[number] * 2;
    	dollars = dollars - upgradeCost;                                                           //removes the dollars spent
        //document.getElementById('harderHats' + 'Mult').innerHTML = 1;              //updates the number of workers for the user
        document.getElementById(upgrades[number] + 'Mult').innerHTML = resourceMult[number];              //updates the number of workers for the user
        document.getElementById('dollars').innerHTML = dollars;                         //updates the number of dollars for the user
        console.log("Nick is DUMB!!!");
    }   
    var nextCost = Math.floor(((number + 1) * 100) * Math.pow(15,upgradeAmount[number]));          //works out the cost of the next worker
    document.getElementById(upgrades[number] + 'Cost').innerHTML = nextCost;                       //updates the worker cost for the user
    document.getElementById('DPS').innerHTML = calculateDPS();
    setDPSPercent()
    //console.log(upgrades[number]);
}

function naturalDisaster(){
    if(Math.floor((Math.random() * (chancePerSecond * (1000 / tickSpeed))) + 1) > (chancePerSecond * (1000 / tickSpeed)) - 1 && currentDisaster == 4 && dollars >= 10){
        pickDisaster(Math.floor((Math.random() * 4) + 1));
        disasterDispersementCost = Math.floor(dollars * dispersionCostMult);
        document.getElementById('disasterDispersementCost').innerHTML = disasterDispersementCost;
    }
    
    if(currentDisaster != 4){
        livesLeft -= livesLostPerSecond[currentDisaster];
        livesLost += livesLostPerSecond[currentDisaster];
        
        document.getElementById('livesLeft').innerHTML = livesLeft;
        document.getElementById('livesLost').innerHTML = livesLost;
    }
}

function calculateDPS(){
    var DPS = 0;
    for(var i = 0 ; i < resourceAmount.length; i++) {
        DPS += resourceAmount[i] * resourceMult[i];
	}
	
	DPS *= (1000 / tickSpeed)
	return DPS;
}

function setDPSPercent(){
    for(var i = 0 ; i < resources.length; i++){
        if(calculateDPS() != 0){
            document.getElementById(resources[i] + 'Percentage').innerHTML = parseFloat(Math.round((((resourceAmount[i] * resourceMult[i]) / calculateDPS()) * 100 * (1000 / tickSpeed)) * 100) / 100).toFixed(2);
        }
        else{
            document.getElementById(resources[i] + 'Percentage').innerHTML = 0;
        }
    }
}

function start(){
    started = true;
    var o = document.getElementById('startMarkDiv');
    o.style.display = 'none';
}

window.setInterval(function(){
    if(started == true){
        for(var i = 0 ; i < resources.length; i++){
            moneyClick(resourceAmount[i] * (resourceMult[i]));
        }
        
        naturalDisaster();
        
        savegame();
    }
    
}, tickSpeed);

window.onload = setupGame;