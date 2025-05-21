FROM php:8.2-fpm

# instalacion dependencias del sistema
RUN apt-get update && apt-get install -y \
    zip unzip curl libpng-dev libonig-dev libxml2-dev \
    libzip-dev libpq-dev git mariadb-client \
    && docker-php-ext-install pdo pdo_mysql

# Instalacion Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# directorio de trabajo
WORKDIR /var/www

# se copian todos los archivos del proyecto
COPY . .

# Instalacion dependencias de PHP
RUN composer install

# Cambio de permisos permisos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

EXPOSE 9000
CMD php artisan serve --host=0.0.0.0 --port=9000
