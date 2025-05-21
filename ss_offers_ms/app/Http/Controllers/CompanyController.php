<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;

class CompanyController extends Controller
{
    //
    public function index()
    {
        return Company::all();
    }

    public function show($id)
    {
        return Company::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'sector' => 'nullable|string|max:255',
            'email' => 'required|email|unique:companies,email',
            'city' => 'nullable|string|max:255'
        ]);
    
        $company = Company::create($validatedData);
        return response()->json($company, 201);
    }
}
