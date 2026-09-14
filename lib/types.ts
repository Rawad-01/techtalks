export type Author = { id: string; name: string; image: string; bio?: string };
export type BlogDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: Author;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};
export type CommunityDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  memberCount: number;
  createdBy: Author;
  createdAt: string;
};
export type ProfileDTO = {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  provider: string;
  githubUrl: string;
  portfolioUrl: string;
  createdAt: string;
};
export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};
