export interface MegaverseService {
    createMegaverse(): Promise<boolean>;
    cleanMegaverse(): Promise<boolean>;
}