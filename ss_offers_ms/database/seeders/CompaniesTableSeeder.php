<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            ['name' => 'Google', 'sector' => 'Tecnología', 'email' => 'google@google.com', 'city' => 'California'],
            ['name' => 'Globant', 'sector' => 'Software', 'email' => 'info@globant.com', 'city' => 'Bogotá'],
            ['name' => 'Mercado Libre', 'sector' => 'E-commerce', 'email' => 'contacto@mercadolibre.com', 'city' => 'Buenos Aires'],
            ['name' => 'Bancolombia', 'sector' => 'Banca', 'email' => 'servicio@bancolombia.com', 'city' => 'Medellín'],
            ['name' => 'IBM', 'sector' => 'Tecnología', 'email' => 'contact@ibm.com', 'city' => 'Nueva York'],
            ['name' => 'Samsung', 'sector' => 'Electrónica', 'email' => 'info@samsung.com', 'city' => 'Seúl'],
            ['name' => 'Spotify', 'sector' => 'Entretenimiento', 'email' => 'support@spotify.com', 'city' => 'Estocolmo'],
            ['name' => 'Nubank', 'sector' => 'Finanzas', 'email' => 'contacto@nubank.com', 'city' => 'São Paulo'],
            ['name' => 'Amazon', 'sector' => 'E-commerce', 'email' => 'info@amazon.com', 'city' => 'Seattle'],
            ['name' => 'Tesla', 'sector' => 'Automotriz', 'email' => 'contact@tesla.com', 'city' => 'Austin'],
        ];

        foreach ($companies as $company) {
            DB::table('companies')->updateOrInsert(['email' => $company['email']], $company);
        }
    }
}
