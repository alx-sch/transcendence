export type ClientMessage =
  | {
      type: 'newUser';
    }
  | { type: 'move'; payload: { index: number } }
  | { type: 'reset' };

const game = {
  players: 0,
  board: Array(9).fill(null),
};

export function gameLogic(message: ClientMessage) {
  if (message.type === 'newUser') game.players += 1;
  return {
    type: 'gameUpdate',
    payload: game,
  };
}
