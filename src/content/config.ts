import { defineCollection, z } from "astro:content";

const changelog = defineCollection({
  type: "content",
  schema: z.object({
    version: z.string().regex(/^v[0-9]+\.[0-9]+\.[0-9]+$/g, {
      message: "Version numbers should follow X.Y.Z format!",
    }),
    date: z.date(),
    commit: z.string().length(40).optional(),
  }),
});

const collections = {
  changelog,
};

export { collections };
