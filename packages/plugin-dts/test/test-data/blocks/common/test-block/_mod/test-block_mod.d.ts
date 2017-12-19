export interface TestBlock {
    /**
     * Description for answer attribute extension
     */
    answer: boolean|string,

    /**
     * Yet another one method
     */
    onExit(): void,

    /**
     * Different signature for onClick
     * @param e - dom event
     * @param data - event data
     */
    onClick(e: object, data: object): void
}
