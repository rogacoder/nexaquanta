## 2.2 Build Configuration Fix

**Problem:** The application fails to build after migration with this angular.json configuration issue:

    {
	    "projects": {
	    "enterprise-app": {
		    "architect": {
		    "build": {
		    "builder": "@angular-devkit/build-angular:browser",
		    "options": {
		    "outputPath": "dist/enterprise-app",
		    "index": "src/index.html",
		    "main": "src/main.ts",
		    "polyfills": "src/polyfills.ts",
		    "tsConfig": "tsconfig.app.json",
		    "assets": ["src/favicon.ico", "src/assets"],
		    "styles": ["src/styles.scss"],
		    "scripts": ["node_modules/jquery/dist/jquery.min.js"]
				    }
				   }
			   }
		    }
	    }
    }

**Task:** Update this configuration for Angular v19+ and fix any deprecated properties.

___

**Answer**

Encountering this error indicates that the Angular Core and CIi package updates were not done correctly or they failed.

My guess here is that the upgrade was performed without upgrading through each version and was maybe skipped - like updating the package from 16 to 18 rather than 16 > 17 > 18.

To fix the above issue, I would re upgrade, because, *if this file was not updated correctly by the CLI,* I would be very worried what else it may not have resolved. : O

*However, to get this file running... change it to something like this. (** indicates updates )*

    `{
    	    "projects": {
    	    "enterprise-app": {
    		    "architect": {
    		    "build": {
    		    "builder": **"@angular/build:application"**
    		    "options": {
    		    "outputPath": "dist/enterprise-app",
    		    "index": "src/index.html",
    		    "main": "src/main.ts",
    		    "polyfills": **["src/polyfills.ts", "zone.js"]**
    		    "tsConfig": "tsconfig.app.json",
    		    "assets": ["src/favicon.ico", "src/assets"],
    		    **"inlineStyleLanguage": "scss",**
    		    "styles": ["src/styles.scss"],
    		    "scripts": ["node_modules/jquery/dist/jquery.min.js"]
    				    }
    				   }
    			   }
    		    }
    	    }
        }

**Notes:** The file provided in the question does not contain all the configuration.

Depending on the repo, for example, if we are using 'public' for assets, we may need to also add `{ "glob": "**/*", "input": "public" }`

Key part here; *encountering this build error, indicates* something went wrong during the upgrade process, as, the cli would prompt and auto update this file to use `@angular/build:application`