'use strict';

angular.module('newTicApp')
  .controller('MainCtrl', function ($scope, angularFire) {
	// bind to firebase
  	$scope.games = [];
    $scope.queue = {};

    // bind to angular templates
    $scope.player = "";
    $scope.gameId = -1;

  	var games = new Firebase("https://fire-base-tictactoe.firebaseio.com/games/");
  	angularFire(games, $scope, "games").then(function (){

	  	var queue = new Firebase("https://fire-base-tictactoe.firebaseio.com/games/queue/");
	      angularFire(queue, $scope, "queue").then(function (){
		      if($scope.queue.gameId == undefined) {
		          $scope.player = "p1";
		          console.log($scope.player);
		          // create game
		          var newGame = {
		            ticTacToe: [[{value:""},{value:""},{value:""}],
		  						[{value:""},{value:""},{value:""}],
		  						[{value:""},{value:""},{value:""}]],
		            turn: "p1",
		            gameOver: false,
		            turnNum: 0,
		            waiting: true,
		            xWin: false,
		            yWin: false,
		            showDetails: false,
		            timer: 0,
		            winCount: 0
		          };
		          // add game id to queue
		          $scope.gameId = $scope.games.push(newGame) - 1;  // the - 1 matches the index of the array since arrays start at 0g
		          $scope.queue.gameId = $scope.gameId;  
	          }
	        else {
	          $scope.player = "p2";
	          console.log($scope.player)
	          // read game id from queue
	          $scope.gameId = $scope.queue.gameId;
	          $scope.games[$scope.gameId].waiting = false;
	          //clear the queue
	          $scope.queue = {};
	          }
			});
		});
		// work on timing 2nd player
		// $scope.timeOut = function () {
		// 	// increment the time
	 //        $scope.games[$scope.gameId].timer += 500;

	 //        if($scope.games[$scope.gameId].timer == 5000)
	 //        	$scope.queue.gameId = {};
		//         $scope.games[$scope.gameId].waiting = true;
		// };

		$scope.newGame = function () {
			$scope.games[$scope.gameId].showDetails = true;
		};
		
		$scope.clickBox = function(cell) {

			// add play limitation
			if($scope.player == $scope.games[$scope.gameId].turn) {
				// prevents overwriting
				if(cell.value != "")
					return;
				// alternates turns
				if($scope.games[$scope.gameId].turnNum % 2 == 0) {
					cell.value = "X";
					}
				else {
					cell.value = "O";
					}

				++$scope.games[$scope.gameId].turnNum;
				if($scope.games[$scope.gameId].turnNum == 9)
					alert("It's a tie!");

				if ($scope.player == 'p1') {
			        $scope.games[$scope.gameId].turn = 'p2';
			      }  
			      else {
			        $scope.games[$scope.gameId].turn = 'p1';
			      }
				};
			$scope.wins(cell);
		};
		// win conditions
		$scope.wins = function() {

			// for convenience
			var tic = $scope.games[$scope.gameId].ticTacToe;

			// win possibilities for future implementation
			// var winz=[[[0,0] [0,1], [0,2]],[[1,0], [1,2], [1,3]],[[2,0], [2,1], [2,2]],
			// 		  [[0,0] [1,0], [2,0]],[[0,1], [1,1], [2,1]],[[0,2], [1,2], [2,2]],
			// 		  [[0,0] [0,1], [0,2]],[[1,0], [1,2], [1,3]];

			// for(var i = 0; i < winz.length; ++i)
			// if ((tic[winz[i][0].value] == tic[winz[i][1].value]) && 
			// 	(tic[winz[i][1].value] == tic[winz[i][2].value]) &&
			// 	(tic[winz[i][0].value] != "")) {
			// 	if(tic[winz[i][0].value] == "X")
			// 		$scope.xWin = true;
			// 	else
			// 		$scope.yWin = true;
			// }

			for(var x=0; x<=2; ++x) {
			if(tic[0][x].value == tic[1][x].value &&
				tic[1][x].value == tic[2][x].value &&
				tic[0][x].value != "") {
				if(tic[0][x].value == "X")
					$scope.games[$scope.gameId].xWin = true;
				
				else
					$scope.games[$scope.gameId].yWin = true;

				}
			if(tic[x][0].value == tic[x][1].value &&
				tic[x][1].value == tic[x][2].value &&
				tic[x][0].value != "") {
				if(tic[x][0].value == "X")
					$scope.games[$scope.gameId].xWin = true;
				
				else
					$scope.games[$scope.gameId].yWin = true;
				}
			};

			if(tic[0][0].value == tic[1][1].value &&
				tic[1][1].value == tic[2][2].value &&
				tic[0][0].value != "") {
				if(tic[0][0].value == "X")
					$scope.games[$scope.gameId].xWin = true;
				
				else
					$scope.games[$scope.gameId].yWin = true;
				}
			
			if(tic[2][0].value == tic[1][1].value &&
				tic[1][1].value == tic[0][2].value &&
				tic[0][2].value != "") {
				if(tic[0][2].value == "X")
					$scope.games[$scope.gameId].xWin = true;
				else
					$scope.games[$scope.gameId].yWin = true;
				}		
		};

		// resets game
		$scope.resetGame = function() {
			var tic = $scope.games[$scope.gameId].ticTacToe;
			for(var r in tic)
				for(var c in tic[r]) 
					tic[r][c].value = '';
			$scope.games[$scope.gameId].turnNum = 0;
			$scope.games[$scope.gameId].xWin = false;
			$scope.games[$scope.gameId].yWin = false;
			$scope.games[$scope.gameId].showDetails = false;
		};
});

