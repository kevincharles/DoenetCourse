# FROM php:7.4-fpm-alpine
FROM php:7.4.1-fpm
# COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
# RUN apk update; \
#     apk upgrade;
RUN docker-php-ext-install mysqli

# Use Composer to install PHP-JWT Firebase
RUN  apt-get update -y && \
     apt-get upgrade -y && \
     apt-get dist-upgrade -y && \
     apt-get -y autoremove && \
     apt-get clean
RUN apt-get install -y p7zip \
    p7zip-full \
    unace \
    zip \
    unzip \
    xz-utils \
    sharutils \
    uudeview \
    mpack \
    arj \
    cabextract \
    file-roller \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/apache2/htdocs/api/

#Test for php-jwt
# COPY example.php /var/www/html/example.php

COPY composer.json /composer.json
RUN cd / && composer install


# Link /usr/local/apache2/htdocs/api/vendor to /vendor in dev environment for compatability with prod
RUN ln -s /vendor ./vendor

# RUN composer require firebase/php-jwt
RUN composer require firebase/php-jwt

RUN cd /usr/local/apache2/htdocs/api/ && mkdir test


# CMD mv -r /vendor /usr/local/apache2/htdocs/api/

EXPOSE 9000