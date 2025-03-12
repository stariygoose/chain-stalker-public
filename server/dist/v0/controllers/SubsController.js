import { SubsService } from "../services/SubsService.js";
import { BadRequestError } from "../errors/Errors.js";
export class SubsController {
    getSubscriptionsByUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new BadRequestError();
            }
            const subs = await new SubsService().getSubscriptionsByUser(+userId);
            return res.status(200).json({ userId: +userId, subscriptions: subs });
        }
        catch (error) {
            next(error);
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new BadRequestError();
            }
            await new SubsService().deleteUser(+userId);
            return res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    };
}
