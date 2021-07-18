co1nst prompt = require('prompt-sync')();

class GameController {

    constructor(xSize, ySize, playerX, playerY, gameArray, playerArray) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.playerX = playerX;
        this.playerY = playerY;
        this.gameArray = gameArray;
        this.playerArray = playerArray;
    }


    static initGamesJson() {
        const fs = require('fs');
        let gameJson = [];

        GameController.gameArray = [
            ['NorthWest', 'North', 'NorthEast'],
            ['West', 'Middle', 'East'],
            ['SouthWest', 'South', 'SouthEast'],
        ]

        GameController.mapSizeX = 3
        GameController.mapSizeY = 3

        let gameObject = {
            gameTitle: 'Example',
            gameSizeX: GameController.mapSizeX,
            gameSizeY: GameController.mapSizeY,
            gameData: GameController.gameArray
        }

        gameJson.push(gameObject);
        //console.log(userJson);

        // convert JSON object to string
        const data = JSON.stringify(gameJson, null, 4);

        // write JSON string to a file // Sync wait till finish
        fs.writeFileSync('games.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
            Main.restart();
        });
    }
//Test backup Funktion
    static addGame(xSize, ySize) {

        GameController.mapSizeX = xSize;
        GameController.mapSizeY = ySize;

        // create empty 2-dimensional array
        let gameArray = Array.from(Array(GameController.mapSizeY), () => new Array(GameController.mapSizeX));
        GameController.gameArray = gameArray;

        GameController.gameArray =
            [
                ['test', 'test'],
                ['test', 'test']
            ]

        // see in console
        GameController.gameArray.forEach((arrayLine, index) => {
            console.log(arrayLine);
        });

        GameController.saveGameData();
        GameController.initPlayerPosition(0, 0);
    }


    static saveGameData() {
        const fs = require('fs');
        let gameJson = [];
        gameJson = fs.readFileSync("games.json").toString();
        gameJson = JSON.parse(gameJson);
        // create a JSON object

        let gameObject = {
            gameTitle: '',
            gameSizeX: GameController.mapSizeX,
            gameSizeY: GameController.mapSizeY,
            gameData: GameController.gameArray
        }

        gameJson.push(gameObject);
        //console.log(userJson);

        // convert JSON object to string
        const data = JSON.stringify(gameJson, null, 4);

        // write JSON string to a file // Sync wait till finish
        fs.writeFileSync('games.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
            Main.restart();
        });
    }


    static moveNorth() {
        GameController.playerY--;

    }

    static moveWest() {
        GameController.playerX--;

    }

    static moveSouth() {
        GameController.playerY++;

    }

    static moveEast() {
        GameController.playerX++;

    }


    static setPlayerPosition() {

        let player = true;

        let edgeFlag = GameController.checkEdges();
        if (edgeFlag === true) {
            console.log("\x1b[31m%s\x1b[0m","Map Ende erreicht");
            GameController.moveFunction();
            return
        }

        // copy player position map from map size
        let playerArray = Array.from(Array(GameController.mapSizeY), () => new Array(GameController.mapSizeX));
        GameController.playerArray = playerArray;


        // clear position info
        GameController.playerArray.forEach((arrayLine, index) => {
            GameController.playerArray.forEach((arrayLineNested, indexNested) => {
                GameController.playerArray[index][indexNested] = false;
            });
        });

        // set player position
        GameController.playerArray[GameController.playerY][GameController.playerX] = player;

        // see console
        GameController.playerArray.forEach((arrayLine, index) => {
            console.log(arrayLine);
        });

        console.log("\x1b[32m%s\x1b[0m", '-----> Aktuelle Position: ' + GameController.gameArray[GameController.playerY][GameController.playerX] + ' <-----');

        GameController.moveFunction();
    }


    static checkEdges() {

        let edgeFlag = false;

        console.log('player x: '+GameController.playerX);
        console.log('player y: '+GameController.playerY);
        console.log('game x: '+GameController.mapSizeX);
        console.log('game y: '+GameController.mapSizeY);

        if (GameController.playerX+1 > GameController.mapSizeX) {
            GameController.playerX--;
            edgeFlag = true;
        }
        if (GameController.playerX < 0) {
            GameController.playerX++;
            edgeFlag = true;
        }
        if (GameController.playerY+1 > GameController.mapSizeY) {
            GameController.playerY--;
            edgeFlag = true;
        }
        if (GameController.playerY < 0) {
            GameController.playerY++;
            edgeFlag = true;
        }


        return edgeFlag;
    }

    static moveFunction() {
        console.log("\x1b[36m%s\x1b[0m", '!! W-A-S-D- Steuerung !!');
        console.log("\x1b[36m%s\x1b[0m", `!! "ESC" eingeben für exit !!`);
        let wasd = prompt('Warten auf Eingabe: ');
        switch (wasd) {
            case 'w': {
                GameController.moveNorth();
                GameController.setPlayerPosition();
                break
            }
            case 'a': {
                GameController.moveWest();
                GameController.setPlayerPosition();
                break
            }
            case 's': {
                GameController.moveSouth();
                GameController.setPlayerPosition();
            }
            case 'd': {
                GameController.moveEast();
                GameController.setPlayerPosition();
            }
            case 'ESC': {
                Main.mainMenu();
                break
            }
            default: {
                console.log("\x1b[31m%s\x1b[0m", "!!! Falsche eingabe !!!");
                GameController.moveFunction();
            }
        }
    }

    static initPlayerPosition(playerX, playerY) {

        GameController.playerX = playerX;
        GameController.playerY = playerY;

        GameController.setPlayerPosition();
    }


    static listGames() {
        const fs = require('fs');
        let gameJson = [];
        gameJson = fs.readFileSync("games.json").toString();
        gameJson = JSON.parse(gameJson);
        // create a JSON object

        gameJson.forEach((game, index) => {
            console.log(index + ': ' + game.gameTitle);
        });

        const choosenSection = prompt('Wählen Sie eine Zahl: ');

        GameController.gameArray = gameJson[choosenSection].gameData;
        GameController.mapSizeX = gameJson[choosenSection].gameSizeX;
        GameController.mapSizeY = gameJson[choosenSection].gameSizeY;
        console.log(GameController.gameArray = gameJson[choosenSection].gameData);


        GameController.initPlayerPosition(0, 0);
    }

}

