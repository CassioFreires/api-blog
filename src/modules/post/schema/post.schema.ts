import { z } from "zod";

export const createPostSchema = z
  .object({
    postType: z.enum(['standard', 'poll']),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    category_id: z.number().optional(),
    content: z.string().optional(),
    question: z.string().optional(),
    options: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.postType === 'standard') {
      if (!data.title) ctx.addIssue({ path: ['title'], message: 'Título obrigatório para post padrão', code: z.ZodIssueCode.custom });
      if (!data.subtitle) ctx.addIssue({ path: ['subtitle'], message: 'Subtítulo obrigatório para post padrão', code: z.ZodIssueCode.custom });
      if (!data.category_id) ctx.addIssue({ path: ['category_id'], message: 'Categoria obrigatória', code: z.ZodIssueCode.custom });
      if (!data.content) ctx.addIssue({ path: ['content'], message: 'Conteúdo obrigatório', code: z.ZodIssueCode.custom });
    } else if (data.postType === 'poll') {
      if (!data.question) ctx.addIssue({ path: ['question'], message: 'Pergunta obrigatória para enquete', code: z.ZodIssueCode.custom });
      if (!data.options || data.options.length < 2) ctx.addIssue({ path: ['options'], message: 'A enquete deve ter pelo menos 2 opções', code: z.ZodIssueCode.custom });
    }
  });
