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

# For development
# building new template like described in tutorial throws warnings and errors:
./psh.phar storefront:dev 
# use this command instead to use a fix for Node version incompatibility:
docker-compose exec app_server bash -c "cd /app && NODE_OPTIONS='--openssl-legacy-provider' ./psh.phar storefront:dev"

# Maybe refresh cache in Docker container
./psh.phar docker:ssh 
php bin/console cache:clear
```

Your Shopware development environment is ready for plugin development, theme customization, and storefront modifications! All PHP 7.4 compatibility issues have been documented and resolved for future reference.

### Developer Tips

If the contained submodule in folder `/shopware/platform`are not being searched in VS Code then the submodule may need to be initialized and updated:

```bash
git submodule update --init --recursive
```

You'll want to have that sub-module searchable in order to find the Twig-templates that you need to override for frontend customization.

## Branches

The original fork branch was `trunk`.

Branch `tutorial-template-basic-training` is for [Shopware Online Academy Course "Shopware 6 - Template Training Basic (EN)"](https://academy.shopware.com/courses/take/shopware-6-template-training-english)

Branch `tutorial-clean-boilerplate` is the starter branch for new development. It contains only the changes necessary to get the original fork running plus documentation.