class UserController {

    constructor(username, password, userJson, loginID) {
        this.username = username;
        this.password = password;
        this.userId = loginID;
        this.userJson = userJson;
    }

    static initUserJson() {
        const fs = require('fs');
        let userJson = [];
        // create a JSON object
        const nullobject = {
            "id": 0,
            "name": "nullObject",
            "password": "nullObject",
            "age": 0,
            "sex": 0
        };

        userJson.push(nullobject);
        //console.log(userJson);

        // convert JSON object to string
        const data = JSON.stringify(userJson, null, 4);

        // write JSON string to a file // Sync wait till finish
        fs.writeFileSync('user.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
            Main.restart();
        });
    }


    static loginUser() {

        const fs = require('fs');
        let userJson = [];
        userJson = fs.readFileSync("user.json").toString();
        userJson = JSON.parse(userJson);

        let nameArray = [];
        userJson.forEach((user, index) => {
            nameArray.push(user['name']);
        });

        typeUsername();

        function typeUsername() {
            let userName = prompt('Loginname: ');
            let foundPassword = '';
            let foundUserId = 0;
            let foundFlag = false;

            userJson.forEach(function (entry) {
                if (entry.name === userName) {
                    console.log('User gefunden in: ' + entry.id);
                    foundFlag = true;
                    foundPassword = entry.password;
                    foundUserId = entry.id;
                }
            });

            if (foundFlag === true) {

                typePassword();

                function typePassword() {
                    let userPassword = prompt('Passwort: ');

                    if (userPassword === foundPassword) {
                        console.log('Erfolgreich eingeloggt:');
                        Main.mainMenu(foundUserId);

                    } else {
                        console.log('Falsches Passwort:');
                        typePassword();
                    }
                }

            } else {

                console.log('User nicht gefunden');
                typeUsername();
            }
        }


    }

    static addUser() {

        const fs = require('fs');
        let userJson = [];
        userJson = fs.readFileSync("user.json").toString();
        userJson = JSON.parse(userJson);

        let nameArray = [];
        userJson.forEach((user, index) => {
            nameArray.push(user['name']);
        });


        let userName = prompt('Wählen Sie einen Namen: ');

        //check name Syntax
        if (/[^A-Za-z0-9]+/g.test(userName)) {

            console.log("Erlaubt sind Buchstaben und Zahlen.");
            console.log("Versuchen Sie es erneut. ");

            UserController.addUser();

        } else if (nameArray.includes(userName)) {

            console.log("Nutzer bereits vergeben");

            UserController.addUser();

        } else {

            UserController.username = userName;
            let userID = UserController.checkPassword();
            Main.mainMenu(userID);
        }
    }

    static checkPassword() {

        let userName = prompt('Wählen Sie ein Passwort: ');

        UserController.password = userName;

        console.log('Gewählter Name:' + UserController.username);
        console.log('Gewähltes Passwort: ' + UserController.password);

        const fs = require('fs');
        let userJson = [];
        userJson = fs.readFileSync("user.json").toString();
        userJson = JSON.parse(userJson);

        // create a JSON object
        const userObject = {
            "id": userJson.length,
            "name": UserController.username,
            "password": UserController.password,
            "age": 0,
            "sex": 0
        };

        console.log(userJson.length);

        userJson.push(userObject);
        //console.log(userJson);

        // convert JSON object to string
        const data = JSON.stringify(userJson, null, 4);

        // write JSON string to a file // Sync wait till finish
        fs.writeFileSync('user.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
            Main.restart();
        });

        return userJson.length - 1;


    }

}

class Main {

    static mainMenu(userId) {
        console.log('Aktive ID: ' + userId);
        console.log("1.Textadventure suchen (nicht funktionsfähig)");
        console.log("2.Textadventure Übersicht");
        if (userId === 0)
            console.log("3.Benutzer Anmelden:");
        else
            console.log("3.Benutzer Abmelden:");

        console.log("4.Benutzer Registrieren:");
        const choosenSection = prompt('Wählen Sie eine Zahl: ');

        switch (choosenSection) {
            case '1': {
                break;
            }
            case '2': {
                //GameController.addGame(2, 2);
                GameController.listGames();
                break;
            }
            case '3': {
                UserController.loginUser();
                break;
            }
            case '4': {
                UserController.addUser();
                break;
            }
            default:
                console.log("Diggi mach nisch diesen");
        }
    }
}


function run() {

    const fs = require('fs');

    let userFile = './user.json';
    if (!fs.existsSync(userFile))
        UserController.initUserJson();

    let gameFile = './games.json';
    if (!fs.existsSync(gameFile))
        GameController.initGamesJson();

    Main.mainMenu(0);


}

run();

