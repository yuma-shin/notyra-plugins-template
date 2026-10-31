export interface MarkdownNoteMeta {
    id: string;
    title: string;
    filePath: string;
    relativePath: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    excerpt?: string;
}
