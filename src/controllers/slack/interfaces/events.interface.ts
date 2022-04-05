export type SlackEvent = Challenge;

interface Challenge {
  token: string;
  challenge: string;
  type: string;
}
