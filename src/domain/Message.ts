import * as yup from 'yup';

const messageSchema = yup.object({
  content: yup.string().required(),
});

export type Message = yup.InferType<typeof messageSchema>;

export function createMessage(content: string): Message {
  return messageSchema.cast({ content });
}

export async function validateMessage(message: Message): Promise<void> {
  await messageSchema.validate(message);
}
