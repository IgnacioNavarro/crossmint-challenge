import { basicConfig } from "../utils/basicConfig";
import { MegaverseMap, Polyanet, UniverseEntity, ResponseMap, Soloon, Cometh } from "../utils/types";
import { MegaverseService } from "./megaverseService";
import { compareMaps, convertMap, detectEntities } from "../utils/megaverseUtils";
import axios from 'axios';


class MegaverseServiceImpl implements MegaverseService {


    /**
     * Get the goal map from the crossmint API for the candidate
     * @returns A promise that resolves to the goal map in a string[][]
     * @throws Error if the goal map cannot be fetched or if the structure is invalid
     */
    async getGoalMap(): Promise<MegaverseMap> {
        try {
            const urlCall = `${basicConfig.crossmintAPI}/map/${basicConfig.candidateID}/goal`;

            const { data } = await axios.get<MegaverseMap>(urlCall);

            //check invalid structure
            //goal is an array, and it is not empty
            if (!data.goal || !Array.isArray(data.goal)) {
                throw new Error('Invalid goal map structure');
            }


            return data;
        }
        catch (error) {
            throw new Error('Failed to fetch goal map');
        }
    }

    /**
     * Get the actual personal map from the crossmint API for the candidate
     * @returns A promise that resolves to the actual map in a ResponseMap
     * @throws Error if the actual map cannot be fetched or if the structure is invalid
     */
    async getMap(): Promise<ResponseMap> {
        try {
            const urlCall = `${basicConfig.crossmintAPI}/map/${basicConfig.candidateID}`;

            const { data: actualMap } = await axios.get<ResponseMap>(urlCall);

            //check invalid structure
            //map is an object, and it has a content property that is an array
            if (!actualMap.map || !actualMap.map.content || !Array.isArray(actualMap.map.content)) {
                throw new Error('Invalid actual map structure');
            }

            return actualMap;
        }
        catch (error) {
            throw new Error('Failed to fetch map');
        }
    }


