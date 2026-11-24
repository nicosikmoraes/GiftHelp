export interface User {
  id: number;
  name: string;
  email: string;
  shirt_size?: string | null;
  pants_size?: string | number | null;
  shoe_size?: string | number | null;
  ring_size?: string | number | null;
  preferred_color?: string | number | null;
}
