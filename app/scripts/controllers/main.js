'use strict';

angular.module('newTicApp')
  .controller('MainCtrl', ['$scope', 'angularFire', function ($scope, angularFire) {
	// bind to firebase
  	$scope.games = [];
    $scope.queue = {};

    // bind to angular templates
    $scope.player = "";
    $scope.gameId = -1;

  	var database = new Firebase("https://fire-base-tictactoe.firebaseio.com/games/");
  	angularFire(database, $scope, "games").then(function(){

  		var queueRef = new Firebase("https://game-logic-tehpeh.firebaseio.com/queue");
      angularFire(queueRef, $scope, "queue").then(function() {
	      if($scope.queue.gameId == undefined) {
          $scope.player = "p1";
          console.log($scope.player);
          // create game
          var newGame = {
            ticTacToe: [[{value:""},{value:""},{value:""}],
  						[{value:""},{value:""},{value:""}],
  						[{value:""},{value:""},{value:""}]],
            turn: "p1",
            // gameOver: false,
            turnNum: 0,
          };

          $scope.gameId = $scope.games.push(newGame) - 1;  // the - 1 matches the index of the array since arrays start at 0g
          $scope.queue.gameId = $scope.gameId;

          // add game id to queue
          }
        else {
          $scope.player = "p2";
          console.log($scope.player)
          // read game id from queue
          $scope.gameId = $scope.queue.gameId;
          $scope.games[$scope.gameId].turn = "p2";
          //clear the queue
          $scope.queue = {};
          }
		});
	});

		$scope.clickBox = function(cell) {

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
			      }  else {
			        $scope.games[$scope.gameId].turn = 'p1';
			      }
			}

			$scope.wins(cell);

			// add play limitation
			

		}
		// win conditions
		$scope.wins = function() {

			// for convenience
			var tic = $scope.games[$scope.gameId].ticTacToe;

			// win possibilities
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
					$scope.xWin = true;
				else
					$scope.yWin = true;
				}
			if(tic[x][0].value == tic[x][1].value &&
				tic[x][1].value == tic[x][2].value &&
				tic[x][0].value != "") {
				if(tic[x][0].value == "X")
					$scope.xWin = true;
				else
					$scope.yWin = true;
				}
			};

			if(tic[0][0].value == tic[1][1].value &&
				tic[1][1].value == tic[2][2].value &&
				tic[0][0].value != "") {
				if(tic[0][0].value == "X")
					$scope.xWin = true;
				else
					$scope.yWin = true;
				}
			
			if(tic[2][0].value == tic[1][1].value &&
				tic[1][1].value == tic[0][2].value &&
				tic[0][2].value != "") {
				if(tic[0][2].value == "X")
					$scope.xWin = true;
				else
					$scope.yWin = true;
				}		
		}
		// resets game
		$scope.resetGame = function() {
			var tic = $scope.games[$scope.gameId].ticTacToe;

			for(var r in tic)
				for(var c in tic[r]) 
					tic[r][c].value = '';
			$scope.games[$scope.gameId].turnNum = 0;
			$scope.xWin = false;
			$scope.yWin = false;
			$scope.showDetails = false;
		}

}]);
