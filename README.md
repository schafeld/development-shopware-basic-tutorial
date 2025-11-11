# Shopware 6 development template

## Deprecated

This [template has been deprecated](https://www.shopware.com/en/news/shopware-goes-symfony-flex/) and replaced by the new [Flex template](https://developer.shopware.com/docs/guides/installation/flex). It will be still updated until 6.5.

This repository is a template for local development and enables you to create a running Shopware 6 instance.
Use this setup for developing directly on Shopware 6 or for developing plugins for Shopware 6.

The installation guide, together with the complete documentation, is available at [docs.shopware.com](https://docs.shopware.com/en/shopware-platform-dev-en/getting-started).

The quickstart guide using this development template is located at [shopware/platform](https://github.com/shopware/platform#quickstart--installation)


Ran terminal command: docker-compose exec app_server bash -c "cd /app && ./psh.phar install"

Great! The installation is getting much further now. The PHP compatibility issues have been resolved and we successfully:

✅ **Completed Database Setup**
✅ **Completed Migration (557/557)**
✅ **Completed Entity Indexing** 
✅ **Completed Shopware System Installation**
✅ **Generated Demo Data**
✅ **Completed Data Refresh Indexing**

The only remaining issue is a **Node.js version compatibility problem** during the administration build phase. The error shows:

1. **Node.js Version Mismatch**: Using Node.js v18.14.2, but Shopware expects `^16.0.0`
2. **OpenSSL Error**: `ERR_OSSL_EVP_UNSUPPORTED` - this is a known issue with Node.js 18+ and older webpack versions

Let me fix this by setting the Node.js legacy OpenSSL provider: 

Ran terminal command: docker-compose exec app_server bash -c "cd /app && NODE_OPTIONS='--openssl-legacy-provider' ./psh.phar install"

🎉 **INSTALLATION COMPLETED SUCCESSFULLY!** 

Excellent! The Shopware installation has completed successfully. All 46 steps executed without errors. Let me verify that everything is working by testing the application: 

Ran terminal command: curl -s -o /dev/null -w "%{http_code}" http://localhost:8000

Let me check the logs to see what's causing the 500 error: 

Ran terminal command: docker-compose exec app_server tail -n 20 /var/log/apache2/error.log

Let me check if there are any PHP errors by looking at the Shopware logs: 

Ran terminal command: docker-compose exec app_server ls -la /app/var/log/

Ran terminal command: docker-compose exec app_server tail -n 30 /app/var/log/dev.log

I found the issue! There's a PHP syntax error in `/app/vendor/enqueue/dsn/Dsn.php` at line 70. This is another PHP 7.4 compatibility issue. Let me fix it: 

Ran terminal command: docker-compose exec app_server sed -n '65,75p' /app/vendor/enqueue/dsn/Dsn.php

I can see the issue. This looks like PHP 8.0+ constructor property promotion syntax which is not supported in PHP 7.4. Let me check the entire constructor: 

Ran terminal command: docker-compose exec app_server grep -A 20 -B 5 "__construct" /app/vendor/enqueue/dsn/Dsn.php

I found the issue! There's a trailing comma after the last parameter `array $query,` which is PHP 8.0+ syntax. Let me fix this: 

Ran terminal command: docker-compose exec app_server sed -i 's/array $query,/array $query/' /app/vendor/enqueue/dsn/Dsn.php

Ran terminal command: docker-compose exec app_server php -l /app/vendor/enqueue/dsn/Dsn.php

Perfect! Now let's test the application again: 

Ran terminal command: curl -s -o /dev/null -w "%{http_code}" http://localhost:8000

🎉 **SUCCESS! The Shopware Application is Now Working!** 

Let me verify by accessing it properly and opening it in the browser: 

Opened Simple Browser at http://localhost:8000

Perfect! Let me also check the admin interface: 

Opened Simple Browser at http://localhost:8000/admin

Excellent! Let me update the documentation with all the fixes we implemented: 

Using "Replace String in File"

Let me read the existing file first to see its content: 

Read [](file:///Users/oliverschafeld/workspace/shopware-experiments/development-shopware-basic-tutorial/AI_DOCUMENTS/php74-compatibility-fixes-november-2025.md#1-1), lines 1 to 50

Now I can append to the existing file: 

Using "Replace String in File"


```

```
## ⚠ Shopware Development Environment for local development only

**This Shopware 6.4.20.2 development environment has several downgrades and adaptations to be still working in November 2025. Changes made with AI – no security audit was made!**

### ✅ What Was Accomplished

1. **Fixed Docker Container Issues**
   - Updated deprecated Debian Buster repositories 
   - Resolved MySQL authentication compatibility (8.0 with native password)
   - Built functioning multi-container environment

2. **Resolved PHP 7.4 Compatibility Issues**
   - Fixed dynamic `::class` usage in multiple enqueue packages
   - Removed PHP 8.0+ trailing comma syntax  
   - Applied Node.js legacy OpenSSL provider for webpack builds

3. **Completed Full Shopware Installation**
   - Database migration (557 migrations)
   - Entity indexing and demo data generation
   - Theme compilation and asset installation
   - Administration and Storefront builds

### 🌐 Access To Shopware Store

- **Storefront:** http://localhost:8000 
- **Admin Panel:** http://localhost:8000/admin
- **Database (Adminer):** http://localhost:8001
- **Mail Catcher:** http://localhost:8002

### 📋 Login Credentials
- **Username:** admin
- **Password:** shopware (default from installation)

### 🛠️ Development Commands

```bash
# Start the development environment
./psh.phar docker:start

# Install/reinstall Shopware
./psh.phar install

# Stop containers
./psh.phar docker:stop

# Access container shell
docker-compose exec app_server bash
```

Your Shopware development environment is ready for plugin development, theme customization, and storefront modifications! All PHP 7.4 compatibility issues have been documented and resolved for future reference.