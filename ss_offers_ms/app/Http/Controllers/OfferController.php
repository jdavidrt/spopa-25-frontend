<?php

namespace App\Http\Controllers;

use finfo;
use Illuminate\Http\Request;
use App\Models\Offer;
use App\Services\RabbitProducerService;

class OfferController extends Controller
{
    //
    public function index()
    {
        return Offer::with(['company', 'programs'])->get();
    }

    public function show($id)
    {
        return Offer::with(['company', 'programs'])->findOrFail($id);
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }
    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $validated = $request->validate([
            'published_at' => 'nullable|date',
            'company_id' => 'required|exists:companies,id',

            'title' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'schedule' => 'required|string|max:50',
            'flex_schedule' => 'boolean',
            'modality' => 'required|string|max:255',
            'contract_type' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',

            'closing_date' => 'required|date|after_or_equal:opening_date',
            'opening_date' => 'required|date|before_or_equal:closing_date',
            'vacancies' => 'required|integer|min:0',

            'description' => 'nullable|string',
            'candidate_profile' => 'nullable|string',
            'notes' => 'nullable|string',
            'program_ids' => 'array',
            'program_ids.*' => 'exists:programs,id',
        ]);

        $offer->update($validated);

        if ($request->has('program_ids')) {
            $offer->programs()->sync($request->program_ids); //
        }
        

        return response()->json($offer);
    }

    public function store(Request $request, RabbitProducerService $producer)
    {
        
        $validated = $request->validate([
            'published_at' => 'nullable|date',
            'company_id' => 'required|exists:companies,id',

            'title' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'schedule' => 'required|string|max:50',
            'flex_schedule' => 'boolean',
            'modality' => 'required|string|max:255',
            'contract_type' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',

            'closing_date' => 'required|date|after_or_equal:opening_date',
            'opening_date' => 'required|date|before_or_equal:closing_date',
            'vacancies' => 'required|integer|min:0',

            'description' => 'nullable|string',
            'candidate_profile' => 'nullable|string',
            'notes' => 'nullable|string',
            'program_ids' => 'array',
            'program_ids.*' => 'exists:programs,id',
    ]);

        $offer = Offer::create($validated);

        //dd($offer);
        if ($request->has('program_ids')) {
            $offer->programs()->sync($request->program_ids);
        }

        
        $producer->publish('ofertas.creada',[
            'evento'      => 'OfertaCreada',
            'id'          => $offer->id, 
            'titulo'      => $offer->title,
            'empresa_id'  => $offer->company_id,
            'fecha'       => now()->toIso8601String(),
        ]);
        

        echo " Evento ofertas.creada publicado\n";

        return response()->json($offer, 201);
    }

}

