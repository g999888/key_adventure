
/* 
	game.js

	A dummy game using some fonts and sprites, just to test my abilities of making a game in javascript.
*/

window.onload = function()
{
	Game.launch("screen");
}

dataFiles = ["font3.gif", "tiles.png", "sprites.png"];

filesLeft = 10;  // random number, will be overwritten

Images = [];

/*
	Note to exporting map:
	
	map name should be: overworld_map0, also MAP_WIDTH and MAP_HEIGHT must be redefined
*/

MAP_WIDTH = 4;
MAP_HEIGHT = 4;

SCREEN_WIDTH = 14;
SCREEN_HEIGHT = 10;

map = new Array(SCREEN_HEIGHT);
map2 = new Array(SCREEN_HEIGHT);
/*
map = [ 
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,],
[3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,3,],
[3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,3,],
[3,3,3,3,3,25,3,25,3,3,3,3,3,3,3,3,],
[3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,],
[3,3,3,3,3,25,3,25,3,3,1,1,3,3,3,3,],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,],
];
*/

function fileLoaded(filename)
{
	filesLeft --;
	console.log(filename + " loaded.");
}

function loadFile(filename, nr)
{
	var img = new Image();
	img.addEventListener('load', fileLoaded(filename));
	img.src = filename;
	Images.push(img);
}

fontSize = 16;

function sprint(screen,x,y,s)
// prints a string at x,y, no wrapping
{
	var px = x;
	var py = y;
	for (var i=0; i<s.length; i++)
	{
		c = s.charCodeAt(i);
		if ( (c>=32) && (c<=127) )
			screen.drawImage (Images[0], (c % 32)*fontSize, (Math.floor ((c-32)/32))*fontSize, fontSize,fontSize, px,py, fontSize,fontSize);
		px += fontSize;
	}
}

TileSize = 32;

function is_wall_p2(x, y)
// returns 1 if coord is on a wall for player
{
	c = map[Math.floor(y/TileSize)][Math.floor(x/TileSize)];
	if (c>=8) return 1;
	if (c==6) 
	{ 
		collected++; keysget[roomnr] = 1; 
		map[Math.floor(y/TileSize)][Math.floor(x/TileSize)] = 3;
		// console.log(collected);
		if (collected>=16) gameover = 2;
	}
	if (c==7) 
	{ 
		hp = 100;
		map[Math.floor(y/TileSize)][Math.floor(x/TileSize)] = 3;
		// console.log(collected);
	}
}

function is_wall_p(x, y)
// returns 1 if player is on a wall
{
	return (is_wall_p2 (x,y) || is_wall_p2 (x+TileSize-1,y) || is_wall_p2 (x+TileSize-1,y+TileSize-1) || is_wall_p2 (x,y+TileSize-1));
}

function is_wall_m2(x, y)
// returns 1 if coord is on a wall for monster
{
	return map[Math.floor(y/TileSize)][Math.floor(x/TileSize)] >= 8;
}

function is_wall_m(x, y)
// returns 1 if monster is on a wall
{
	return (is_wall_m2 (x,y) || is_wall_m2 (x+TileSize-1,y) || is_wall_m2 (x+TileSize-1,y+TileSize-1) || is_wall_m2 (x,y+TileSize-1));
}

// Player start room
roomnr = 14;
hp = 100;
gameover = 0;
collected = 0;
keysget = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

scrollto = 0; // direction
scrollleft = 0; // steps left to scroll
scrolltoroom = 0; // room to scroll to
SCROLLSTEP = 8; // step each scroll take
SCROLLPIXEL = TileSize/SCROLLSTEP;
scrolltemp = 0; // = SCREEN_WIDTH - scrollleft * SCROLLSTEP

