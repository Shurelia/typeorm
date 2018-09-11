"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityMetadata_1 = require("../metadata/EntityMetadata");
var ColumnMetadata_1 = require("../metadata/ColumnMetadata");
var ForeignKeyMetadata_1 = require("../metadata/ForeignKeyMetadata");
/**
 * Creates EntityMetadata for junction tables of the closure entities.
 * Closure junction tables are tables generated by closure entities.
 */
var ClosureJunctionEntityMetadataBuilder = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ClosureJunctionEntityMetadataBuilder(connection) {
        this.connection = connection;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds EntityMetadata for the closure junction of the given closure entity.
     */
    ClosureJunctionEntityMetadataBuilder.prototype.build = function (parentClosureEntityMetadata) {
        var _this = this;
        // create entity metadata itself
        var entityMetadata = new EntityMetadata_1.EntityMetadata({
            parentClosureEntityMetadata: parentClosureEntityMetadata,
            connection: this.connection,
            args: {
                target: "",
                name: parentClosureEntityMetadata.tableNameWithoutPrefix,
                type: "closure-junction"
            }
        });
        entityMetadata.build();
        // create ancestor and descendant columns for new closure junction table
        parentClosureEntityMetadata.primaryColumns.forEach(function (primaryColumn) {
            entityMetadata.ownColumns.push(new ColumnMetadata_1.ColumnMetadata({
                connection: _this.connection,
                entityMetadata: entityMetadata,
                closureType: "ancestor",
                referencedColumn: primaryColumn,
                args: {
                    target: "",
                    mode: "virtual",
                    propertyName: primaryColumn.propertyName + "_ancestor",
                    options: {
                        primary: true,
                        length: primaryColumn.length,
                        type: primaryColumn.type
                    }
                }
            }));
            entityMetadata.ownColumns.push(new ColumnMetadata_1.ColumnMetadata({
                connection: _this.connection,
                entityMetadata: entityMetadata,
                closureType: "descendant",
                referencedColumn: primaryColumn,
                args: {
                    target: "",
                    mode: "virtual",
                    propertyName: primaryColumn.propertyName + "_descendant",
                    options: {
                        primary: true,
                        length: primaryColumn.length,
                        type: primaryColumn.type,
                    }
                }
            }));
        });
        // if tree level column was defined by a closure entity then add it to the junction columns as well
        if (parentClosureEntityMetadata.treeLevelColumn) {
            entityMetadata.ownColumns.push(new ColumnMetadata_1.ColumnMetadata({
                connection: this.connection,
                entityMetadata: entityMetadata,
                args: {
                    target: "",
                    mode: "virtual",
                    propertyName: "level",
                    options: {
                        type: this.connection.driver.mappedDataTypes.treeLevel,
                    }
                }
            }));
        }
        // create junction table foreign keys
        entityMetadata.foreignKeys = [
            new ForeignKeyMetadata_1.ForeignKeyMetadata({
                entityMetadata: entityMetadata,
                referencedEntityMetadata: parentClosureEntityMetadata,
                columns: [entityMetadata.ownColumns[0]],
                referencedColumns: parentClosureEntityMetadata.primaryColumns,
            }),
            new ForeignKeyMetadata_1.ForeignKeyMetadata({
                entityMetadata: entityMetadata,
                referencedEntityMetadata: parentClosureEntityMetadata,
                columns: [entityMetadata.ownColumns[1]],
                referencedColumns: parentClosureEntityMetadata.primaryColumns,
            }),
        ];
        return entityMetadata;
    };
    return ClosureJunctionEntityMetadataBuilder;
}());
exports.ClosureJunctionEntityMetadataBuilder = ClosureJunctionEntityMetadataBuilder;

//# sourceMappingURL=ClosureJunctionEntityMetadataBuilder.js.map
