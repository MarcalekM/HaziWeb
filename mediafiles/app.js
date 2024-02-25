let app = angular.module("calculatorApp", []);

app.controller("CalculatorController", function($scope, $http){

    $scope.teamMembers = [];
    for (let i = 0; i < 10; i++){
        $scope.teamMembers.push(
            {
                firstName: "",
                lastName: "",
                speed: "",
                totalDistance: 0
            })
    };

    $http.get("stages.json")
    .then(function(response){
        $scope.stages = response.data;
        console.log($scope.stages);

        let totalDistance = 0;
        angular.forEach($scope.stages, function(stage) {
            totalDistance += stage.distance;
            console.log(totalDistance);
            $scope.runnerDistance[stage.runner] = totalDistance;
        });
    });

    $scope.updateRunners = function(){
        $scope.runners = [];
        angular.forEach($scope.teamMembers, function(member){
            let fullName = member.firstName + ' ' + member.lastName;

            if($scope.runners.indexOf(fullName) === -1){
                $scope.runners.push(fullName);
            }
        });
    };

    $scope.formatTime = function(member){
        if(member.speed && member.speed.length === 4){
            member.speed = member.speed.slice(0,2) + ":" + member.speed.slice(2);
        }
    };

    $scope.getRunnerSpeed = function(runner){
        let selectedRunner = $scope.teamMembers.find(member => {
            return member.firstName + " " + member.lastName === runner;
        });
        if(!selectedRunner || !selectedRunner.speed){
            return 0;
        };
        //perc - másodperc
        let [minutes, seconds] = selectedRunner.speed.split(':')
        //perc to mp
        let totalSeconds  = parseInt(minutes) * 60 + parseInt(seconds);
        console.log(totalSeconds);
        return totalSeconds;
    };

    $scope.calculateTime = function(distance, speed){
        //ellenőrzés
        if(isNaN(distance) || isNaN(speed) || speed <= 0){
            return "00:00:00";
        };
        let timeMinutes = (distance * speed);
        let hours = Math.floor(timeMinutes / 60);
        let minutes = Math.floor(timeMinutes % 60);
        let seconds = Math.floor(timeMinutes % 1) * 60;
        //idő formázás

        let formattedTime = (hours < 10 ? "0" : "") + hours + ":" + 
                            (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        console.log(formattedTime);
        return formattedTime;
    };

    $scope.runnerDistance = {};
    for (let index = 0; index < 10; index++) {
        $scope.runnerDistance["runner" + 1] = 0;
    };

    $scope.calculateTotalDistance = function(distance, runner){
        console.log("Runner's name: " + runner + ", distance covered: " + distance);
    };
});
