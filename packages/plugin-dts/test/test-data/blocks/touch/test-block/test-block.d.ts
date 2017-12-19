/**
 * Touch addition
 */
export interface TestBlock {
    /**
     * It's object on touch
     */
    count: object;

    /**
     * Special method for touch
     */
    onTouchStart(): void;
}
