<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Offer;
use Illuminate\Support\Facades\DB;

class OffersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $offers = [
            [
                "published_at" => "2025-05-21 12:50:00",
                "company_id" => 1,
                "title" => "Desarrollador Backend",
                "position" => "Junior",
                "department" => "TI",
                "schedule" => "8am-5pm",
                "flex_schedule" => false,
                "modality" => "Presencial",
                "contract_type" => "Término fijo",
                "salary" => 3000000,
                "closing_date" => "2025-06-30",
                "opening_date" => "2025-05-20",
                "vacancies" => 2,
                "description" => "Desarrollo de APIs REST en Laravel",
                "candidate_profile" => "Estudiante de Ingeniería de Sistemas",
                "notes" => "Conocimiento en MySQL",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-20 10:00:00",
                "company_id" => 2,
                "title" => "Ingeniero de Datos",
                "position" => "Senior",
                "department" => "Análisis",
                "schedule" => "9am-6pm",
                "flex_schedule" => true,
                "modality" => "Remoto",
                "contract_type" => "Indefinido",
                "salary" => 6000000,
                "closing_date" => "2025-07-15",
                "opening_date" => "2025-05-10",
                "vacancies" => 1,
                "description" => "Manejo y procesamiento de grandes volúmenes de datos",
                "candidate_profile" => "Profesional en Ingeniería de Sistemas o afines",
                "notes" => "Experiencia en AWS y Python",
                "program_ids" => [2879, 2546]
            ],
            [
                "published_at" => "2025-05-19 15:30:00",
                "company_id" => 3,
                "title" => "Desarrollador Frontend",
                "position" => "Junior",
                "department" => "Desarrollo",
                "schedule" => "10am-7pm",
                "flex_schedule" => false,
                "modality" => "Presencial",
                "contract_type" => "Contrato",
                "salary" => 2800000,
                "closing_date" => "2025-06-20",
                "opening_date" => "2025-05-01",
                "vacancies" => 3,
                "description" => "Creación de interfaces web responsivas",
                "candidate_profile" => "Estudiante o recién graduado en Ingeniería de Sistemas o afines",
                "notes" => "Conocimiento en React y CSS",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-18 09:00:00",
                "company_id" => 4,
                "title" => "Analista de Seguridad",
                "position" => "Intermedio",
                "department" => "Seguridad",
                "schedule" => "8am-5pm",
                "flex_schedule" => true,
                "modality" => "Remoto",
                "contract_type" => "Indefinido",
                "salary" => 5000000,
                "closing_date" => "2025-07-01",
                "opening_date" => "2025-05-15",
                "vacancies" => 1,
                "description" => "Análisis y monitoreo de vulnerabilidades",
                "candidate_profile" => "Ingeniero con conocimientos en ciberseguridad",
                "notes" => "Certificación CISSP deseable",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-17 14:45:00",
                "company_id" => 5,
                "title" => "Administrador de Bases de Datos",
                "position" => "Senior",
                "department" => "TI",
                "schedule" => "9am-6pm",
                "flex_schedule" => false,
                "modality" => "Presencial",
                "contract_type" => "Término fijo",
                "salary" => 5500000,
                "closing_date" => "2025-07-10",
                "opening_date" => "2025-05-05",
                "vacancies" => 1,
                "description" => "Administración y optimización de bases de datos MySQL y PostgreSQL",
                "candidate_profile" => "Profesional en Ingeniería de Sistemas",
                "notes" => "Experiencia mínima 3 años",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-16 11:30:00",
                "company_id" => 6,
                "title" => "Ingeniero de Software",
                "position" => "Junior",
                "department" => "Desarrollo",
                "schedule" => "8am-5pm",
                "flex_schedule" => true,
                "modality" => "Remoto",
                "contract_type" => "Indefinido",
                "salary" => 3200000,
                "closing_date" => "2025-06-25",
                "opening_date" => "2025-05-15",
                "vacancies" => 2,
                "description" => "Desarrollo de aplicaciones móviles",
                "candidate_profile" => "Estudiante de Ingeniería de Sistemas",
                "notes" => "Conocimiento en Flutter",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-15 13:20:00",
                "company_id" => 7,
                "title" => "Especialista en UX/UI",
                "position" => "Intermedio",
                "department" => "Diseño",
                "schedule" => "10am-7pm",
                "flex_schedule" => false,
                "modality" => "Presencial",
                "contract_type" => "Contrato",
                "salary" => 3500000,
                "closing_date" => "2025-06-30",
                "opening_date" => "2025-05-10",
                "vacancies" => 1,
                "description" => "Diseño de interfaces de usuario",
                "candidate_profile" => "Diseñador gráfico o afines",
                "notes" => "Portafolio requerido",
                "program_ids" => [2879]
            ],
            [
                "published_at" => "2025-05-14 09:15:00",
                "company_id" => 8,
                "title" => "Analista Financiero",
                "position" => "Senior",
                "department" => "Finanzas",
                "schedule" => "8am-5pm",
                "flex_schedule" => true,
                "modality" => "Remoto",
                "contract_type" => "Indefinido",
                "salary" => 4500000,
                "closing_date" => "2025-07-20",
                "opening_date" => "2025-05-01",
                "vacancies" => 1,
                "description" => "Análisis financiero y reporte",
                "candidate_profile" => "Profesional en finanzas o economía",
                "notes" => "Experiencia en banca",
                "program_ids" => [2546]
            ],
            [
                "published_at" => "2025-05-13 16:40:00",
                "company_id" => 9,
                "title" => "Gerente de Proyecto",
                "position" => "Senior",
                "department" => "Gestión",
                "schedule" => "9am-6pm",
                "flex_schedule" => false,
                "modality" => "Presencial",
                "contract_type" => "Indefinido",
                "salary" => 7000000,
                "closing_date" => "2025-08-01",
                "opening_date" => "2025-05-05",
                "vacancies" => 1,
                "description" => "Gestión de proyectos TI",
                "candidate_profile" => "Experiencia mínima 5 años",
                "notes" => "Certificación PMP deseable",
                "program_ids" => [2879, 2546]
            ],
            [
                "published_at" => "2025-05-12 08:00:00",
                "company_id" => 10,
                "title" => "Ingeniero de Calidad",
                "position" => "Junior",
                "department" => "Calidad",
                "schedule" => "8am-5pm",
                "flex_schedule" => true,
                "modality" => "Remoto",
                "contract_type" => "Contrato",
                "salary" => 3000000,
                "closing_date" => "2025-06-15",
                "opening_date" => "2025-05-10",
                "vacancies" => 2,
                "description" => "Control de calidad en procesos productivos",
                "candidate_profile" => "Estudiante de Ingeniería Industrial",
                "notes" => "Conocimiento en ISO 9001",
                "program_ids" => [2546]
            ],
        ];


        foreach ($offers as $offerData) {
            $programIds = $offerData['program_ids'];
            unset($offerData['program_ids']);

            $offer = Offer::updateOrCreate(
                ['title' => $offerData['title'], 'company_id' => $offerData['company_id']],
                $offerData
            );

            $offer->programs()->sync($programIds);
        }
    }
}
