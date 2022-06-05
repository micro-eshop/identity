
export interface TokenGenerator {
    generate(user: User): Promise<string>;
}