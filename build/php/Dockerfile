FROM php:7.4-apache-buster

RUN docker-php-ext-install pdo_mysql

RUN a2enmod rewrite
ADD . /var/www/html/project/public