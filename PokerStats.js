var StatStorage = require("./StatStorage");

/**
 * The PlayerStats stores the player properties used for statistical purposes
 * *
 * @param uuid
 * @returns {PlayerStats}
 * @constructor
 */
function PlayerStats(uuid) {
    if (!(this instanceof  PlayerStats)) {
        return new PlayerStats(uuid);
    }
    
    this.uuid = uuid;
    this.chips = 0;
}

PlayerStats.prototype.setName = function(name) {
    this.name = name;
    return this;
}

PlayerStats.prototype.setChips = function(chips) {
    this.chips = chips;
    return this;
}

/**
 * A table is a set of PlayerStats and the statistical history of their chips.
 * *
 * @param uuid
 * @returns {TableStats}
 * @constructor
 */
function TableStats(uuid) {
    if (!(this instanceof  TableStats)) {
        return new TableStats(uuid);
    }
    this.uuid = uuid;
    this.round = 0;
    this.players = {};
    this.stats = new StatStorage();
}

TableStats.prototype.getOrCreatePlayer = function(playerBlob) {
    var playerId = playerBlob.id || playerBlob.uuid || playerBlob.email || playerBlob.name;
    var player = this.players[playerId];
    if (!player) {
        player = new PlayerStats(playerId);
        this.players[playerId] = player;
    }
    return player;
}

TableStats.prototype.commitChanges = function() {
    var self = this;
    Object.keys(this.players).forEach(function(playerId) {
        var player = self.players[playerId];
        self.stats.addSeries(player.uuid, player.chips);
    });
    this.stats.push(this.round);
    this.round += 1;
};

TableStats.prototype.retrieveSeries = function() {
    return this.stats.store;
}

/**
 * Manages a set of TableStats
 *
 * @constructor
 */
function PokerStats() {
    this.tables = {};
}

PokerStats.prototype.addTable = function(table) {
    this.table[table.uuid] = table;
    return this;
};

PokerStats.prototype.addGameObject = function(gameObject) {
    // console.log("Adding gameObject", JSON.stringify(gameObject, undefined, 1));
    var tableUuid = "default-table";
    if (this.tables[tableUuid] === undefined) {
        this.tables[tableUuid] = new TableStats(tableUuid);
    }
    var table = this.tables[tableUuid];
    gameObject.players.forEach(function(playerBlob){
        var player = table.getOrCreatePlayer(playerBlob);
        player.name = playerBlob.name;
        player.chips = playerBlob.chips;
    });
    table.commitChanges();
};

PokerStats.prototype.getTableStats = function(tableId) {
    tableId = tableId || "default-table";
    if (this.tables[tableId]) {
        return this.tables[tableId].retrieveSeries();
    }
    return [];
}


exports.PokerStats = PokerStats;
exports.PlayerStats = PlayerStats;
exports.TableStats = TableStats;