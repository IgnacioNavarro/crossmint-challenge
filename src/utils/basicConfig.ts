import dotenv from 'dotenv';
dotenv.config();

export const basicConfig = {
    baseURL: process.env.BASE_URL || 'http://localhost',
    port: process.env.PORT || 3000,
    candidateID: process.env.CANDIDATE_ID || '22ab3ccb-e0bf-4a33-ae8f-361b6f2fdee1',
    crossmintAPI: process.env.CROSSMINT_API || 'https://challenge.crossmint.io/api'
};
