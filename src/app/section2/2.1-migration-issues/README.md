## 2.1 Angular CLI Migration Errors

**Scenario:** During ng update, you encounter these errors:

> × Migration failed: Could not resolve dependency tree

    npm ERR! peer dep missing: @angular/core@^15.0.0, required by @company/ui-
    components@2.1.0
    
    npm ERR! peer dep missing: rxjs@^7.5.0, required by ngx-charts@20.1.0
    × Package "@angular/material" has an incompatible peer dependency to "@angular/cdk"
    (requires "^15.0.0", would install "^19.0.0")
    × TypeScript compilation errors:
    src/app/shared/validators.ts(15,23): error TS2345: Argument of type
    'AbstractControl<any, any>' is not assignable to parameter of type
    'AbstractControl<any>'

**Task:**
1. Write the exact npm/ng commands to resolve these dependency conflicts
2. Provide the corrected TypeScript code for the validator error
3. Create a step-by-step resolution plan

___

**Answer**

This above issue indicates an upgrade process that is not tailored to this repository, and would be considered a "failed" upgrade.

*it is quicker to re-perform the upgrade (inc 3rd party packages) again than to troubleshoot issues package by package and get stuck in the 'weeds'* 

While it is possible to follow the upgrade steps from such websites like https://angular.dev/update-guide, these websites and suggestions are unable to review the bespoke setups and 3rd party packages.

****Upgrading through Angular Versions and avoiding npm package dep conflicts ... painlessly****

I recently upgraded over 14 repos from v15-19 (YouLend) with a mixture of 3rd party libraries and are all running in production today.

Each repository upgrade flow requires its own strategy. 
The strategy can't be found in online guides or asking AI ( because it does not know the goal or the repositories dependancy tree )

**The General Plan/Approach**
Typically for an upgrade,  it would involve a mixture of `ng update <package> -force` for key packages ( cli, core ) through every version of Angular and running with `legacy-peer-deps=true` in `.npmrc` until stable at the final version of Angular.

Once upgraded, and on the required/latest version of npm,  it is now ready to upgrade the individual 3rd party packages.

Finally, once all packages are up to date, an `npm audit` is performed for security and we can remove the `legacy-peer-deps=true` setting in `.npmrc`

