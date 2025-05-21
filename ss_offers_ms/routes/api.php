<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProgramController;

Route::get('/offers', [OfferController::class, 'index']); // Obtener todas las ofertas fun
Route::get('/offers/{id}', [OfferController::class, 'show']); // Obtener una oferta por ID fun
Route::post('/offers', [OfferController::class, 'store']); // Crear una oferta fun
Route::put('/offers/{id}', [OfferController::class,'update']);//actualizar oferta fun
Route::delete('/offers/{id}',[OfferController::class,'destroy']);//borrar oferta fun


Route::get('/companies', [CompanyController::class, 'index']); // Obtener todas las empresas fu n
Route::get('/companies/{id}', [CompanyController::class, 'show']); // Obtener empresa por ID fun
Route::post('/companies', [CompanyController::class, 'store']); // Crear empresa fun

Route::get('/programs', [ProgramController::class, 'index']);//Obtener programas fun

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
