
let width = 1000;
let height = 1000;

let font;

let xOffset = 0.0;
let yOffset = 0.0;
let board;
let hexSize = 160;
function preload() {

  font = loadFont('resources/Inconsolata-ExtraLight.ttf');
  img = loadImage('resources/spider.png');
}

function setup() {
  var canvasDiv = document.getElementById("sketchdiv");
  var cnv = createCanvas(width, height, WEBGL);

  cnv.parent("sketchdiv");
  setAttributes('antialias', true);
  fill(237, 34, 93);
  strokeWeight(3);
  //textureMode(NORMAL);

  board = new Board(0, 0, hexSize);
  board.placeTile();
  board.placeTile("A");
  board.placeTile("B");
  board.placeTile("C");
  board.placeTile("D");
  board.placeTile("E");
  board.placeTile("F");
}
function draw() {

  //todo: make drag and drop work with camera.
  //camera(0, width, height, 0, 0, 0, 0, 1, 0);

  background(200);


  for (tile of board.tiles) {
    board.drawTile(tile.x, tile.y)
  }

  if (board.activeTile == null || !board.activeTile.locked) {
    set = false;
    for (tile of board.tiles) {
      if (tile.mouseOverTile()) {
        board.activeTile = tile;
        set = true;
      }
    }
    if (!set) {
      board.activeTile = null;
    }
  }

}

function mousePressed() {
  if (board.activeTile != null) {
    board.activeTile.locked = true;
    xOffset = mouseX - board.activeTile.x;
    yOffset = mouseY - board.activeTile.y;
  }
}

function mouseDragged() {
  if (board.activeTile != null) {
    if (board.activeTile.locked) {
      board.activeTile.x = mouseX - xOffset;
      board.activeTile.y = mouseY - yOffset;
      board.activeTile.setVertices();
    }
  }
}
function mouseReleased() {
  if (board.activeTile != null) {
    board.activeTile.locked = false;

    let minTile = board.getNearestTileToActiveTile();
    let nearestEdge = board.getNearestEdgeBetweenTileAndActiveTile(minTile);
    if (board.nearestEdgeCloseEnough(nearestEdge)) {
      board.activeTile.x = nearestEdge[0];
      board.activeTile.y = nearestEdge[1];
      board.activeTile.setVertices();
    }
  }
}
function range(stop) {
  var a = [0], b = 0;
  while (b < stop) {
    a.push(b += 1 || 1);
  }
  return a;
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
    this.activeTile = null;
    this.tiles = [];
  }
  getNearestTileToActiveTile() {
    let min = Number.MAX_SAFE_INTEGER;
    let minTile = null;
    for (tile of this.tiles) {
      if (tile.id != this.activeTile.id) {
        let a = this.activeTile.x - tile.x;
        let b = this.activeTile.y - tile.y;
        let c = Math.hypot(a, b);

        if (c < min) {
          min = c;
          minTile = tile;
        }
      }
    }
    return minTile;
  }
  nearestEdgeCloseEnough(coord) {
    let a = this.activeTile.x - coord[0];
    let b = this.activeTile.y - coord[1];
    let c = Math.hypot(a, b);
    return c < this.hexSize / 1.5;
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
      let [x, y] = this.getActiveTileEdgeCoords(edge);
      var tile = new Tile(x, y);
      this.activeTile.addAdjacency(edge, tile)
    }
    this.tiles.push(tile);
    return tile;
  }

  getActiveTileEdgeCoords(edge) {
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

  getTileEdgeCoords(tile) {
    return [
      this.getACoords(tile.x, tile.y),
      this.getBCoords(tile.x, tile.y),
      this.getCCoords(tile.x, tile.y),
      this.getDCoords(tile.x, tile.y),
      this.getECoords(tile.x, tile.y),
      this.getFCoords(tile.x, tile.y)];
  }
  getNearestEdgeBetweenTileAndActiveTile(tile) {
    let coords = this.getTileEdgeCoords(tile);
    let min = Number.MAX_SAFE_INTEGER;
    let minEdge = null;

    for (let coord of coords) {
      let a = this.activeTile.x - coord[0];
      let b = this.activeTile.y - coord[1];
      let c = Math.hypot(a, b);

      if (c < min) {
        min = c;
        minEdge = coord;
      }
    }
    return minEdge;
  }
  isFirstTile(edge) {
    return edge == null && this.tiles.length == 0;
  }
  isIllegalStartState(edge) {
    return edge == null && this.tiles.length != 0;
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
    let s = this.hexSize / 2
    let r = Math.sqrt(3 / 2) * s
    let d = s / 2

    beginShape()

    //right middle
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2), 10, 2 * s, r)

    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6), 10, s + d, 2 * r)
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6), 10, d, 2 * r)
    //left middle
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2), 10, 0, r)
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6), 10, d, 0)
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6), 10, d + s, 0)
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
  locked = false;
  vertices = null;
  edges = null;
  constructor(x, y) {
    this.id = this.generateId();
    this.edges = [];
    this.x = x;
    this.y = y;
    this.setVertices();
  }

  setVertices() {
    let x = this.x + width / 2;
    let y = this.y + height / 2;
    let vertices = []
    vertices.push([x + hexSize * sin(PI / 2), y + hexSize * cos(PI / 2)]);
    vertices.push([x + hexSize * sin(PI / 6), y + hexSize * cos(PI / 6)]);
    vertices.push([x + hexSize * sin(11 * PI / 6), y + hexSize * cos(11 * PI / 6)]);
    vertices.push([x + hexSize * sin(3 * PI / 2), y + hexSize * cos(3 * PI / 2)]);
    vertices.push([x + hexSize * sin(7 * PI / 6), y + hexSize * cos(7 * PI / 6)]);
    vertices.push([x + hexSize * sin(5 * PI / 6), y + hexSize * cos(5 * PI / 6)]);
    this.vertices = vertices;
  }
  mouseOverTile() {
    var x = mouseX, y = mouseY;

    var inside = false;
    for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
      var xi = this.vertices[i][0], yi = this.vertices[i][1];
      var xj = this.vertices[j][0], yj = this.vertices[j][1];

      var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
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

