ARG IMAGE_PHP=webdevops/php-apache
ARG IMAGE_PHP_VERSION=7.4

FROM ${IMAGE_PHP}:${IMAGE_PHP_VERSION}

COPY wait-for-it.sh /usr/local/bin/

ENV COMPOSER_HOME=/.composer
ENV NPM_CONFIG_CACHE=/.npm
ENV WEB_DOCUMENT_ROOT=/app/public

ARG USER_ID
ARG GROUP_ID
ARG IMAGE_NODE_VERSION=18.14

RUN groupadd -r -g ${GROUP_ID} appuser || true
RUN useradd -r -u ${USER_ID} -g ${GROUP_ID} appuser || true

# Configure Apache to listen on port 8000
RUN sed -ri -e 's!VirtualHost \*:80!VirtualHost \*:8000!g' /opt/docker/etc/httpd/vhost.conf \
    && echo "Listen 8000" | tee -a /etc/apache2/ports.conf

# Fix deprecated Buster repositories by switching to archive
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
    && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list \
    && sed -i '/buster-updates/d' /etc/apt/sources.list

# Update package lists and install basic tools
RUN apt-get update \
    && apt-get install -y ca-certificates curl gnupg lsb-release

# Add repositories without GPG verification (DEV ONLY) 
RUN sh -c 'echo "deb [arch=amd64 trusted=yes] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && sh -c 'echo "deb [arch=amd64 trusted=yes] https://download.docker.com/linux/debian buster stable" > /etc/apt/sources.list.d/docker.list'

# Update package lists after adding new repositories
RUN apt-get update

# Install Node.js via NVM
RUN mkdir -p /usr/share/man/man1 \
    && mkdir -p /opt/nvm \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | PROFILE=/root/.bashrc NVM_DIR=/opt/nvm NODE_VERSION=${IMAGE_NODE_VERSION} bash \
    && ln -s /opt/nvm/versions/node/v${IMAGE_NODE_VERSION}*/bin/node /usr/bin/node \
    && ln -s /opt/nvm/versions/node/v${IMAGE_NODE_VERSION}*/bin/npm /usr/bin/npm \
    && ln -s /opt/nvm/versions/node/v${IMAGE_NODE_VERSION}*/bin/npx /usr/bin/npx \
    && mkdir -p ${NPM_CONFIG_CACHE}

# Install system packages (with fallbacks for problematic packages)
RUN apt-install default-mysql-client libicu-dev graphviz vim gnupg2 \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb jq \
    && (apt-install google-chrome-stable || echo "Chrome installation failed, continuing...") \
    && (apt-install docker-ce || echo "Docker-ce installation failed, continuing...")

# Configure npm and install global packages
RUN bash -c 'npm i forever -g' \
    && chown -R ${USER_ID}:${GROUP_ID} ${NPM_CONFIG_CACHE}

# Create symlink for psh
RUN ln -s /app/psh.phar /bin/psh

# Install and configure PHP extensions  
RUN pecl install pcov \
    && docker-php-ext-enable pcov \
    && rm -f /usr/local/etc/php/conf.d/00-ioncube.ini \
    && rm -f /usr/local/etc/php/conf.d/apcu.ini \
    && rm -f /usr/local/etc/php/conf.d/vips.ini \
    && rm -f /usr/local/etc/php/conf.d/memcached.ini \
    && rm -f /usr/local/etc/php/conf.d/mongodb.ini \
    && composer self-update --2.2

COPY php-config.ini /usr/local/etc/php/conf.d/99-docker.ini

WORKDIR /app
