FROM php:7.4-apache-buster

RUN pecl install xdebug-2.9.6 \
    && docker-php-ext-enable xdebug

RUN docker-php-ext-install pdo_mysql

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN a2enmod rewrite
ADD . /var/www/html/project/public