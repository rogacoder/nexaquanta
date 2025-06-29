## Section 4: Real-World Debugging

### 4.1 Runtime Error Resolution

**Problem: After migration, users report this console error:**

    ERROR Error: NG0303: Can't bind to 'ngModel' since it isn't a known property of
    'input'.
    at ReactiveFormsModule.ɵmod.declarations (main.js:1234)
    ERROR Error: NG0912: Component 'UserFormComponent' is not standalone but is being
    used in a standalone context.

**Task:**
1. Explain the root cause
2. Provide the exact code fix
3. Prevent similar issues in the future

___
**Answer**

1. If this component has been set to be standalone, *`standalone: true` in the component class decorator,* it will need to import the `formsModule` into the `inputs` array. 
2. 

    
    import { FormsModule } from  '@angular/forms';
    ...
    @Component({
	    standalone: true, 
	    imports:  [FormsModule], 
	    ...
    }) 
3. Changing a component from a module architecture to a standalone architecture is a refactor task. Upgrading Angular will not convert to standalone components and each component, having its own bespoke dependancies, will need to refactored specifically for its purpose.

To make upgrades and maintenance easier and 'preventing issues like this in the future'  we can ensure components are 'dumb' and isolated in either pattern (module or standalone). 

*For example, a common setup would be;* 
- a series of dumb UX 'scaffold' components could use the module architecture and 
- 'container/smart' (feature) components are using the standalone pattern.