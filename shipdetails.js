#!/bin/node
const sqlite3 = require('sqlite3');

const eveDb = new sqlite3.Database('eve.db', sqlite3.OPEN_READONLY);

eveDb.all(`select typeID,attributeID,valueFloat from dgmTypeAttributes where typeID in (select typeID from invTypes where groupID in (select groupID from invGroups where categoryID = 6) order by typeID) and attributeId in (101, 102, 208, 209, 210, 211) and valueFloat != 0.0;`, [], function (err, rows) {
	if (err == null) {
		var output = new Array;
		rows.forEach((row) => {
			var has_record = false;
			var record;
			output.forEach((o) => {
				if (o.typeID == row.typeID) {
					has_record = true;
					record = o;
				}
			});
			if (!has_record) { // this object with a typeID exists
				record = new Object;
				record.typeID = row.typeID;
				record.sensorType = null;
				record.sensorStrength = 0;
				record.launcherHardpoints = 0;
				record.turretHardpoints = 0;
			}
			switch (row.attributeID) {
				case 101: // Launcher Hardpoints
					record.launcherHardpoints = row.valueFloat;
					break;
				case 102: // Turret Hardpoints
					record.turretHardpoints = row.valueFloat;
					break;
				case 208: // RADAR Sensor Strength
					record.sensorType = 'RADAR';
					record.sensorStrength = row.valueFloat;
					break;
				case 209: // Ladar Sensor Strength
					record.sensorType = 'Ladar';
					record.sensorStrength = row.valueFloat;
					break;
				case 210: // Magnetometric Sensor Strength
					record.sensorType = 'Magnetometric';
					record.sensorStrength = row.valueFloat;
					break;
				case 211: // Gravimetric Sensor Strength
					record.sensorType = 'Gravimetric';
					record.sensorStrength = row.valueFloat;
					break;
				default:
					throw 'sql returned unknown attributeID';
			}
			if (!has_record) {
				output.push(record);
			}
		});
		console.log(JSON.stringify(output));
	} else {
		throw err;
	}
});
