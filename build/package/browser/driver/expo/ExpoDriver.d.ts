import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { ExpoConnectionOptions } from "./ExpoConnectionOptions";
import { QueryRunner } from "../../query-runner/QueryRunner";
import { Connection } from "../../connection/Connection";
export declare class ExpoDriver extends AbstractSqliteDriver {
    options: ExpoConnectionOptions;
    driver: any;
    constructor(connection: Connection);
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode?: "master" | "slave"): QueryRunner;
    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection(): Promise<void>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
