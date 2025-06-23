<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table)     {
            $table->id();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');

            $table->string('title');
            $table->string('position');
            $table->string('department')->nullable();
            $table->string('schedule',50);
            $table->boolean('flex_schedule')->default(false);
            $table->string('modality');
            $table->string('contract_type')->nullable();
            $table->string('salary')->nullable();
            $table->date('closing_date');
            $table->date('opening_date');
            $table->integer('vacancies')->default(0);
            $table->text('description')->nullable();
            $table->text('candidate_profile')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
