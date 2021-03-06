var bunnys = [];
var currentFrame = null;
var bunnyType = 0;
var gravity = 0.5;

var maxX = 0;
var minX = 0;
var maxY = 0;
var minY = 0;

var isAdding = false;
var count = 0;
var number;

var amount = 100;

var checking = false;
var totalDt = 0;
var frames = 0;
var startTime = 0;

function beforeUpdate () {
    if (checking) {
        startTime = Date.now();
    }
}

function afterDraw () {
    if (checking) {
        if (startTime === 0) {
            return;
        }
        var endTime = Date.now();
        totalDt += endTime - startTime;
        frames++;
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        frames: {
            type: [cc.SpriteFrame],
            default: []
        },
        levelCount: 10,
        number: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        count = 0;
        number = this.number;
        number.node.active = true;
        number.node.zIndex = 100;
        cc.js.getset(number, 'innerText', function() {
            return number.string;
        }, function (value) {
            number.string = value;
        });

        maxX = cc.winSize.width / 2;
        maxY = cc.winSize.height / 2;
        minX = -maxX;
        minY = -maxY;

        for (var i = 0; i < this.levelCount; i++) {
            bunnys[i] = [];
        }
        currentFrame = this.frames[0];
        
        this.node.on('touchstart', function () {
            isAdding = true;
        });
        this.node.on('touchend', function () {
            isAdding = false;
            bunnyType++;
            bunnyType %= this.frames.length;
            currentFrame = this.frames[bunnyType];
        }, this);
        this.node.on('touchcancel', function () {
            isAdding = false;
        });
    },

    add: function () {
        this.addOnce();
        this.scheduleOnce(this.check, 5);
    },

    check: function () {
        checking = true;
        totalDt = 0;
        frames = 0;
        startTime = 0;
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        this.scheduleOnce(this.checkEnd, 3);
    },

    checkEnd: function () {
        checking = false;
        cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        var dt = totalDt / frames;
        if (dt > 20) {
            number.innerText = "STOPPED !!! \nFINAL SCORE : " + count;
        }
        else {
            bunnyType++;
            bunnyType %= this.frames.length;
            currentFrame = this.frames[bunnyType];
            if (dt < 1) dt = 1;
            var extra = Math.floor(20 / dt);
            for (var i = 0; i < extra; i++) {
                this.addOnce();
            }
            this.add();
        }
    },

    addOne: function () {
        var bunny, bunnysp;
        bunny = new cc.Node();
        bunnysp = bunny.addComponent(cc.Sprite);
        bunnysp.spriteFrame = currentFrame;
        bunny.speedX = Math.random() * 10;
        bunny.speedY = (Math.random() * 10) - 5;
        bunny.x = minX + 10;
        bunny.y = maxY * 0.7;
        bunny.anchorY = 1;
        //bunny.alpha = 0.3 + Math.random() * 0.7;
        bunnys.push(bunny);
        bunny.scale = 0.3;

        bunny.angle = 360 * (Math.random()*0.2 - 0.1);

        this.node.addChild(bunny);
        count++;
        number.innerText = count;
    },

    addOnce: function () {
        let amountPerLevel = Math.floor(amount / this.levelCount);
        let parent = this.node;
    
        var bunny, bunnysp, i;
        // Add bunnys
        for (var i = 0; i < this.levelCount; i++) 
        {
            var lbunnys = bunnys[i];
            for (var j = 0; j < amountPerLevel; j++) {
                bunny = new cc.Node();
                bunnysp = bunny.addComponent(cc.Sprite);
                bunnysp.spriteFrame = currentFrame;
                bunny.speedX = Math.random() * 10;
                bunny.speedY = (Math.random() * 10) - 5;
                bunny.setPosition(minX + 10, maxY * 0.7);
                bunny.anchorY = 1;
                //bunny.alpha = 0.3 + Math.random() * 0.7;
                lbunnys.push(bunny);
                bunny.scale = 0.3 * (0.5 + Math.random()*0.5);
                bunny.angle = 360 * (Math.random()*0.2 - 0.1);

                bunny.parent = parent;
                count++;
            }
            var nextContainer = new cc.Node();
            parent.addChild(nextContainer);
            parent = nextContainer;
        }
        number.innerText = count;
        isAdding = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (isAdding) {
            this.addOnce();
        }

        // var start = new Date().getTime();
        for (var i = 0; i < this.levelCount; i++) 
        {
            var lbunnys = bunnys[i];
            for (var j = 0; j < lbunnys.length; j++)
            {
                var bunny = lbunnys[j];

                let speedX = bunny.speedX;
                let speedY = bunny.speedY;
                let x = bunny.x + speedX;
                let y = bunny.y - speedY;
                speedY += gravity;

                if (x > maxX) {
                    speedX = -1 * speedX;
                    x = maxX;
                } else if (x < minX) {
                    speedX = -1 * speedX;
                    x = minX;
                }

                if (y < minY) {
                    speedY = -0.85 * speedY;
                    y = minY;
                    if (Math.random() > 0.5) {
                        speedY = speedY - Math.random() * 6.0;
                    }
                } else if (y > maxY) {
                    speedY = 0.0;
                    y = maxY;
                }
                bunny.speedX = speedX;
                bunny.speedY = speedY;
                bunny.setPosition(x, y);
            }
        }
    },

    back () {
        cc.director.loadScene('start');
    },
});
