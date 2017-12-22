
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
//      Depth First Search (DFS)
//      Tuto video: https://www.youtube.com/watch?v=bIA8HEEUxZI
// ---------------------------------------------------------------------------------------------------------------------

class DeepFirstSearch {

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

    getShortestPath () {

        let seen = {};
        let stack = [ this.start ];

        while (stack.length) {

            let nid = stack.slice(-1)[0];
            seen[nid] = true;

            console.log('nid ->', nid);

            let n = this.oNodes[nid];

            console.log('n ->', n);

            let mid = n.neighbors.find((id) => seen[id] === undefined);

            if (mid === undefined) {
                console.log('dead end, popping', stack.pop());
                console.log('stack', stack);
                console.log('------------------------------------');
                continue;
            }

            console.log('1st neighbor ->', mid);

            stack.push(mid);

            if (mid === this.end) {
                console.log('------------------------------------');
                return stack.join(' -> ');
            }

            console.log('stack', stack);
            console.log('------------------------------------');
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//      Sample
// ---------------------------------------------------------------------------------------------------------------------

const links = ['AB', 'AD', 'AG', 'BE', 'BF', 'CF', 'CH', 'DF', 'EG'];

let path = new DeepFirstSearch(links)
    .setStart('A')
    .setEnd('D')
    .getShortestPath();

console.log(path);

