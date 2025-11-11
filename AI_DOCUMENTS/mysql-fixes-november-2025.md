# MySQL Container Fixes Documentation - November 2025

## Problem Summary

After fixing the initial Dockerfile issues, the MySQL container was failing to start and causing database connection errors:

```
ERROR 2005 (HY000): Unknown MySQL server host 'mysql' (-2)
```

## Root Causes Identified

### 1. Deprecated MySQL Configuration Option

**Error:**
```
unknown variable 'default_authentication_plugin=mysql_native_password'
```

**Cause:** MySQL 8.4+ removed the `default_authentication_plugin` configuration option entirely.

### 2. Authentication Plugin Not Available

**Error:**
```
ERROR 1524 (HY000) at line 2: Plugin 'mysql_native_password' is not loaded
```

**Cause:** The `mysql_native_password` plugin was completely removed in MySQL 8.4+, but the initialization script was still trying to use it.

### 3. Corrupted MySQL Data Directory

**Error:**
```
Table 'mysql.user' doesn't exist
Could not open the mysql.plugin table. Please perform the MySQL upgrade procedure.
```

**Cause:** The MySQL data directory contained incompatible data from previous runs or different MySQL versions.

## Solutions Applied

### 1. Fixed MySQL Configuration File (`dev.cnf`)

**Before:**
```ini
default_authentication_plugin=mysql_native_password
```

**After:**
```ini
# default_authentication_plugin was removed in MySQL 8.4+
# Use mysql_native_password authentication via SQL commands instead
# See: https://dev.mysql.com/doc/refman/8.4/en/upgrading-from-previous-series.html
```

**Rationale:** Removed the deprecated configuration option and added explanatory comments.

### 2. Updated User Creation Script (`grant.sql`)

**Before:**
```sql
GRANT ALL ON *.* TO 'app'@'%';
```

**Then (first attempt):**
```sql
-- Create user with native password authentication for MySQL 8.4+ compatibility
CREATE USER IF NOT EXISTS 'app'@'%' IDENTIFIED WITH mysql_native_password BY 'app';
GRANT ALL ON *.* TO 'app'@'%';
FLUSH PRIVILEGES;
```

**Final (working solution):**
```sql
-- Create user with default authentication for MySQL 8.4+ compatibility
-- mysql_native_password plugin was removed in MySQL 8.4+, using default caching_sha2_password
CREATE USER IF NOT EXISTS 'app'@'%' IDENTIFIED BY 'app';
GRANT ALL ON *.* TO 'app'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

**Rationale:** 
- MySQL 8.4+ uses `caching_sha2_password` as the default authentication method
- Added explicit user creation with proper permissions
- Added `WITH GRANT OPTION` for administrative capabilities
- Used `FLUSH PRIVILEGES` to ensure changes take effect immediately

### 3. Container Restart and Data Cleanup

**Commands used:**
```bash
# Remove corrupted container
docker-compose rm -f app_mysql

# Start fresh container (this creates new data directory)
docker-compose up -d app_mysql
```

**Benefits:**
- Fresh MySQL data directory initialization
- Clean system tables creation
- Proper user account setup with new authentication method

## MySQL 8.4+ Authentication Changes

### Key Changes in MySQL 8.4:

1. **Removed Plugins:**
   - `mysql_native_password` plugin completely removed
   - `sha256_password` plugin also deprecated

2. **Default Authentication:**
   - `caching_sha2_password` is now the only supported authentication method for new users
   - More secure but requires updated client libraries

3. **Configuration Impact:**
   - `default_authentication_plugin` option removed from server configuration
   - Authentication method must be specified at user creation time or defaults to `caching_sha2_password`

### Compatibility Considerations:

- **PHP Applications:** Ensure PHP MySQL extensions support `caching_sha2_password`
- **Client Libraries:** Update to versions that support the new authentication method
- **Legacy Applications:** May need client-side updates if they relied on `mysql_native_password`

## Current Status

✅ **MySQL Container:** Running successfully on port 4406  
✅ **Database User:** `app` user created with `caching_sha2_password` authentication  
✅ **Network Connectivity:** Container accessible via hostname `mysql` from other containers  
✅ **Data Persistence:** Fresh data directory created at `dev-ops/docker/_volumes/mysql/`  

## Testing Database Connection

You can now test the database setup:

```bash
# SSH into the app container
./psh.phar docker:ssh

# Test MySQL connection
mysql -u 'app' -p'app' -h 'mysql' --port='3306' -e "SELECT VERSION();"

# Run Shopware installation
./psh.phar install
```

## Files Modified

1. **`/dev-ops/docker/containers/mysql/dev.cnf`**
   - Removed deprecated `default_authentication_plugin` option
   - Added explanatory comments

2. **`/dev-ops/docker/containers/mysql/grant.sql`**
   - Updated user creation to use default `caching_sha2_password` authentication
   - Added proper user permissions with `WITH GRANT OPTION`
   - Added `FLUSH PRIVILEGES` command

## Future Considerations

1. **MySQL Version Pinning:** Consider pinning to a specific MySQL 8.x version in the Dockerfile to avoid future breaking changes
2. **Authentication Method:** Document the authentication method change for other developers
3. **Client Compatibility:** Ensure all tools and applications support `caching_sha2_password`
4. **SSL/TLS:** Consider enabling SSL for database connections in production environments

---

**Date:** November 11, 2025  
**Fixed by:** GitHub Copilot  
**Context:** Shopware development environment MySQL 8.4+ compatibility