## 4.2 Performance Issue Investigation

**Scenario: After migration, the application loads slowly. Chrome DevTools shows:**

    Performance Issues:
    - Bundle size increased from 2.1MB to 3.8MB
    - First Contentful Paint: 4.2s (was 2.1s)
    - Angular-specific warnings:
    * 15 components not using OnPush change detection
    * Large bundle chunk: vendor.js (2.1MB)
    * Unused imports detected in 23 modules

**Task:** Write specific code changes and configuration updates to resolve these performance issues.

______

**Answers** (each of the errors addressed in the order given above )

## **Bundle size increased from 2.1MB to 3.8MB**

"After Migration".  - I would like to know how 'migration' is defined more.
If "migration" has involved refactoring (eg. Changing components to Standalone ) this could have introduced a larger bundle size if these new 'standalone' components still being imported for use in, say, one other component and are not making use of, for example `'inject'.` for external class instantiation. 

**1. If have moved components to standalone.,**

For example, before 'migration',  they may have all been imported into 'app.module'. 

Changing them to standalone, but then not using them as 'standalone' and importing them all into, say,  `app.component` is not going to create any benefits - to the bundle size, this is effectively the same... or worse.

*Some Reasons*

- Standalone components require direct dependancy imports to run 'standalone'
- Standalone components are best to benefit from using `inject` for external class instantiation 

**2. Check that the angular.json file has the following, ( or is omitted)**

     "production": {
        "optimization": true,
... 
        }

Opt into `treeshaking` and other optimisations 

**3. Review the current Module Setup** 

Was the application all bundled via one 'app-module' before? Can it benefit from any 'lazy loading' via routes?

4. Check Package.json
After migration has the `package.json` file and the source code for the application been reviewed to remove any unwanted/unused packages. Typically, after a while, packages can remain unused and the tech debt is left. During the upgrade is a good time to review and remove.

5. Important: Install and run the latest linting tools to identify and remove all unused imports - add this step also the the CI for build failures and keeping the source code clean going forward, 

## First Contentful Paint: 4.2s (was 2.1s)

Hard to guess why here without seeing it.
I mentioned earlier about converting to standalone components and then 'importing' them all directly into one app.component... .. this could add to a delayed print time.

*Other possible reasons..*

- The upgrade has exposed issues in the existing code base like 'render blocking' calls in services.
- The angular.json is not set for an optimised build
- Using legacy/outdated packages
- Broken lazy loading route modules (if refactors have been done)
- Bundle size will contribute to this time being larger - nothing prints until the bundle has downloaded.
- Changes to the server ( gzip, cdn... )
- 

## - Angular-specific warnings:

   **15 components not using OnPush change detection**
   - unless specifically set in a component  class decorator `ChangeDetectionStrategy.OnPush`  a component uses the default change detection strategy. I cant advise here to apply this to all the components as some may make use of other change detection - eg `ngOnChanges` for operations.  
   - This would need to be taken on a case by case basis. 
   For the modern way, components that use signals and input signals for change detection can set `ChangeDetectionStrategy.OnPush` just fine to supress the warning and be fully optimised.

   Large bundle chunk: vendor.js (2.1MB)
    - refer to the earlier comments for 'Bundle size increased from 2.1MB to 3.8MB' - in addition, check if any new polyfils have been added and review if required. 
    - 
   Unused imports detected in 23 modules 
   - **this issue should never make its way into release/ production or the main branch** and indicates the repository is missing it's 'lint'/'es-lint' setup. This tooling is essential for any typescript repository and also essential during any upgrade work to safeguard against hidden errors that may occur when upgrading the language (typescript)

running 'lint' clears all these up automatically....
 
