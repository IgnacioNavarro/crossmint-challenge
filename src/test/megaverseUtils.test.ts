import { convertMap, detectEntities, compareMaps } from '../utils/megaverseUtils'
import { UniverseEntityResponse, ResponseMap } from '../utils/types'

describe('ConverMap', () => {
    it('should return a megaverse map', () => {
        const map = {
            goal: [
                ['POLYANET', 'RED_SOLOON', 'LEFT_COMETH'],
                ['BLUE_SOLOON', 'SPACE', 'POLYANET']
            ]
        }
        const result = convertMap(map);
        expect(result).toEqual([
            [
                { type: 0 },
                { type: 1, color: 'red' },
                { type: 2, direction: 'left' }
            ],
            [
                { type: 1, color: 'blue' },
                null,
                { type: 0 }
            ]
        ]);
    })

    it('should return a megaverse map ignoring different types', () => {
        const map = {
            goal: [
                ['IGNA', 'RED_SOLOON', 'LEFT_COMETH'],
                ['BLUE_SOLOON', 'SPACE', 'POLYANET']
            ]
        }
        const result = convertMap(map);
        expect(result).toEqual([
            [
                null,
                { type: 1, color: 'red' },
                { type: 2, direction: 'left' }
            ],
            [
                { type: 1, color: 'blue' },
                null,
                { type: 0 }
            ]
        ]);
    })
});

describe('detectEntities', () => {
    it('should return an object with the detected entities', () => {
        const map: UniverseEntityResponse[][] = [
            [
                { type: 0 },
                { type: 1, color: 'red' },
                { type: 2, direction: 'left' }
            ],
            [
                { type: 1, color: 'blue' },
                null,
                { type: 0 }
            ]
        ];

        const result = detectEntities(map);
        expect(result).toEqual({
            polyanets: [
                { row: 0, column: 0 },
                { row: 1, column: 2 }
            ],
            soloons: [
                { row: 0, column: 1, color: 'red' },
                { row: 1, column: 0, color: 'blue' }
            ],
            comeths: [
                { row: 0, column: 2, direction: 'left' }
            ]
        });
    })

    it('should return an object with the detected entities ignoring nulls', () => {
        const map: UniverseEntityResponse[][] = [
            [
                null,
                { type: 1, color: 'red' },
                { type: 2, direction: 'left' }
            ],
            [
                { type: 1, color: 'blue' },
                null,
                { type: 0 }
            ]
        ];

        const result = detectEntities(map);
        expect(result).toEqual({
            polyanets: [
                { row: 1, column: 2 }
            ],
            soloons: [
                { row: 0, column: 1, color: 'red' },
                { row: 1, column: 0, color: 'blue' }
            ],
            comeths: [
                { row: 0, column: 2, direction: 'left' }
            ]
        });
    })

})


describe('compareMaps', () => {
    it('should return true if the maps are equal', () => {
        const goalMap: UniverseEntityResponse[][] = [
            [
                { type: 0 },
                { type: 1, color: 'red' },
                { type: 2, direction: 'left' }
            ],
            [
                { type: 1, color: 'blue' },
                null,
                { type: 0 }
            ]
        ];

        const actualMap: ResponseMap ={
            map: {
                content: [
                    [
                        { type: 0 },
                        { type: 1, color: 'red' },
                        { type: 2, direction: 'left' }
                    ],
                    [
                        { type: 1, color: 'blue' },
                        null,
                        { type: 0 }
                    ]
                ],
                _id: '',
                candidateId: '',
                phase: 0,
                __v: 0
            }
        };


        const result = compareMaps(goalMap,actualMap);

        expect(result).toEqual(true);
    });

})
