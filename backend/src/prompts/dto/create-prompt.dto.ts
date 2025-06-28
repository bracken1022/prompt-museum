export class CreatePromptDto {
  title: string;
  description: string;
  content: string;
  category: string;
  agent: string;
  tags: string[];
  is_public?: boolean;
}