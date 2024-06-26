/**
 * This class is used to link a BaseEntity to its Observable and its Firestore DocumentReference
 */
export class FirestoreEntityWatcher {
    constructor(observable = null, documentRef) {
        this.observable = null;
        this.documentRef = null;
        this.observable = observable;
        this.documentRef = documentRef;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLWVudGl0eS13YXRjaGVyLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tbW9uLWxpYi9zcmMvbGliL2RhdGFiYXNlL2ZpcmVzdG9yZS1lbnRpdHktd2F0Y2hlci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTs7R0FFRztBQUNILE1BQU0sT0FBTyxzQkFBc0I7SUFJakMsWUFBWSxhQUEwQyxJQUFJLEVBQUUsV0FBbUQ7UUFIeEcsZUFBVSxHQUFnQyxJQUFJLENBQUM7UUFDL0MsZ0JBQVcsR0FBMkMsSUFBSSxDQUFDO1FBR2hFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBEb2N1bWVudERhdGEsIERvY3VtZW50UmVmZXJlbmNlIH0gZnJvbSBcImZpcmViYXNlL2ZpcmVzdG9yZVwiO1xyXG5pbXBvcnQgeyBCYXNlRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0aWVzL19iYXNlLWVudGl0eS5jbGFzc1wiO1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgaXMgdXNlZCB0byBsaW5rIGEgQmFzZUVudGl0eSB0byBpdHMgT2JzZXJ2YWJsZSBhbmQgaXRzIEZpcmVzdG9yZSBEb2N1bWVudFJlZmVyZW5jZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpcmVzdG9yZUVudGl0eVdhdGNoZXI8VCBleHRlbmRzIEJhc2VFbnRpdHk+IHtcclxuICBwdWJsaWMgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxUIHwgbnVsbD4gfCBudWxsID0gbnVsbDtcclxuICBwdWJsaWMgZG9jdW1lbnRSZWY6IERvY3VtZW50UmVmZXJlbmNlPERvY3VtZW50RGF0YT4gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3Iob2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxUIHwgbnVsbD4gfCBudWxsID0gbnVsbCwgZG9jdW1lbnRSZWY6IERvY3VtZW50UmVmZXJlbmNlPERvY3VtZW50RGF0YT4gfCBudWxsKSB7XHJcbiAgICB0aGlzLm9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xyXG4gICAgdGhpcy5kb2N1bWVudFJlZiA9IGRvY3VtZW50UmVmO1xyXG4gIH1cclxuXHJcbn0iXX0=