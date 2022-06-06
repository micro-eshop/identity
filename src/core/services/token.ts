
export interface TokenGenerator {
    generate(user: User): string;
}