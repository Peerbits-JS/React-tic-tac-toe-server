import { Game, GameDocument, GameData, GameSate } from "../models/Game";
import { Request, Response, NextFunction } from "express";

/**
 * GET /game
 * Get game list.
 */
export const getGame = (req: Request, res: Response, next: NextFunction) => {
    const firstName = req.query.firstPlayer;
    const secondName = req.query.secondPlayer;

    let firstPlayer: string = firstName < secondName ? firstName : secondName;
    let secondPlayer: string = firstName > secondName ? firstName : secondName;

    firstPlayer = firstPlayer.toLowerCase();
    secondPlayer = secondPlayer.toLowerCase();

    Game.find({ firstPlayer, secondPlayer })
        .then((gameDocs: GameDocument[]) => res.json(gameDocs))
        .catch((err) => next(err));
};

/**
 * GET /score
 * Get game score.
 */
export const getScore = (req: Request, res: Response, next: NextFunction) => {
    const firstName = req.query.firstPlayer;
    const secondName = req.query.secondPlayer;

    let firstPlayer: string = firstName < secondName ? firstName : secondName;
    let secondPlayer: string = firstName > secondName ? firstName : secondName;

    firstPlayer = firstPlayer.toLowerCase();
    secondPlayer = secondPlayer.toLowerCase();

    Game.find({ firstPlayer, secondPlayer })
        .then((gameDocs: GameDocument[]) => {
            let result = {
                [firstPlayer as string]: 0,
                [secondPlayer as string]: 0,
                total: gameDocs.length
            };
            result = gameDocs.reduce<{ [x: string]: number; total: number }>(
                (
                    previousValue,
                    currentValue
                ): { [x: string]: number; total: number } => {
                    if (currentValue.winner) {
                        const winner = currentValue.winner;
                        return {
                            ...previousValue,
                            [winner]: ++previousValue[winner]
                        };
                    }
                    return previousValue;
                },
                result
            );
            res.json(result);
        })
        .catch((err) => next(err));
};

/**
 * POST /game
 * Create a new game.
 */
export const postGame = (req: Request, res: Response, next: NextFunction) => {
    const firstName = req.body.firstPlayer;
    const secondName = req.body.secondPlayer;

    const firstPlayer = firstName < secondName ? firstName : secondName;
    const secondPlayer = firstName > secondName ? firstName : secondName;

    const data: GameData = { firstPlayer, secondPlayer, state: "draw" };

    const winner = req.body.winner;
    if (winner) {
        if (!(winner === firstName || winner === secondName)) {
            return res.status(400);
        }

        data.winner = winner;
        data.state = "win";
    }

    const game = new Game(data);

    game.save()
        .then((gameDoc: GameDocument) => res.status(201).json(gameDoc))
        .catch((err) => next(err));
};

/**
 * PATCH /game
 * Update a game.
 */
export const patchGame = (req: Request, res: Response, next: NextFunction) => {
    const gameId = req.params.id;

    Game.findByIdAndUpdate(gameId, { winner: req.body.winner, state: "win" })
        .then((gameDoc: GameDocument) => res.json(gameDoc))
        .catch((err) => next(err));
};
