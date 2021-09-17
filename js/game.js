let gameScene = new Phaser.Scene('Game');

gameScene.init = function () {

    this.myInput = document.querySelector('input');
    this.ballPos = {
        '0' : {
            x: 200,
            y: 101
        },
        '1' : {
            x: 130,
            y: 271
        },
        '2' : {
            x: 284,
            y: 148
        },
        '3' : {
            x: 167,
            y: 107
        },
        '4' : {
            x: 262,
            y: 122
        },
        '5' : {
            x: 190,
            y: 300
        },
        '6' : {
            x: 298,
            y: 212
        },
        '7' : {
            x: 114,
            y: 147
        },
        '8' : {
            x: 241,
            y: 291
        },
        '9' : {
            x: 100,
            y: 212
        },
        '10' : {
            x: 208,
            y: 300
        },
        '11' : {
            x: 269,
            y: 273
        },
        '12' : {
            x: 137,
            y: 123
        },
        '13' : {
            x: 288,
            y: 244
        },
        '14' : {
            x: 110,
            y: 244
        },
        '15' : {
            x: 232,
            y: 107
        },
        '16' : {
            x: 157,
            y: 291
        },
        '17' : {
            x : 297,
            y : 179
        },
        '18' : {
            x: 102,
            y: 179
        },
        '19' : {
            x: 248,
            y: 113
        },
        '20' : {
            x: 118,
            y: 258
        },
        '21' : {
            x: 275,
            y: 133
        },
        '22' : {
            x: 101,
            y: 195
        },
        '23' : {
            x: 224,
            y: 296
        },
        '24' : {
            x: 174,
            y: 297
        },
        '25' : {
            x: 292,
            y: 163
        },
        '26' : {
            x: 183.3,
            y: 102
        },
        '27' : {
            x: 295,
            y: 229
        },
        '28' : {
            x: 125,
            y: 134
        },
        '29' : {
            x: 106,
            y: 163
        },
        '30' : {
            x: 256,
            y: 284
        },
        '31' : {
            x: 103,
            y: 228
        },
        '32' : {
            x: 216,
            y: 102
        },
        '33' : {
            x: 142,
            y: 282
        },
        '34' : {
            x: 299,
            y: 195
        },
        '35' : {
            x: 152,
            y: 113
        },
        '36' : {
            x: 282,
            y: 259
        },
        '37' : {
            x: 262,
            y: 123
        },
    }
    this.startGame = false;
    this.ballFindPos = false;
    this.number = null;
    this.btnWasClicked = false;
}

gameScene.preload = function () {

    this.load.image('roulette', 'assets/roulette.jpg');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('btn', 'assets/btn.png')
}

gameScene.create = function () {

    this.roulette = this.add.sprite(200, 200, 'roulette');
    this.roulette.setScale(0.5);

    this.ball = this.add.sprite(200, 40, 'ball');
    this.ball.setScale(0.7);
    this.ball.depth = 1;

    this.ballGroup = this.add.group({
        key: 'ball',
        repeat: 37,
    });

    Phaser.Actions.ScaleXY(this.ballGroup.getChildren(), -0.3, -0.3);
    Phaser.Actions.IncAlpha(this.ballGroup.getChildren(), -1);

    let iterator = 0;
    Phaser.Actions.Call(this.ballGroup.getChildren(), function (ball) {
        ball.x = this.ballPos[iterator + ''].x;
        ball.y = this.ballPos[iterator + ''].y;
        iterator++;
    }, this);

    this.enterNumber = this.add.text(385, 150, 'Enter number', {
        font: '24px Arial',
        fill: '#76ffaa'
    });

    this.myInput.oninput = this.inputColor.bind(this);
    this.myInput.onkeydown = this.setNumber.bind(this);

    this.btn = this.add.sprite(460, 300, 'btn').setInteractive();
    this.btn.setScale(0.5);

    this.btn.on('pointerdown', this.rotateRoulette);
}

gameScene.update = function () {

    if (this.startGame) {

        if (!this.ballFindPos) {

            Phaser.Actions.RotateAroundDistance([this.ball], {x: 200, y: 200}, 0.03, this.circleTween.getValue());
            Phaser.Actions.RotateAroundDistance(this.ballGroup.getChildren(), {x: 200, y: 200}, -0.035, 100);

            if (this.circleTween.getValue() === 100 && Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(),
                this.ballGroup.getChildren()[this.number].getBounds())) {

                    this.ballFindPos = true;

                    this.tweens.add({
                        targets: this.ball,
                        duration: 35,
                        x: this.ballGroup.getChildren()[this.number].x,
                        y: this.ballGroup.getChildren()[this.number].y,
                        pause: false,
                        onComplete : () => {
                            this.time.addEvent({
                                delay: 3000,
                                repeat: 0,
                                callback: () => {
                                    this.scene.restart();
                                    this.myInput.classList.remove('hide');
                                    this.myInput.oninput = null;
                                    this.myInput.onkeydown = null;
                                },
                            })
                        }
                    })

            }
        } else {
            Phaser.Actions.RotateAroundDistance([this.ball], {x: 200, y: 200}, -0.035, 100);
        }

    }
    this.myInput.style.left = this.sys.game.canvas.offsetLeft + this.sys.game.config.width / 1.6 + 'px';
    this.myInput.style.top = this.sys.game.canvas.offsetTop + this.sys.game.config.height / 2 + 'px';
}

gameScene.rotateRoulette = function () {

    if (!this.scene.number && this.scene.number !== 0 || this.scene.btnWasClicked) return;

    this.scene.btnWasClicked = true;
    this.scene.myInput.classList.add('hide');

    this.scene.rouletteTween = this.scene.tweens.add({
        targets: this.scene.roulette,
        duration: 3000,
        angle: -360,
        pause: false,
        repeat: -1
    })

    this.scene.circleTween = this.scene.tweens.addCounter({
        from: 160,
        to: 100,
        duration: 4000,
        delay: 4000,
        ease: 'Sine.easeInOut',
        repeat: 0,
    });

    this.scene.startGame = true;
}

gameScene.inputColor = function () {
    if (+this.myInput.value <= 36 && +this.myInput.value >= 0) {
        this.myInput.style.backgroundColor = 'green';
    }
    else {
        this.myInput.style.backgroundColor = 'red';
    }
}

gameScene.setNumber = function (event) {
    if (event.key === 'Enter' && this.myInput.style.backgroundColor !== 'red') {
        this.number = +this.myInput.value;
        this.myInput.blur();
        this.myInput.style.backgroundColor = 'white';
        this.myInput.value = '';
        this.changeText();
    }
}

gameScene.changeText = function () {
    this.enterNumber.setText('Your number: ' + this.number);
    this.enterNumber.setPosition(375, 150)
}

let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    scene: gameScene,
    title: 'Roulette',
    pixelArt: false,
    backgroundColor: '#ffffff',
};


let game = new Phaser.Game(config);
