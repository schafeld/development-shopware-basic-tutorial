# Agentic Coding Guidelines for Shopware Development

**Purpose:** This document provides best practices and operational guidelines for AI agents working on this Shopware 6 development project.

## Project Context

This is a **Shopware 6.4.20.2 development environment** running in Docker containers with several compatibility fixes for PHP 7.4 and modern tooling (November 2025). See related documentation:

- [Dockerfile Fixes](./dockerfile-fixes-november-2025.md)
- [MySQL Fixes](./mysql-fixes-november-2025.md)
- [PHP 7.4 Compatibility Fixes](./php74-compatibility-fixes-november-2025.md)

## Critical Rules

### 1. ALWAYS Run Console Commands Inside Docker Container

❌ **WRONG:**

```bash
bin/console cache:clear
bin/console theme:compile
```

✅ **CORRECT:**

```bash
docker-compose exec -T app_server bin/console cache:clear
docker-compose exec -T app_server bin/console theme:compile
```

**Reason:** The database, PHP environment, and all dependencies are inside the Docker container. Running commands on the host machine will fail with connection errors.

### 2. Docker Container Reference

- **Main Application:** `app_server` (PHP-FPM, Shopware)
- **Database:** `app_mysql` (MySQL 8.0)
- **Web Server:** `app_nginx` (Nginx)
- **Mail:** `app_mailcatcher` (MailCatcher)
- **Database Admin:** `app_adminer` (Adminer)

### 3. Common Command Patterns

#### Cache Operations

```bash
# Clear cache
docker-compose exec -T app_server bin/console cache:clear

# Warm up cache
docker-compose exec -T app_server bin/console cache:warmup
```

#### Theme Development

```bash
# Compile theme (required after SCSS/JS changes)
docker-compose exec -T app_server bin/console theme:compile

# Refresh theme
docker-compose exec -T app_server bin/console theme:refresh

# Dump theme configuration
docker-compose exec -T app_server bin/console theme:dump
```

#### Plugin Development

```bash
# Refresh plugin list
docker-compose exec -T app_server bin/console plugin:refresh

# Install plugin
docker-compose exec -T app_server bin/console plugin:install --activate PluginName

# Uninstall plugin
docker-compose exec -T app_server bin/console plugin:uninstall PluginName

# Update plugin
docker-compose exec -T app_server bin/console plugin:update PluginName
```

#### Asset Building

```bash
# Build Storefront (JavaScript/SCSS)
docker-compose exec -T app_server bin/build-storefront.sh

# Build Administration
docker-compose exec -T app_server bin/build-administration.sh

# Watch mode for development (runs in background)
docker-compose exec -T app_server bin/watch-storefront.sh
```

#### Database Operations

```bash
# Run migrations
docker-compose exec -T app_server bin/console database:migrate --all

# Create migration
docker-compose exec -T app_server bin/console database:create-migration
```

### 4. File Linting - MANDATORY Before Committing

According to `shopware/AGENTS.md`, **all code must be linted**:

| File Type              | Check Command                                                      | Fix Command                                                          |
|------------------------|--------------------------------------------------------------------|----------------------------------------------------------------------|
| **PHP** (.php)         | `docker-compose exec -T app_server composer ecs`                   | `docker-compose exec -T app_server composer ecs-fix`                 |
| **PHP** (types)        | `docker-compose exec -T app_server composer phpstan`               | N/A - must fix manually                                              |
| **JS/TS/Vue** (Admin)  | `docker-compose exec -T app_server composer eslint:admin`          | `docker-compose exec -T app_server composer eslint:admin:fix`        |
| **JS/TS** (Storefront) | `docker-compose exec -T app_server composer eslint:storefront`     | `docker-compose exec -T app_server composer eslint:storefront:fix`   |
| **SCSS**               | `docker-compose exec -T app_server composer stylelint`             | `docker-compose exec -T app_server composer stylelint:admin:fix`     |
| **Twig** (Storefront)  | `docker-compose exec -T app_server composer ludtwig:storefront`    | `docker-compose exec -T app_server composer ludtwig:storefront:fix`  |

### 5. Project Structure Awareness

```text
development-shopware-basic-tutorial/
├── shopware/                    # Shopware core (submodule - DO NOT MODIFY)
├── custom/
│   ├── plugins/                # Custom plugins go here
│   └── apps/                   # Apps go here
├── config/                     # Configuration files
├── public/                     # Web root
│   └── theme/                  # Compiled theme assets
├── var/                        # Cache, logs
└── AI_DOCUMENTS/              # AI/Agent documentation
```

