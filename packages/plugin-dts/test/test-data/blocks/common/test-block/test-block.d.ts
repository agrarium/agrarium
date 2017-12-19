/**
 * Interface for TestBlock
 */
export interface TestBlock {
    /**
     * Description for count attribute
     */
    count: number,

    /**
     * Description for answer attribute
     */
    answer: boolean,

    /**
     * Description for onClick signature
     * @param e - dom event
     */
    onClick(e: object): void
}
