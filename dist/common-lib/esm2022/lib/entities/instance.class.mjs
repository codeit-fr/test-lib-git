import { BaseEntity } from "./_base-entity.class";
/**
 * A Company holds all its Users + its general information
 */
export class Instance extends BaseEntity {
    constructor() {
        super(...arguments);
        this.users = [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21tb24tbGliL3NyYy9saWIvZW50aXRpZXMvaW5zdGFuY2UuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBSWxEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFFBQVksU0FBUSxVQUFVO0lBQTNDOztRQUVXLFVBQUssR0FBUyxFQUFFLENBQUM7SUFFNUIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUVudGl0eSB9IGZyb20gXCIuL19iYXNlLWVudGl0eS5jbGFzc1wiO1xyXG5pbXBvcnQgeyBBcHBVc2VyIH0gZnJvbSBcIi4vYXBwLXVzZXIuY2xhc3NcIjtcclxuXHJcblxyXG4vKipcclxuICogQSBDb21wYW55IGhvbGRzIGFsbCBpdHMgVXNlcnMgKyBpdHMgZ2VuZXJhbCBpbmZvcm1hdGlvblxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlPFQ+IGV4dGVuZHMgQmFzZUVudGl0eSB7XHJcbiAgICBwdWJsaWMgbmFtZSE6IHN0cmluZztcclxuICAgIHB1YmxpYyB1c2Vycz86IFRbXSA9IFtdO1xyXG4gICAgcHVibGljIGNyZWF0aW9uUHJvY2Vzcz86IGJvb2xlYW47XHJcbn1cclxuXHJcbiJdfQ==