**Important:**

- **Never modify** files in `shopware/` (it's a git submodule)
- Custom code belongs in `custom/plugins/` or `custom/apps/`
- Compiled assets go to `public/theme/{hash}/`

### 6. Shopware Architecture Reminders

From `shopware/AGENTS.md`:

- **NO Doctrine ORM** - Use Shopware's Data Abstraction Layer (DAL)
- **NO QueryBuilder** - Use `Criteria` API
- **Prefer Events** over Decorators for extensibility
- **Three APIs:** Admin API, Store API, Sync API

### 7. Development Workflow

#### Plugin Development Cycle

1. Create plugin structure in `custom/plugins/YourPlugin/`
2. Refresh plugin list: `docker-compose exec -T app_server bin/console plugin:refresh`
3. Install/activate: `docker-compose exec -T app_server bin/console plugin:install --activate YourPlugin`
4. Make changes to PHP/Twig/JS/SCSS
5. Clear cache: `docker-compose exec -T app_server bin/console cache:clear`
6. If JS/SCSS changed: Build assets and compile theme
7. Lint your code before committing
8. Test in browser

#### Theme Development Cycle

1. Modify SCSS/JS in `custom/plugins/YourTheme/src/Resources/app/storefront/src/`
2. Build storefront: `docker-compose exec -T app_server bin/build-storefront.sh`
3. Compile theme: `docker-compose exec -T app_server bin/console theme:compile`
4. Clear cache: `docker-compose exec -T app_server bin/console cache:clear`
5. Refresh browser (hard reload: Cmd+Shift+R)

### 8. Environment Access

- **Storefront:** <http://localhost:8000>
- **Admin Panel:** <http://localhost:8000/admin> (admin/shopware)
- **Database Admin:** <http://localhost:8001> (Adminer)
- **Mail Catcher:** <http://localhost:8002>

**⚠️ Use `localhost`, not `127.0.0.1`** - Sales channel is configured for `localhost:8000`.

### 9. Debugging Tips

#### Check Container Status

```bash
docker-compose ps
```

#### View Container Logs

```bash
docker-compose logs app_server
docker-compose logs app_mysql
docker-compose logs -f app_server  # Follow logs
```

#### Access Container Shell

```bash
docker-compose exec app_server bash
# or
./psh.phar docker:ssh
```

#### Check PHP Errors

```bash
docker-compose exec -T app_server tail -f /var/www/html/var/log/dev.log
```

### 10. Error Recovery

#### Database Connection Issues

- Ensure containers are running: `docker-compose ps`
- Restart containers: `docker-compose restart`
- Check MySQL logs: `docker-compose logs app_mysql`

#### Theme/Asset Issues

```bash
# Full rebuild pipeline
docker-compose exec -T app_server bin/console cache:clear
docker-compose exec -T app_server bin/build-storefront.sh
docker-compose exec -T app_server bin/console theme:compile
docker-compose exec -T app_server bin/console cache:clear
```

#### Plugin Issues

```bash
# Reinstall plugin
docker-compose exec -T app_server bin/console plugin:uninstall PluginName
docker-compose exec -T app_server bin/console plugin:install --activate PluginName
docker-compose exec -T app_server bin/console cache:clear
```

## Quick Reference Card

```bash
# Start environment
docker-compose up -d

# Run console command
docker-compose exec -T app_server bin/console <command>

# Build storefront assets
docker-compose exec -T app_server bin/build-storefront.sh

# Compile theme
docker-compose exec -T app_server bin/console theme:compile

# Clear cache
docker-compose exec -T app_server bin/console cache:clear

# Lint PHP
docker-compose exec -T app_server composer ecs-fix

# Access shell
docker-compose exec app_server bash

# Stop environment
docker-compose stop
```

## AI Agent Best Practices

1. **Before suggesting any `bin/console` command:** Prepend with `docker-compose exec -T app_server`
2. **After file changes:** Always clear cache and rebuild if needed
3. **Check errors:** Use `get_errors` tool and container logs
4. **Lint before completion:** Run appropriate linters for modified files
5. **Document context:** Update this file if you discover new patterns
6. **Test thoroughly:** Verify changes in browser at <http://localhost:8000>

---

**Last Updated:** November 2025  
**Shopware Version:** 6.4.20.2  
**PHP Version:** 7.4  
**Container Runtime:** Docker Compose

