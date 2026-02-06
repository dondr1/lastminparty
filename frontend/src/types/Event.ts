export type Creator = {
  id: string;
  username: string;
  avatar_url: string;
};

export type EventItem = {
  id: number;
  uuid_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  image_url: string;
  is_invite_only: boolean;
  capacity: number;
  created_at: string;
  creator: Creator;
};
