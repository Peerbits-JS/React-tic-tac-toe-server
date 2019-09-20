import mongoose from "mongoose";

export type GameSate = "win" | "draw";

export type GameData = {
    firstPlayer: string;
    secondPlayer: string;
    state: GameSate;
    winner?: string;
};

export type GameDocument = mongoose.Document & GameData;

const gameSchema = new mongoose.Schema(
    {
        firstPlayer: {
            type: String,
            lowercase: true
        },
        secondPlayer: {
            type: String,
            lowercase: true
        },
        state: {
            type: String,
            default: "draw"
        },
        winner: {
            type: String,
            lowercase: true
        }
    },
    { timestamps: true }
);

export const Game = mongoose.model<GameDocument>("Game", gameSchema);
