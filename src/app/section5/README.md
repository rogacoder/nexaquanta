## Section 5: Production Deployment Fixes

### **5.1 Environment Configuration**

**Problem:** The production build fails with environment-related errors after migration.

    Current structure:
    src/
    environments/
    environment.ts
    environment.prod.ts
    Build Error:
    × Failed to resolve module 'src/environments/environment'
    × Configuration property 'fileReplacements' is deprecated

___

**Answer**

This indicates a failure in the upgrade. A step was missed during upgrade that auto updates the angular.json file.

To resolve the issue and 'fail forward', use the cli tool to re add 'environments' (copying back the contents into the new files - if it created them ) - this will ensure the 'fileReplacements' settings in angular.json is correct.

Even though `fileReplacements` is depreciated, this will still work today.


To fully modernise and remove fileReplacements *( very quick summary... )* - make use of the `meta.env` 
-  change your environment files to follow the naming convention of `.env` and `.env.production` 
- Replace imports to `environments/environment` in your files with `const myProperty = import.meta.env['MY_Property']`

## 5.2 Docker Build Update

**Current Dockerfile (failing after migration):**

    FROM node:16-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    COPY . .
    RUN npm run build --prod
    EXPOSE 4200
    CMD ["npm", "start"]
    Task: Update this Dockerfile to work with Angular v19+ build requirements and optimize for

________

**Answer**

Without seeing your `package.json` *to see what is set for the 'script' command `build`*, it could be something else. but , at a glance from here, the actual environment switch is `--configuration development`
So update the run command on line 7 to 
	`npm run build --configuration development`