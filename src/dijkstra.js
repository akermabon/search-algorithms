
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
//      Dijkstra
//      Tuto video: https://www.youtube.com/watch?v=pVfj6mxhdMw
// ---------------------------------------------------------------------------------------------------------------------

class Dijkstra {

    constructor (links) {

        this.calcNeighbors(links);
        return this;
    }

    setStart (start) {

        this.start = start;
        return this;
    }

    calcNeighbors (links) {

        this.oCosts = {};
        this.oNodes = {};

        links.map((link) => {

            let key = [link.from, link.to].join('');

            if (this.oNodes[link.from] === undefined) this.oNodes[link.from] = { id: link.from, neighbors: [] };
            if (this.oNodes[link.to] === undefined) this.oNodes[link.to] = { id: link.to, neighbors: [] };

            let from = this.oNodes[link.from];
            let to = this.oNodes[link.to];

            if (from.neighbors.indexOf(link.to) === -1) from.neighbors.push(link.to);
            if (to.neighbors.indexOf(link.from) === -1) to.neighbors.push(link.from);

            this.oCosts[key] = link.cost;
        });
    }

    getMoveCost (a, b) {

        let key = [a, b].sort().join('');

        if (this.oCosts[key] === undefined) throw new Error(`Cost non renseigné pour l'arc ${ a } -> ${ b }`);

        return this.oCosts[key];
    }

    getPath (open, end) {

        let path = [];
        let n = end;

        while (n) {
            path.push(n);
            if (open[n] === undefined) throw new Error('Id not found -> ' + n);
            n = open[n].prev;
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
    }

    getPathsFromOpenList (open) {

        return Object.keys(open)
            .filter((id) => open[id].cost > 0)
            .map((id) => {
                let pathName = [this.start, id].join('');
                let path = this.getPath(open, id);
                return `${ pathName }: ${ path }`;
            })
            .join('\n');
    }

    getShortestPaths () {

        let open = {};
        let seen = {};

        Object.keys(this.oNodes).map((id) => open[id] = { cost: Infinity, prev: null });
        open[this.start].cost = 0;

        while (true) {

            let qid = null;
            let min = Infinity;

            let op = Object.keys(open).filter((id) => seen[id] === undefined);

            if (op.length === 0) return this.getPathsFromOpenList(open);

            op.map((id) => {
                let n = open[id];
                if (n.cost >= min) return;
                min = n.cost;
                qid = id;
            });

            console.log('f min ->', qid);

            let n = this.oNodes[qid];
            let nCost = open[qid].cost;

            console.log('n ->', n);

            n.neighbors
                .filter((id) => seen[id] === undefined)
                .map((id) => {
                    let m = open[id];
                    console.log('m ->', m);
                    let cost = nCost + this.getMoveCost(qid, id);
                    if (cost > m.cost) return;
                    m.cost = cost;
                    m.prev = qid;
                });

            seen[qid] = true;

            console.log('seen ->', Object.keys(seen));
            console.log('open'); console.log(open);
            console.log('-----------------------------------');
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//      Sample
// ---------------------------------------------------------------------------------------------------------------------

const links = [
    { from: 'A', to: 'B', cost: 6 },
    { from: 'A', to: 'D', cost: 1 },
    { from: 'B', to: 'C', cost: 5 },
    { from: 'B', to: 'D', cost: 2 },
    { from: 'B', to: 'E', cost: 2 },
    { from: 'C', to: 'E', cost: 5 },
    { from: 'D', to: 'E', cost: 1 }
];

let paths = new Dijkstra(links)
    .setStart('A')
    .getShortestPaths();

console.log(paths);

