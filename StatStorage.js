
function StatStorage() {
    if (!(this instanceof StatStorage)){
        return new StatStorage();
    }
    this.current = {};
    this.store = [];
}

StatStorage.prototype.addSeries = function(id, value) {
    this.current[id] = value;
};

StatStorage.prototype.push = function(position) {
    var data = {
        position: position,
        values: this.current
    };
    this.store.push(data);
    this.current = {};
};



module.exports = StatStorage;
