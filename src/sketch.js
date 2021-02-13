count = 0;


async function setup() {
  var board = new Board(1000, 1000, 50);
  board.init();
  board.placeTile();
  await sleep(1000);
  board.placeTile("A");
  await sleep(1000);
  board.placeTile("B");
  await sleep(1000);
  let id = board.placeTile("C");
  await sleep(1000);
  board.placeTile("D");
  await sleep(1000);
  board.placeTile("E");
  await sleep(1000);
  board.placeTile("F");
  await sleep(1000);
  let foundTile = board.activeTile.find(id)

  console.log(foundTile.x + ", " + foundTile.y)
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
    this.sepX = 3 * hexSize;
    this.sepY = .86 * hexSize;
    this.gridX = (this.gridXPixels / this.sepX) + 1;
    this.gridY = (this.gridYPixels / this.sepY) + 1;

    this.startTile = null;
    this.activeTile = null;
  }

  init() {
    var canvasDiv = document.getElementById("sketchdiv");
    var cnv = createCanvas(this.width, this.height);
    cnv.parent("sketchdiv");
    background(255);
    stroke(0)
    strokeWeight(2);
    noFill()
    textSize(16)
  }

  placeTile(edge = null) {
    var tile;
    if (this.isFirstTile(edge)) {
      var tile = new Tile(this.width / 2, this.height / 2);
      this.startTile = tile;
      this.activeTile = tile;
      this.drawTile(this.activeTile.x, this.activeTile.y)
    } else if (this.isIllegalStartState(edge)) {
      throw new Error("Edge can only be null if startTile not set.")
    } else {
      let [x, y] = this.getEdgeCoords(edge);
      var tile = new Tile(x, y);
      this.activeTile.addAdjacency(edge, tile)
      this.drawTile(x, y)
    }
    text(tile.id.substring(0,3), tile.x,tile.y)
    return tile.id;
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
    vertex(x + this.hexSize * sin(PI / 2), y + this.hexSize * cos(PI / 2))
    vertex(x + this.hexSize * sin(PI / 6), y + this.hexSize * cos(PI / 6))
    vertex(x + this.hexSize * sin(11 * PI / 6), y + this.hexSize * cos(11 * PI / 6))
    vertex(x + this.hexSize * sin(3 * PI / 2), y + this.hexSize * cos(3 * PI / 2))
    vertex(x + this.hexSize * sin(7 * PI / 6), y + this.hexSize * cos(7 * PI / 6))
    vertex(x + this.hexSize * sin(5 * PI / 6), y + this.hexSize * cos(5 * PI / 6))
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

