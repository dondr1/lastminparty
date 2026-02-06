export type InviteItem = {
  id: number;
  status: "pending" | "accepted" | "rejected";
  event: {
    uuid_id: string;
    title: string;
    host: {
      id: string;
      username: string;
      avatar_url: string;
    };
  };
};
