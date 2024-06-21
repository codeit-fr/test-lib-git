/**
 * Super-class of all Entities.
 * Also used in FirestoreRepositoryBase<T> to link BO entities with DB
 */
export class BaseEntity {
    constructor() {
        this.id = null;
        this.creationDate = new Date();
        this.lastModificationDate = new Date();
        this.owner = '';
        this.ownerId = '';
        // Firestore reference
        this.documentReference = null;
    }
    // needed in Firestore to test for equality
    equals(documentReferencePath) {
        return this.documentReference?.path === documentReferencePath;
    }
    /**
     * Override to return a good stringified value
     */
    toString() {
        return this.id ?? "Unknown";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2Jhc2UtZW50aXR5LmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tbW9uLWxpYi9zcmMvbGliL2VudGl0aWVzL19iYXNlLWVudGl0eS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sVUFBVTtJQUF2QjtRQUNTLE9BQUUsR0FBa0IsSUFBSSxDQUFDO1FBQ3pCLGlCQUFZLEdBQVUsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNqQyx5QkFBb0IsR0FBVSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3pDLFVBQUssR0FBWSxFQUFFLENBQUM7UUFDcEIsWUFBTyxHQUFZLEVBQUUsQ0FBQztRQUU3QixzQkFBc0I7UUFDZixzQkFBaUIsR0FBbUMsSUFBSSxDQUFDO0lBY2xFLENBQUM7SUFaQywyQ0FBMkM7SUFDcEMsTUFBTSxDQUFFLHFCQUE2QjtRQUMxQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEtBQUsscUJBQXFCLENBQUM7SUFDaEUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLE9BQU8sSUFBSSxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUM7SUFDOUIsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9jdW1lbnREYXRhLCBEb2N1bWVudFJlZmVyZW5jZSB9IGZyb20gXCJmaXJlYmFzZS9maXJlc3RvcmVcIjtcclxuXHJcbi8qKlxyXG4gKiBTdXBlci1jbGFzcyBvZiBhbGwgRW50aXRpZXMuXHJcbiAqIEFsc28gdXNlZCBpbiBGaXJlc3RvcmVSZXBvc2l0b3J5QmFzZTxUPiB0byBsaW5rIEJPIGVudGl0aWVzIHdpdGggREJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYXNlRW50aXR5IHtcclxuICBwdWJsaWMgaWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIHB1YmxpYyBjcmVhdGlvbkRhdGU/OiBEYXRlID0gbmV3IERhdGUoKTtcclxuICBwdWJsaWMgbGFzdE1vZGlmaWNhdGlvbkRhdGU/OiBEYXRlID0gbmV3IERhdGUoKTtcclxuICBwdWJsaWMgb3duZXI/OiBzdHJpbmcgPSAnJztcclxuICBwdWJsaWMgb3duZXJJZD86IHN0cmluZyA9ICcnO1xyXG5cclxuICAvLyBGaXJlc3RvcmUgcmVmZXJlbmNlXHJcbiAgcHVibGljIGRvY3VtZW50UmVmZXJlbmNlPzogRG9jdW1lbnRSZWZlcmVuY2U8YW55PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAvLyBuZWVkZWQgaW4gRmlyZXN0b3JlIHRvIHRlc3QgZm9yIGVxdWFsaXR5XHJcbiAgcHVibGljIGVxdWFscz8oZG9jdW1lbnRSZWZlcmVuY2VQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRvY3VtZW50UmVmZXJlbmNlPy5wYXRoID09PSBkb2N1bWVudFJlZmVyZW5jZVBhdGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSB0byByZXR1cm4gYSBnb29kIHN0cmluZ2lmaWVkIHZhbHVlXHJcbiAgICovXHJcbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pZCA/PyBcIlVua25vd25cIjtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==