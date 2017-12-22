
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
//      Breadth First Search (BFS)
//      Tuto video: https://www.youtube.com/watch?v=bIA8HEEUxZI
// ---------------------------------------------------------------------------------------------------------------------

class BreadthFirstSearch {

    constructor (links) {

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

    calcNeighbors (links) {

        this.oNodes = {};

        links.map((link) => {

            let infos = link.split('');
            let idFrom = infos[0];
            let idTo = infos[1];

            if (this.oNodes[idFrom] === undefined) this.oNodes[idFrom] = { id: idFrom, neighbors: [] };
            if (this.oNodes[idTo] === undefined) this.oNodes[idTo] = { id: idTo, neighbors: [] };

            let from = this.oNodes[idFrom];
            let to = this.oNodes[idTo];

            if (from.neighbors.indexOf(idTo) === -1) from.neighbors.push(idTo);
            if (to.neighbors.indexOf(idFrom) === -1) to.neighbors.push(idFrom);
        });
    }

    getPathFromParents (parents) {

        let path = [];
        let n = this.end;

        while (n) {
            path.push(n);
            if (parents[n] === undefined) throw new Error('Id not found in closed list -> ' + n);
            n = parents[n];
        }

        return path.reverse();
    }

    getShortestPath () {

        let seen = {};
        let parents = {};
        let queue = [ this.start ];

        parents[this.start] = null;

        while (queue.length) {

            let nid = queue.shift();

            seen[nid] = true;

            console.log('nid ->', nid);

            let n = this.oNodes[nid];

            console.log('n ->', n);

            let mid = n.neighbors.find((id) => id === this.end);

            if (mid) {
                queue.push(mid);
                parents[mid] = nid;
                console.log('------------------------------------');
                return this.getPathFromParents(parents).join(' -> ');
            }

            n.neighbors
                .filter((id) => seen[id] === undefined)
                .filter((id) => queue.indexOf(id) === -1)
                .map((id) => {
                    parents[id] = nid;
                    queue.push(id)
                });

            console.log('queue', queue);
            console.log('parents', parents);
            console.log('------------------------------------');
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//      Sample
// ---------------------------------------------------------------------------------------------------------------------

const links = ['AB', 'AD', 'AG', 'BE', 'BF', 'CF', 'CH', 'DF', 'EG'];

let path = new BreadthFirstSearch(links)
    .setStart('A')
    .setEnd('H')
    .getShortestPath();

console.log(path);

