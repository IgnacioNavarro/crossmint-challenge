//types and interfaces here


// Create a global type for the universe
export interface UniverseEntity {
    row: number;
    column: number;
    color?: SolColor;
    direction?: ComDirection;
};

export type UniverseEntityResponse = {
    type: number;
    color?: SolColor;
    direction?: ComDirection;
} | null;

//declare the types for the different entities
export type Polyanet = Pick<UniverseEntity, "row" | "column">;

export type Soloon = Pick<UniverseEntity, "row" | "column" | "color">;

export type SolColor = "blue" | "red" | "purple" | "white";

export type Cometh = Pick<UniverseEntity, "row" | "column" | "direction">;

export type ComDirection = "up" | "down" | "left" | "right";

export interface MegaverseMap {
    goal: string[][];
}

export interface ResponseMap {
    map: {
        _id: string
        content: UniverseEntityResponse[][]
        candidateId: string
        phase: number
        __v: number
    }

}