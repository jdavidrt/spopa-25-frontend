FROM php:8.2-fpm

# Instalacion dependencias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git mariadb-client \
        zip unzip curl \
        libpng-dev libonig-dev libxml2-dev \
        libzip-dev libpq-dev \
#extensiones php
    &&  docker-php-ext-install sockets pdo \
        pdo_mysql zip bcmath \
#limpiar cache
    && rm -rf /var/lib/apt/Lists/*

# Instalacion Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www

# Copia archivos del proyecto
COPY . .

# Instala dependencias de PHP (Laravel)
RUN composer install

# Permisos correctos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

EXPOSE 8010
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8010"]
