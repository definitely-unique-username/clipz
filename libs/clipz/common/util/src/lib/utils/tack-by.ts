export function trackByIndex(index: number): number {
    return index;
}

export function trackById<T extends { id: number | string; }>(index: number, item: T): number | string {
    return item.id;
}