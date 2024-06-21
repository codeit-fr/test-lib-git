import { BaseEntity } from "./_base-entity.class";
/**
 * An invitation holds all the needed information to invite a user !
 */
export class Invitation extends BaseEntity {
    constructor() {
        super(...arguments);
        this.email = null;
        this.displayName = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRhdGlvbi5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbW1vbi1saWIvc3JjL2xpYi9lbnRpdGllcy9pbnZpdGF0aW9uLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRDs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFXLFNBQVEsVUFBVTtJQUExQzs7UUFDUyxVQUFLLEdBQWtCLElBQUksQ0FBQztRQUM1QixnQkFBVyxHQUFrQixJQUFJLENBQUM7SUFDM0MsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVudGl0eSB9IGZyb20gXCIuL19iYXNlLWVudGl0eS5jbGFzc1wiO1xyXG5cclxuLyoqXHJcbiAqIEFuIGludml0YXRpb24gaG9sZHMgYWxsIHRoZSBuZWVkZWQgaW5mb3JtYXRpb24gdG8gaW52aXRlIGEgdXNlciAhXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSW52aXRhdGlvbiBleHRlbmRzIEJhc2VFbnRpdHkge1xyXG4gIHB1YmxpYyBlbWFpbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgcHVibGljIGRpc3BsYXlOYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxufVxyXG5cclxuIl19