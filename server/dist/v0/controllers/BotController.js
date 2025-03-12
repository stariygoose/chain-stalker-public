import { BotService } from "../services/BotService.js";
import { BadRequestError } from "../errors/Errors.js";
import { isTargetCoin, isTargetNftCollection } from "../functions/functions.js";
class BotController {
    botService;
    constructor(os, wsm) {
        this.botService = new BotService(os, wsm);
    }
    findCoin = async (req, res, next) => {
        try {
            const { symbol } = req.params;
            if (!symbol)
                throw new BadRequestError();
            const coin = await this.botService.findCoin(symbol);
            return res.status(200).json(coin);
        }
        catch (error) {
            next(error);
        }
    };
    findCollection = async (req, res, next) => {
        try {
            const { chain, address } = req.params;
            if (!chain || !address)
                throw new BadRequestError();
            const collection = await this.botService.findColleciton(chain, address);
            return res.status(200).json(collection);
        }
        catch (error) {
            next(error);
        }
    };
    stalk = async (req, res, next) => {
        const { target } = req.params;
        const userState = req.body;
        if (!target)
            throw new BadRequestError();
        try {
            switch (target) {
                case "coin":
                    if (isTargetCoin(userState)) {
                        await this.botService.stalkCoin(userState);
                        return res.status(201).json({ message: `The coin is under stalking.` });
                    }
                    break;
                case "collection":
                    if (isTargetNftCollection(userState)) {
                        await this.botService.stalkNft(userState);
                        return res.status(201).json({ message: `The collection is under stalking.` });
                    }
                    break;
                default:
                    throw new BadRequestError();
            }
        }
        catch (error) {
            next(error);
        }
    };
}
export { BotController };
