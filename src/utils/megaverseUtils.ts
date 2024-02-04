import { ComDirection, Cometh, MegaverseMap, Polyanet, SolColor, Soloon, UniverseEntityResponse, ResponseMap } from "./types";


/**
 * Converts a MegaverseMap to a UniverseEntityResponse[][], with the format of the response
 * @param map The map to convert
 * @returns The converted map
 */
export function convertMap(map: MegaverseMap): UniverseEntityResponse[][] {

    const universeMap: UniverseEntityResponse[][] = [];

    for (const row of map.goal) {
        const universeRow: UniverseEntityResponse[] = [];
        for (const cell of row) {
            if (cell.toUpperCase() === 'POLYANET') {
                universeRow.push({ type: 0 });
            }
            else if (cell.split('_').length === 2) {
                const [data, type] = cell.split('_');
                if (type.toUpperCase() === 'SOLOON') {
                    universeRow.push({ type: 1, color: data.toLowerCase() as SolColor });
                }
                else if (type.toUpperCase() === 'COMETH') {
                    universeRow.push({ type: 2, direction: data.toLowerCase() as ComDirection });
                }
            } else {
                universeRow.push(null);
            }
        }
        universeMap.push(universeRow);
    }

    return universeMap;
}


/**
 * Detects the differents entities in the map
 * @param map The map to detect entities in
 * @returns An object containing the detected entities
 */
export function detectEntities(map: UniverseEntityResponse[][]): { polyanets: Polyanet[], soloons: Soloon[], comeths: Cometh[] } {

    const polyanets: Polyanet[] = [];
    const soloons: Soloon[] = [];
    const comeths: Cometh[] = [];


    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const cell = map[row][col];
            switch (map[row][col]?.type) {

                case 0:
                    polyanets.push({ row, column: col });
                    break;
                case 1:
                    soloons.push({ row, column: col, color: cell?.color });
                    break;
                case 2:
                    comeths.push({ row, column: col, direction: cell?.direction });
                    break;
                default:
                    break;
            }
        }
    }

    return { polyanets, soloons, comeths };

}

/**
 * Compares two maps to see if they are the same
 * @param goalMap The map to compare against
 * @param actualMap The map to compare
 * @returns true if the maps are the same, false otherwise
 */
export function compareMaps(goalMap: UniverseEntityResponse[][], actualMap: ResponseMap): boolean {

    console.log("comparing maps...");
    if (goalMap.length !== actualMap.map.content.length) {
        return false;
    }

    for (let row = 0; row < goalMap.length; row++) {

        if (goalMap[row].length !== actualMap.map.content[row].length) {
            return false;
        }

        for (let item = 0; item < goalMap[row].length; item++) {

            if (goalMap[row][item]?.type !== actualMap.map.content[row][item]?.type) {
                return false;
            }

        }
    }

    return true;
}