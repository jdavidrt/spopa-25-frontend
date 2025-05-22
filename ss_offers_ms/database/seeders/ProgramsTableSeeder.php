<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgramsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            ['id' => 2547, 'name' => 'Ingeniería Mecánica', 'coordinator' => 'Carlos Alberto Narvaez Tovar', 'email' => 'coocurim_bog@unal.edu.co'],
            ['id' => 2549, 'name' => 'Ingeniería Química', 'coordinator' => 'Néstor Yesid Rojas Roa', 'email' => 'coocuriq_fibog@unal.edu.co'],
            ['id' => 2548, 'name' => 'Ingeniería Mecatrónica', 'coordinator' => 'Luis Miguel Méndez Moreno', 'email' => 'coocurim_bog@unal.edu.co'],
            ['id' => 2545, 'name' => 'Ingeniería Electrónica', 'coordinator' => 'Pablo Enrique Rodriguez Espinosa', 'email' => 'celectron_fibog@unal.edu.co'],
            ['id' => 2546, 'name' => 'Ingeniería Industrial', 'coordinator' => 'Hugo Alberto Herrera Fonseca', 'email' => 'coocuri_fibog@unal.edu.co'],
            ['id' => 2544, 'name' => 'Ingeniería Eléctrica', 'coordinator' => 'Hernando Díaz Morales', 'email' => 'coocurie_fibog@unal.edu.co'],
            ['id' => 2879, 'name' => 'Ingeniería de Sistemas y Computación', 'coordinator' => 'Germán Jairo Hernández Pérez', 'email' => 'coocuris_fibog@unal.edu.co'],
            ['id' => 2542, 'name' => 'Ingeniería Civil', 'coordinator' => 'William Castro Garcia', 'email' => 'coocuric_fibog@unal.edu.co'],
            ['id' => 2541, 'name' => 'Ingeniería Agrícola', 'coordinator' => 'Christian José Mendoza Castiblanco', 'email' => 'cooacade_fiabog@unal.edu.co'],
        ];

        foreach ($programs as $program) {
            DB::table('programs')->updateOrInsert(['id' => $program['id']], $program);
        }
    }
}
