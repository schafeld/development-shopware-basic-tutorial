# Shopware 6 development template

## Deprecated

This [template has been deprecated](https://www.shopware.com/en/news/shopware-goes-symfony-flex/) and replaced by the new [Flex template](https://developer.shopware.com/docs/guides/installation/flex). It will be still updated until 6.5.

This repository is a template for local development and enables you to create a running Shopware 6.4 instance.
Use this setup for developing directly on Shopware 6 or for developing plugins for Shopware 6.

The installation guide, together with the complete documentation, is available at [docs.shopware.com](https://docs.shopware.com/en/shopware-platform-dev-en/getting-started).

The quickstart guide using this development template is located at [shopware/platform](https://github.com/shopware/platform#quickstart--installation)

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

# Check for running containers
docker ps

# Stop containers
./psh.phar docker:stop

# Access container shell
docker-compose exec app_server bash
# or for the tutorial:
./psh.phar docker:ssh

# Leave container shell
exit
```

Your Shopware development environment is ready for plugin development, theme customization, and storefront modifications! All PHP 7.4 compatibility issues have been documented and resolved for future reference.

P.S: The original fork branch was 'trunk'.