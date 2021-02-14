
let width = 1000;
let height = 1000;
let tiles = [];
let font;
let img;
function preload() {

  font = loadFont('resources/Inconsolata-ExtraLight.ttf');
  img = loadImage('resources/spider.png');
}

function setup() {
  var canvasDiv = document.getElementById("sketchdiv");
  var cnv = createCanvas(width, height, WEBGL);
  angleMode
  cnv.parent("sketchdiv");
  setAttributes('antialias', true);
  fill(237, 34, 93);
  strokeWeight(3);
  //textureMode(NORMAL);






  board = new Board(0, 0, 160);
  tiles.push(board.placeTile());
  tiles.push(board.placeTile("A"));

  tiles.push(board.placeTile("B"));

  tiles.push(board.placeTile("C"));

  tiles.push(board.placeTile("D"));

  tiles.push(board.placeTile("E"));

  tiles.push(board.placeTile("F"));
}
function draw() {
  camera(0, width / 2, height / 2, 0, 0, 0, 0, 1, 0);

  background(200);
  for (tile of tiles) {
    board.drawTile(tile.x, tile.y)
  }
  // pan camera according to angle 'delta'
  //cam.tilt(delta);


}
function range(stop) {
  var a = [0], b = 0;
  while (b < stop) {
    a.push(b += 1 || 1);
  }
  return a;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Board {
  constructor(width, height, hexSize) {
    this.height = height;
    this.width = width;
    this.hexSize = hexSize;
    this.gridXPixels = .9 * width;
    this.gridYPixels = .9 * height;
    this.sepX = PI * hexSize;
    this.sepY = Math.sqrt(3) / 2 * hexSize;
    this.gridX = (this.gridXPixels / this.sepX) + 1;
    this.gridY = (this.gridYPixels / this.sepY) + 1;

    this.startTile = null;
    this.activeTile = null;
  }


  placeTile(edge = null) {
    var tile;
    if (this.isFirstTile(edge)) {
      var tile = new Tile(this.width / 2, this.height / 2);
      this.startTile = tile;
      this.activeTile = tile;
    } else if (this.isIllegalStartState(edge)) {
      throw new Error("Edge can only be null if startTile not set.")
    } else {
      let [x, y] = this.getEdgeCoords(edge);
      var tile = new Tile(x, y);
      this.activeTile.addAdjacency(edge, tile)
    }
    //text(tile.id.substring(0,3), tile.x,tile.y)
    return tile;
  }

  setActiveTile(x, y) {
    this.activeTile = this.activeTile.find(x, y);
  }

  getEdgeCoords(edge) {
    switch (edge) {
      case "A":
        return this.getACoords(this.activeTile.x, this.activeTile.y);
      case "B":
        return this.getBCoords(this.activeTile.x, this.activeTile.y);
      case "C":
        return this.getCCoords(this.activeTile.x, this.activeTile.y);
      case "D":
        return this.getDCoords(this.activeTile.x, this.activeTile.y);
      case "E":
        return this.getECoords(this.activeTile.x, this.activeTile.y);
      case "F":
        return this.getFCoords(this.activeTile.x, this.activeTile.y);
      default:
        throw new Error("Invalid edge.");
    }
  }
  isFirstTile(edge) {
    return edge == null && this.startTile == null;
  }
  isIllegalStartState(edge) {
    return edge == null && this.startTile != null;
  }

  drawTile(x, y) {
    beginShape()
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 0)
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 0)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 0)
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 0)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 0)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 0)
    endShape(CLOSE)
    push()
    texture(img);
    let s = this.hexSize/2
    let apothem = Math.sqrt(3/2)*s
    let d = s/2//Math.sqrt(Math.pow(s, 2) - Math.pow((Math.sqrt(3)*s)/2, 2))
    
    beginShape()

    //right middle
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 10,2*s, apothem)

    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 10, s+ d,2*apothem)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 10, d, 2*apothem)
    //left middle
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 10, 0, apothem)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10, d, 0)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10,d + s, 0)
    endShape(CLOSE)
    pop()
    beginShape()
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 0)
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 10)
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 10)
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 0)
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 10)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 10)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 0)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 10)
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 10)
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 0)
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 10)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 0)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 0)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 0)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 0)
    endShape(CLOSE)

    beginShape()
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 0)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10)
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 10)
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 0)
    endShape(CLOSE)
  }
  getACoords(x, y) {
    return [x + (1.5 * this.hexSize), y - this.sepY];
  }
  getBCoords(x, y) {
    return [x + (1.5 * this.hexSize), y + this.sepY];
  }
  getCCoords(x, y) {
    return [x, y + 2 * this.sepY];
  }
  getDCoords(x, y) {
    return [x - (1.5 * this.hexSize), y + this.sepY];
  }
  getECoords(x, y) {
    return [x - (1.5 * this.hexSize), y - this.sepY];
  }
  getFCoords(x, y) {
    return [x, y - 2 * this.sepY];
  }

}

class Tile {
  id = null
  x = null;
  y = null;
  z = 0;
  a = null;
  b = null;
  c = null;
  d = null;
  e = null;
  f = null;
  edges = null;
  constructor(x, y) {
    this.id = this.generateId();
    this.edges = [];
    this.x = x;
    this.y = y;
  }

  addAdjacency(edge, tile, isAdjacency = false) {
    switch (edge) {
      case "A":
        this.assertAdjacencyIsUnset(this.a);
        this.a = tile;
        this.edges.push(["A", this.a]);
        if (!isAdjacency) {
          tile.addAdjacency("D", this, true)
        }
        break;
      case "B":
        this.assertAdjacencyIsUnset(this.b);
        this.b = tile;
        this.edges.push(["B", this.b]);
        if (!isAdjacency) {
          tile.addAdjacency("E", this, true)
        }
        break;
      case "C":
        this.assertAdjacencyIsUnset(this.c);
        this.c = tile;
        this.edges.push(["C", this.c]);
        if (!isAdjacency) {
          tile.addAdjacency("F", this, true)
        }
        break;
      case "D":
        this.assertAdjacencyIsUnset(this.d);
        this.d = tile;
        this.edges.push(["D", this.d]);
        if (!isAdjacency) {
          tile.addAdjacency("A", this, true)
        }
        break;
      case "E":
        this.assertAdjacencyIsUnset(this.e);
        this.e = tile;
        this.edges.push(["E", this.e]);
        if (!isAdjacency) {
          tile.addAdjacency("B", this, true)
        }
        break;
      case "F":
        this.assertAdjacencyIsUnset(this.f);
        this.f = tile;
        this.edges.push(["f", this.f]);
        if (!isAdjacency) {
          tile.addAdjacency("C", this, true)
        }
        break;
      default:
        throw new Error("Invalid edge.");

    }
  }

  find(id) {
    if (id == this.id) {
      return this;
    }

    let traversed = [];
    let queue = [];

    for (let edge of this.edges) {
      console.log(edge)
      queue.push(edge)
    }

    while (queue.length != 0) {
      let [label, vertex] = queue.pop();
      console.log(label)
      if (!traversed.includes(vertex.id)) {
        if (vertex.id == id) {
          return vertex;
        }
        traversed.push(vertex.id)
        for (let edge of vertex.edges) {
          queue.push(edge)
        }
      }
    }
    throw new Error("not found!")
  }

  assertAdjacencyIsUnset(adjacency) {
    if (adjacency != null) {
      throw new Error("Adjacency already set.");
    }
  }

  generateId(a = null, b = null) {
    for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b;
  }
}