    /**
     * Post entities to the crossmint megaverse API to create the megaverse as expected in the goal map
     * @returns A promise that resolves to true if the megaverse was created successfully
     * @throws Error if the megaverse cannot be created or if the actual map does not match the goal map
     */
    async createMegaverse(): Promise<boolean> {
        try {
            //get the goal map, convert it to entity 0,1... create the entities in correct position 
            const goalMap = await this.getGoalMap();
            const goalMapConverted = convertMap(goalMap);
            const entities = detectEntities(goalMapConverted);
            await this.createPolyanets(entities.polyanets);
            await this.createSoloons(entities.soloons);
            await this.createComeths(entities.comeths);
            const actualMap = await this.getMap();

            //compare the actual map with the goal map
            if (!compareMaps(goalMapConverted, actualMap)) {
                throw new Error('Actual map does not match goal map');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to create megaverse');
        }
    }


    /**
     * Create an entity in the crossmint megaverse API as expected in the goal map
     * @param entity  The entity to be created in the megaverse
     * @param entityType  The type of the entity to be created, it can be polyanet, soloon or cometh
     * @returns  A promise that resolves to true if the entity was created successfully
     */
    async createUniverseEntity(entity: UniverseEntity, entityName: "polyanet" | "soloon" | "cometh"): Promise<boolean> {
        try {
            const urlCall = `${basicConfig.crossmintAPI}/${entityName}s`;
            console.log("hi there, I am here in createUniverseEntity function" + entity.row + " " + entity.column + " " + entityName + " " + urlCall);
            await axios.post(urlCall, { ...entity, candidateId: basicConfig.candidateID }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return true;
        }
        catch (error) {
            throw new Error('Failed to create universe entity');
        }
    }


    /**
     * Create polyanets in the crossmint megaverse API as expected in the goal map
     * @param polyanets The polyanets list to be created in the megaverse
     * @returns A promise that resolves to true if the polyanets were created successfully
     */
    async createPolyanets(polyanets: Polyanet[]): Promise<boolean> {
        try {

            for (const polyanet of polyanets) {
                await this.createUniverseEntity(polyanet, 'polyanet');
            }

            return true;
        } catch (error) {
            throw new Error('Failed to create polyanets');
        }
    }

    /**
     * Create soloons in the crossmint megaverse API as expected in the goal map
     * @param soloons The soloons list to be created in the megaverse
     * @returns A promise that resolves to true if the soloons were created successfully
     */
    async createSoloons(soloons: Soloon[]): Promise<boolean> {
        try {
            for (const soloon of soloons) {
                await this.createUniverseEntity(soloon, 'soloon');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to create polyanets');
        }
    }

    /**
     * Create comeths in the crossmint megaverse API as expected in the goal map
     * @param comeths The comeths list to be created in the megaverse
     * @returns A promise that resolves to true if the comeths were created successfully
     */
    async createComeths(comeths: Cometh[]): Promise<boolean> {
        try {
            for (const cometh of comeths) {
                await this.createUniverseEntity(cometh, 'cometh');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to create polyanets');
        }
    }


    /**
     * Delete all entities from the crossmint megaverse API to clean the megaverse
     * @returns A promise that resolves to true if the megaverse was cleaned successfully
     * @throws Error if the megaverse cannot be cleaned
     */
    async cleanMegaverse(): Promise<boolean> {
        try {
            //get the actual map, detect the entities, delete them
            const actualMap = await this.getMap();
            const entities = detectEntities(actualMap.map.content);
            await this.cleanPolyanets(entities.polyanets);
            await this.cleanSoloons(entities.soloons);
            await this.cleanComeths(entities.comeths);
            return true;
        } catch (error) {
            throw new Error('Failed to clean megaverse');
        }

    }


    /**
     * Delete an entity from the crossmint megaverse API to clean the megaverse
     * @param entity  The entity to be deleted from the megaverse
     * @param entityType  The type of the entity to be deleted, it can be polyanet, soloon or cometh
     * @returns  A promise that resolves to true if the entity was deleted successfully
     */
    async cleanUniverseEntity(entity: UniverseEntity, entityName: "polyanet" | "soloon" | "cometh"): Promise<boolean> {
        try {
            const urlCall = `${basicConfig.crossmintAPI}/${entityName}s`;
            console.log("hi there, I am here in cleanUniverseEntity function " + entity.row + " " + entity.column + " " + entityName + " " + urlCall);
            await axios.delete(urlCall, {
                data: { ...entity, candidateId: basicConfig.candidateID },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return true;
        } catch (error) {
            throw new Error('Failed to create universe entity');
        }
    }

    /**
     * Delete polyanets from the crossmint megaverse API to clean the megaverse
     * @param polyanets The polyanets list to be deleted from the megaverse
     * @returns A promise that resolves to true if the polyanets were deleted successfully
     */
    async cleanPolyanets(polyanets: Polyanet[]): Promise<boolean> {
        try {
            for (const polyanet of polyanets) {
                await this.cleanUniverseEntity(polyanet, 'polyanet');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to clean polyanets');
        }
    }

    /**
     * Delete soloons from the crossmint megaverse API to clean the megaverse
     * @param soloons The soloons list to be deleted from the megaverse
     * @returns A promise that resolves to true if the soloons were deleted successfully
     */
    async cleanSoloons(soloons: Soloon[]): Promise<boolean> {
        try {
            for (const soloon of soloons) {
                await this.cleanUniverseEntity(soloon, 'soloon');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to clean soloons');
        }
    }

    /**
     * Delete comeths from the crossmint megaverse API to clean the megaverse
     * @param comeths The comeths list to be deleted from the megaverse
     * @returns A promise that resolves to true if the comeths were deleted successfully
     */
    async cleanComeths(comeths: Cometh[]): Promise<boolean> {
        try {
            for (const cometh of comeths) {
                await this.cleanUniverseEntity(cometh, 'cometh');
            }
            return true;
        } catch (error) {
            throw new Error('Failed to clean comeths');
        }
    }


}
const megaverseService: MegaverseService = new MegaverseServiceImpl()

export default megaverseService;
