export type SlackEvent = Mention;

export interface Mention {
  type: "app_mention";
  client_msg_id: string;
  text: string;
  user: string;
  ts: string;
  team: string;
  channel: string;
}

export interface SlackEventDto {
  token: string;
  team_id: string;
  api_app_id: string;
  event: SlackEvent;
  type: string;
  event_id: string;
  event_time: number;
  is_ext_shared_channel: boolean;
  event_context: string;
}
