export interface SyncOperation<T> {
    date: Date;
    operation: 'create' | 'update' | 'delete';
    entity: T;
}