function loadroom( rnr, sto )
// scrollto is a direction: 1 = left, 2 - right, 3 = up, 4 = down, 0 = flip
{
	people = [ player ];
	
	if (sto == 0)
	{
		for (var y=0; y<SCREEN_HEIGHT; y++)
		{
			dx = rnr % MAP_WIDTH;
			dy = Math.floor(rnr / MAP_WIDTH)*SCREEN_HEIGHT;
			map[y] = (overworld_map0[dy+y]).slice(dx * SCREEN_WIDTH, (dx+1)*SCREEN_WIDTH);
			
			for (var x=0; x<map[y].length; x++)
			{
				p = map[y][x];
				if (p==32) { people.push (new Snake (x*TileSize, y*TileSize)); map[y][x] = 3; } // grass
				if (p==33) { people.push (new   Bat (x*TileSize, y*TileSize)); map[y][x] = 3; } // grass
				if (p==34) { people.push (new Spider(x*TileSize, y*TileSize)); map[y][x] = 3; } // grass
				if (p==36) { people.push (new   Rat (x*TileSize, y*TileSize)); map[y][x] = 3; } // grass
				if ((p==6) && (keysget[rnr])) { if (Math.random()>0.5) map[y][x] = 7; else map[y][x] = 3; } // grass
			}
		}
		
		roomnr = rnr;
	}
	else
	{
		for (var y=0; y<SCREEN_HEIGHT; y++)
		{
			dx = rnr % MAP_WIDTH;
			dy = Math.floor(rnr / MAP_WIDTH)*SCREEN_HEIGHT;
			map2[y] = (overworld_map0[dy+y]).slice(dx * SCREEN_WIDTH, (dx+1)*SCREEN_WIDTH);
			
			for (var x=0; x<map2[y].length; x++)
			{
				p = map2[y][x];
				if ((p==6) && (keysget[rnr])) { map2[y][x] = 3; } // grass
			}
		}
		scrollto = sto;
		scrolltoroom = rnr;
		scrolltemp = 0;
	}	
	
	if ((sto==1) || (sto==2)) { scrollleft = SCREEN_WIDTH * SCROLLPIXEL; }
	if ((sto==3) || (sto==4)) { scrollleft = SCREEN_HEIGHT * SCROLLPIXEL; }

}

var people;
var player;
var gamesize;

Game = {};

