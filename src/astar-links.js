
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
//      A*
//      Tuto Deep Tree Search -> http://web.mit.edu/eranki/www/tutorials/search/
//      Tuto video A* -> https://www.youtube.com/watch?v=yrsPiteoxVY
// ---------------------------------------------------------------------------------------------------------------------

class Astar {

    constructor (nodes, links) {
        
        this.initNodes(nodes);
        this.calcNeighbors(links);
        return this;
    }

    setStart (start) {

        this.start = start;
        return this;
    }

    setEnd (end) {

        this.end = end;
        return this;
    }

    initNodes (nodes) {

        this.oNodes = {};

        nodes.map((n) => {
            this.oNodes[n.id] = n;
            n.neighbors = [];
        });
    }

    calcNeighbors (links) {

        this.oCosts = {};

        links.map((link) => {

            let key = [link.from, link.to].join('');

            let from = this.oNodes[link.from];
            let to = this.oNodes[link.to];

            if (from.neighbors.indexOf(link.to) === -1) from.neighbors.push(link.to);
            if (to.neighbors.indexOf(link.from) === -1) to.neighbors.push(link.from);

            this.oCosts[key] = link.cost;
        });
    }

    getMoveCost (a, b) {

        let key = [a, b].sort().join('');
        if (!this.oCosts[key]) throw new Error(`Cout de ${ a } à ${ b } non renseigné`);
        return this.oCosts[key];
    }

    getShortestPath () {

        let oOpen = {};
        let oClosed = {};

        // Push le point de depart dans l'open list
        let n = this.oNodes[this.start];
        n.f = n.g = n.h = 0;
        n.parent = null;
        oOpen[this.start] = n;

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
            // On affiche alors le chemin parcouru

            if (qid === this.end) {
                console.log('-----------------------------------------------------------------------------------------');
                console.log('Fin de la recherche, path le plus court');
                oClosed[qid] = this.oNodes[qid].parent;
                return this.getPathFromClosedList(oClosed);
            }

            let q = this.oNodes[qid];

            // Supprime Q de l'open list
            delete oOpen[qid];

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

const nodes = [
    { id: 'X', h: 0 },
    { id: 'A', h: 15 },
    { id: 'B', h: 17 },
    { id: 'C', h: 14 },
    { id: 'D', h: 11 },
    { id: 'E', h: 11 },
    { id: 'F', h: 10 },
    { id: 'G', h: 3 },
    { id: 'H', h: 7 },
    { id: 'I', h: 5 },
    { id: 'J', h: 0 }
];

const links = [
    { from: 'A', to: 'X', cost: 5 },
    { from: 'A', to: 'C', cost: 1 },
    { from: 'B', to: 'C', cost: 5 },
    { from: 'B', to: 'D', cost: 10 },
    { from: 'B', to: 'X', cost: 2 },
    { from: 'C', to: 'E', cost: 1 },
    { from: 'D', to: 'F', cost: 4 },
    { from: 'E', to: 'F', cost: 4 },
    { from: 'F', to: 'G', cost: 2 },
    { from: 'F', to: 'H', cost: 3 },
    { from: 'H', to: 'I', cost: 1 },
    { from: 'H', to: 'J', cost: 10 },
    { from: 'I', to: 'J', cost: 5 }
];

let path = new Astar(nodes, links)
    .setStart('X')
    .setEnd('J')
    .getShortestPath();

console.log(path);