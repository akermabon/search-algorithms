
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
//      A*
//      Tuto Deep Tree Search -> http://web.mit.edu/eranki/www/tutorials/search/
//      Tuto video A* -> https://www.youtube.com/watch?v=yrsPiteoxVY
// ---------------------------------------------------------------------------------------------------------------------

class Astar {

    constructor (grid, params) {

        if (!params) params = {};

        this.grid = grid;
        this.wall = params.wall || '|';
        this.heuristic = params.heuristic || Astar.getManhattanDistance;
        this.calcNodesPositions();
        this.calcNeighbors();

        return this;
    }

    static getManhattanDistance (a, b) {

        // La vraie formule est D(ab) = |Xb-Xa| + |Yb-Ya|
        // On fait x10 pour que l'heuristique ait le meme poids que le mouvement
        return Math.abs(b.x - a.x) * 10 + Math.abs(b.y - a.y) * 10;
    }

    setStart (start) {

        this.start = start;
        return this;
    }

    setEnd (end) {

        this.end = end;
        return this;
    }

    calcNodesPositions () {

        this.oNodes = {};

        this.grid.map((row, y) => {
            row.map((id, x) => {
                if (id === this.wall) return;
                this.oNodes[id] = { id, x, y };
            });
        });
    }

    calcNeighbors () {

        this.grid.map((row, y) => {
            row.map((id, x) => {

                if (id === '|') return;

                let node = this.oNodes[id];
                let prevRow = this.grid[y - 1];
                let nextRow = this.grid[y + 1];
                let dirs = {};

                dirs.N = prevRow && prevRow[x];
                dirs.S = nextRow && nextRow[x];
                dirs.W = row[x - 1];
                dirs.E = row[x + 1];

                dirs.NW = prevRow && prevRow[x - 1];
                dirs.NE = prevRow && prevRow[x + 1];
                dirs.SW = nextRow && nextRow[x - 1];
                dirs.SE = nextRow && nextRow[x + 1];

                node.neighbors = Object.keys(dirs).reduce((neighbors, d) => {
                    if ([undefined, this.wall].indexOf(dirs[d]) > -1) return neighbors;
                    neighbors.push(dirs[d]);
                    return neighbors;
                }, []);
            });
        });
    }

    calcHeuristics () {

        let n = this.oNodes[this.end];

        this.grid.map((row) => {
            row.map((id) => {
                if (this.oNodes[id] === undefined) return;
                let m = this.oNodes[id];
                m.h = this.heuristic(n, m);
            });
        });
    }

    getMoveCost (a, b) {

        // https://fr.wikipedia.org/wiki/Triangle_rectangle
        // Simple trigo (pythagore) dans un triangle rectangle ABC ayant AC comme Hypoténuse
        // Si AC = SQRT(AB² + BC²) = SQRT (10² + 10²) = SQRT(200) ~= 14
        // On considère donc le cout d'un mouvement en diagonale de 14 et en ligne droite de 10
        return this.oNodes[a].x === this.oNodes[b].x || this.oNodes[a].y === this.oNodes[b].y ? 10 : 14;
    }

    getShortestPath () {

        let oOpen = {};
        let oClosed = {};

        this.calcHeuristics(this.end);

        // Push le point de depart dans l'open list
        let n = this.oNodes[this.start];
        n.f = n.c = n.h = 0;
        n.parent = null;
        oOpen[n.id] = n;

        while (Object.keys(oOpen).length) {

            console.log('open before\n' + Object.keys(oOpen).map((n) => JSON.stringify(oOpen[n])).join('\n'));

            // Recup le point Q ayant le F le plus faible
            // F (Cout total) = G(parent) + G(Cout) + H (Heuristique)

            let qid = null;
            let min = Infinity;

            Object.keys(oOpen).map((id) => {
                let n = this.oNodes[id];
                let np = this.oNodes[n.parent];
                let val = n.f + (np && np.g);
                if (val >= min) return;
                min = val;
                qid = id;
            });

            console.log('f min ->', qid, '\n');

            // SI Fmin = Point d'arrivée, l'algo est terminé
            // On retourne alors le chemin parcouru

            if (qid === this.end) {
                console.log('-----------------------------------------------------------------------------------------');
                console.log('Fin de la recherche');
                oClosed[qid] = this.oNodes[qid].parent;
                return this.getPathFromClosedList(oClosed);
            }

            let q = this.oNodes[qid];

            // Supprime Q de l'open list
            delete oOpen[q.id];

            // Pour chacun des voisins non présent
            q.neighbors
                .filter((id) => oClosed[id] === undefined)
                .map((id) => {
                    let n = this.oNodes[id];
                    n.parent = qid;
                    n.g = this.getMoveCost(qid, id);
                    n.f = n.h + n.g;
                    if (!oOpen[id]) oOpen[id] = n;
                });

            oClosed[qid] = q.parent;

            console.log('open after\n' + Object.keys(oOpen).map((n) => JSON.stringify(oOpen[n])).join('\n'));
            console.log('closed after', oClosed);
            console.log('-----------------------------------------------------------------------------------------');
        }
    }

    getPathFromClosedList (oClosed) {

        let path = [];
        let n = this.end;

        while (n) {
            path.push(n);
            if (oClosed[n] === undefined) throw new Error('Id not found in closed list -> ' + n);
            n = oClosed[n];
        }

        let costs = [];

        path = path.reverse().map((p, idx) => {
            let next = path[idx + 1];
            if (!next) return p;
            costs.push(this.getMoveCost(p, next));
            return p;
        });

        let s = path.join(' -(_cost_)-> ');

        while (costs.length) s = s.replace('_cost_', costs.shift());

        return s;
    };
}

// ---------------------------------------------------------------------------------------------------------------------
//      Sample
// ---------------------------------------------------------------------------------------------------------------------

const grid = [
    ['|', '|', 'A', '|'],
    ['|', 'B', 'C', '|'],
    ['E', '|', '|', 'D'],
    ['F', '|', 'H', '|'],
    ['|', 'J', '|', 'I']
];

let path = new Astar(grid)
    .setStart('A')
    .setEnd('F')
    .getShortestPath();

console.log(path);