Game.launch = function(canvasId)
{
	var canvas = document.getElementById(canvasId);
	var screen = canvas.getContext('2d');
	var gameSize = { x: canvas.width, y: canvas.height };
	var camera = { x: 0, y: 0 };
	var camera_dest = { x: 0, y: 0 };
	gamesize = { x: canvas.width, y: canvas.height-2*TileSize };
	
	people = [ new Player(gamesize) ];
	player = people[0];

	// people.push (new Alien(people[0]));
	
	filesLeft = dataFiles.length;
	
	for (var i=0; i<dataFiles.length; i++)
		loadFile(dataFiles[i], i);
	
	var update = function()
	{
		if (!scrollleft)
		{
			for (var y=people.length-1; y>=0; y--)
			{
				people[y].update();
			}
			touchplayer();
		}
	}
	
	loadroom (roomnr, 0);
	
	TileSize = 32;
	
	var draw = function(screen, gameSize)
	{
//		screen.clearRect(0,0, gameSize.x, gameSize.y);

		if (scrollleft==0)
		{
			for (var y=0; y<SCREEN_HEIGHT; y++)
			for (var x=0; x<gameSize.x/TileSize; x++)
			{
				p = map[y][x];
				if (p>=16)
				screen.drawImage (Images[1], 
					(3%4)*TileSize,Math.floor(3/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize,y*TileSize, 					 // location in screen
					TileSize,TileSize);						 // height and width
				screen.drawImage (Images[1], 
					(p%4)*TileSize,Math.floor(p/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize,y*TileSize, 					 // location in screen
					TileSize,TileSize);						 // height and width
			}
		
			for (var y=people.length-1; y>=0; y--)
			{
				people[y].draw(screen);
			}
		}
		else
		{
			xx1 = 0; xx2 = 0; yy1 = 0; yy2 = 0; px = player.center.x; py = player.center.y;
			
			if (scrollto == 1)
			{
				xx1 = scrolltemp * SCROLLSTEP;
				xx2 = xx1 - SCREEN_WIDTH * TileSize;
				px = xx1 - TileSize;
			}
			if (scrollto == 2)
			{
				xx1 = - scrolltemp * SCROLLSTEP;
				xx2 = xx1 + SCREEN_WIDTH * TileSize;
				px = xx2;
			}
			if (scrollto == 4)
			{
				yy1 = - scrolltemp * SCROLLSTEP;
				yy2 = yy1 + SCREEN_HEIGHT * TileSize;
				py = yy2;
			}
			if (scrollto == 3)
			{
				yy1 = scrolltemp * SCROLLSTEP;
				yy2 = yy1 - SCREEN_HEIGHT * TileSize;
				py = yy1 - TileSize;
			}
			for (var y=0; y<SCREEN_HEIGHT; y++)
			for (var x=0; x<gameSize.x/TileSize; x++)
			{
				p = map[y][x];
				if (p>=16)
				screen.drawImage (Images[1], 
					(3%4)*TileSize,Math.floor(3/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize + xx1,y*TileSize + yy1, 					 // location in screen
					TileSize,TileSize);						 // height and width
				screen.drawImage (Images[1], 
					(p%4)*TileSize,Math.floor(p/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize + xx1,y*TileSize + yy1, 					 // location in screen
					TileSize,TileSize);						 // height and width
			}
			for (var y=0; y<SCREEN_HEIGHT; y++)
			for (var x=0; x<gameSize.x/TileSize; x++)
			{
				p = map2[y][x];
				if (p>=16)
				screen.drawImage (Images[1], 
					(3%4)*TileSize,Math.floor(3/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize + xx2,y*TileSize + yy2, 					 // location in screen
					TileSize,TileSize);						 // height and width
				screen.drawImage (Images[1], 
					(p%4)*TileSize,Math.floor(p/4)*TileSize, // location of Images[1]
					TileSize,TileSize, 						 // height and width
					x*TileSize + xx2,y*TileSize + yy2, 					 // location in screen
					TileSize,TileSize);						 // height and width
			}
			
			player.transdraw(screen, px, py);

			scrolltemp ++;
			scrollleft --;
			if (scrollleft == 0) loadroom(scrolltoroom, 0);
		}
		
		screen.fillStyle="teal";
		screen.fillRect(0,gameSize.y-2*TileSize, gameSize.x, gameSize.y);
	
//		for (var i=0; i < this.people.length; i++) 
//			{ drawRect(screen, this.people[i]);	}
//		screen.drawImage (Images[0], 32,0, 8,8, 140,80, 8,8);

		if (gameover==0)
		sprint (screen, 8,330,"Collect all 16 keys to win!");
		if (gameover==1)
		sprint (screen, 8,330,"You ran out of HP.");
		if (gameover==2)
		sprint (screen, 8,330,"Congratulations! You win!");
	
		s1 = "Keys: "+collected+" ";
		s2 = "HP: "+hp+"  ";
		sprint (screen, 8,360,s1);
		sprint (screen,256,360,s2);
	}
	
	var tick = function()
	{
		if (filesLeft === 0)
		{
			// console.log ("All files loaded");
			update();
			draw(screen, gameSize);
		}
		requestAnimationFrame(tick);
	}

	// This to start a game
	tick();
};

function touchplayer()
{
	var px1, px2, py1, py2;

	px1 = player.center.x+2; px2 = player.center.x+TileSize-3;
	py1 = player.center.y+2; py2 = player.center.y+TileSize-3;
		
	var hit = false;
	
	for (var i=people.length-1; i>=1; i--)
	{
		if (py2 < people[i].center.y+2) continue;
		if (py1 > people[i].center.y+TileSize-3) continue;
		if (px2 < people[i].center.x+2) continue;
		if (px1 > people[i].center.x+TileSize-3) continue;
		hit = true; break;
	}

	if (hit) 
	{
		// player has been hit!
		hp --;
		if (hp<0)
		{
			gameover = 1;
			hp = 0;
		}
	}
}

KEYS = { LEFT:37, UP:38, RIGHT:39, DOWN:40, SPACE:32, ENTER:13, X:88, C:67, V:86, BACKSPACE:8 };

var Keyboard = function()
{
	var keysPressed = {};
	
	window.onkeydown = function(e) 
					{ 
						if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) { e.preventDefault(); } ;
						if (keysPressed[e.keyCode]!=2) {keysPressed[e.keyCode] = 1;}
					};
	window.onkeyup =   function(e) { keysPressed[e.keyCode] = 0;	};
	this.isDown =      function(keyCode) { return keysPressed[keyCode] === 1; };
	this.waitRelease = function(keyCode) { keysPressed[keyCode] = 2; };
	this.release =     function(keyCode) { keysPressed[keyCode] = 0; };
};

var Player = function(gameSize)
{
	this.size = { x: 32, y: 32 };
	this.center = { x: 224, y: 256 };
	this.keyb = new Keyboard();
	this.counter = 0;
	this.frame1 = 0;
	this.framenr = 0;
	this.dir = 3;
	this.moved = 0;
	this.gameSize = gameSize;
}

Player.prototype =
{
	update: function()
	{
		if (gameover==1) 
		{ 
			this.dir=3;
			return; 
		};
		
		var oldx = this.center.x;
		var oldy = this.center.y;
		
		this.moved = 0;
		
		if (this.keyb.isDown(KEYS.UP)) 
		{ this.center.y -= 2; this.dir = 2; this.moved = 1; }
		else if (this.keyb.isDown(KEYS.DOWN)) 
		{ this.center.y += 2; this.dir = 3; this.moved = 1; }
/*
		if (this.center.y < 0) this.center.y = 0;
		if (this.center.y > SCREEN_HEIGHT*TileSize-this.size.y) this.center.y = SCREEN_HEIGHT*TileSize-this.size.y;
*/		
		if (this.center.y < 0)
		{
			if (roomnr>=MAP_WIDTH) 
			{
				roomnr-=MAP_WIDTH;
				this.center.y = SCREEN_HEIGHT*TileSize-this.size.y;
				loadroom(roomnr, this.dir+1);
				return;
			}
			else this.center.y = 0;
		}	
		
		if (this.center.y > SCREEN_HEIGHT*TileSize-this.size.y)
		{
			if (roomnr<MAP_WIDTH*MAP_HEIGHT-MAP_WIDTH) 
			{
				roomnr += MAP_WIDTH;
				this.center.y = 0;
				loadroom(roomnr, this.dir+1);
				return;
			}
			else this.center.y = SCREEN_HEIGHT*TileSize-this.size.y;
		}

		if (is_wall_p(this.center.x, this.center.y))
		{
			this.center.x = oldx;
			this.center.y = oldy;
		}

		oldx = this.center.x;
		oldy = this.center.y;
		
		if (this.keyb.isDown(KEYS.LEFT)) 
		{ this.center.x -= 2; this.dir = 0; this.moved = 1; }
		else if (this.keyb.isDown(KEYS.RIGHT)) 
		{ this.center.x += 2; this.dir = 1; this.moved = 1; }

		if (this.moved)
		{ this.framenr = 1; }
		else 
		{ this.framenr = 0; this.frame1 = 0; }
/*	
		if (this.center.x < 0) this.center.x = 0;
		if (this.center.x > this.gameSize.x-this.size.x) this.center.x = this.gameSize.x-this.size.x;
*/
		if (this.center.x < 0) 
		{
			if (roomnr>0) 
			{
				roomnr--;
				this.center.x = this.gameSize.x-this.size.x;
				loadroom(roomnr, this.dir+1);
				return;
			}
			else this.center.x = 0;
		}
		
		if (this.center.x > this.gameSize.x-this.size.x) 
		{
			if (roomnr<MAP_WIDTH*MAP_HEIGHT-1) 
			{
				roomnr++;
				this.center.x = 0;
				loadroom(roomnr, this.dir+1);
				return;
			}
			else this.center.x = this.gameSize.x-this.size.x;
		}
		
		
		if (is_wall_p(this.center.x, this.center.y))
		{
			this.center.x = oldx;
			this.center.y = oldy;
		}
		
		if (this.counter%10 === 0 && this.moved) this.frame1 = !this.frame1
		this.counter++;
	},
	
	draw: function(screen)
	{
		screen.drawImage (Images[2], (this.frame1 + this.framenr)*32,(this.dir)*32, 
							this.size.x,this.size.y, 
							this.center.x,this.center.y, 
							this.size.x,this.size.y);
	},
	
	transdraw: function(screen, x, y)
	{
		screen.drawImage (Images[2], (this.frame1 + this.framenr)*32,(this.dir)*32, 
							this.size.x,this.size.y, 
							x,y, 
							this.size.x,this.size.y);
	}
}

var Alien = function(player)
{
	this.size = { x: 32, y: 32 };
	this.center = { x: Math.floor(Math.random()*250)*2, y: Math.floor(Math.random()*190)*2 };
	this.player = player;
}

Alien.prototype =
{
	update: function()
	{
		if (this.center.x < this.player.center.x) this.center.x += 1;
		if (this.center.y < this.player.center.y) this.center.y += 1;
		if (this.center.x > this.player.center.x) this.center.x -= 1;
		if (this.center.y > this.player.center.y) this.center.y -= 1;
		
		if ( (this.center.x === this.player.center.x) && (this.center.y === this.player.center.y) )
			this.center = { x: Math.floor(Math.random()*300)*2, y: Math.floor(Math.random()*200)*2 };
	},
	
	draw: function(screen)
	{
		screen.drawImage (Images[2], 256,256, this.size.x,this.size.y, 
							this.center.x,this.center.y, 
							this.size.x,this.size.y);
	}
}

var Bat = function(sx, sy)
{
	this.alive = true;
	this.hp = 3;
	this.size = { x: TileSize, y: TileSize };
	this.center = { x: sx, y: sy };
	this.animcounter = 0;
	this.animation = [0,1];
	this.animstartY = TileSize * 5;
	this.dir = 1; // dir is een betterje anders: 1 = left, 2 = right, 4 = up, 8 = down
	this.framecounter = Math.floor(Math.random()*15)+1; // 11;
	this.speed = 1;
	this.randomchance = 0.5;
	
	this.velocity = { x: 1, y: 0 };	
}

Bat.prototype =
{	
	changedir: function()
	{
		c = Math.random();
		if (c<0.2) return 1;
		if (c<0.4) return 2;
		if (c<0.6) return 4;
		if (c<0.8) return 8;
		return 0;
	},
	
	specialmove: function()
	{
		
	},

	move: function()
	{
		this.specialmove();
		
		newx = this.center.x;
		newy = this.center.y;
		
		if (this.dir & 1) { newx -= this.speed;	}
		if (this.dir & 2) { newx += this.speed;	}
		if (this.dir & 4) { newy -= this.speed;	}
		if (this.dir & 8) { newy += this.speed;	}
		
		if ((newx > gamesize.x-this.size.x) || (newx<0) || (newy > gamesize.y-this.size.y) || (newy<0) )
		{
			newx = this.center.x; newy = this.center.y;
			this.dir ^= 15;	// reverse direction
		}
		
		if (is_wall_m(newx, newy))
		{
			newx = this.center.x; newy = this.center.y;
			this.dir ^= 15;	// reverse direction
		}
		else
		{
			this.center.x = newx; this.center.y = newy;
		}
		
		if ( !(this.center.x % TileSize) && !(this.center.y % TileSize) )
		{
			if (Math.random() < this.randomchance) this.dir = this.changedir();
		}
	},
	
	update: function()
	{
		this.move();
		
		this.framecounter ++;
		if (this.framecounter>=32) this.framecounter=0;
		this.animcounter = (this.framecounter > 15);
	},
	
	draw: function(screen, camerax, cameray)
	{
		if (!this.alive) return;
		
		var t = this.dir & 2;
		screen.drawImage   (Images[2], (t + this.animcounter)*TileSize, this.animstartY,
							this.size.x,this.size.y, 
							this.center.x,this.center.y, 
							this.size.x,this.size.y);
	}
}

var Rat = function(sx, sy)
{
	Bat.call(this, sx, sy);
	this.animstartY = TileSize * 8;
	this.speed = 2;
	this.randomchance = 0.25;
}

Rat.prototype = Object.create(Bat.prototype);
Rat.prototype.constructor = Rat;

var Spider = function(sx, sy)
{
	Bat.call(this, sx, sy);
	this.animstartY = TileSize * 6;
	this.dir = 8;
	this.randomchance = 0;
}

Spider.prototype = Object.create(Bat.prototype);
Spider.prototype.constructor = Spider;

var Snake = function(sx, sy)
{
	Bat.call(this, sx, sy);
	this.animstartY = TileSize * 4;
	this.dir = 2;
	this.randomchance = 0;
}

Snake.prototype = Object.create(Bat.prototype);
Snake.prototype.constructor = Snake;
Snake.prototype.specialmove = function()
	{
		if ((this.center.y == player.center.y) && (this.center.x % 4 == 0)) this.speed = 4; else this.speed = 2;
	};


