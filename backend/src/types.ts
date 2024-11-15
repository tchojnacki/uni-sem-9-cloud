export type Verifier = {
  verify(token: string): Promise<{ sub: string; username: string }>;
};

export type Observer = {
  notifyListener: (sub: string, type: string, data: unknown) => void;
  countListeners: () => number;
};

export type Account = { id: string; username: string };

export type Message = {
  id: number;
  time: Date;
  sender: string;
  receiver: string;
  content: string;
};
