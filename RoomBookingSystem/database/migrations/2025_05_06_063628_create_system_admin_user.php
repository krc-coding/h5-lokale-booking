<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $user = User::find(1);
        if (!$user) {
            User::create([
                'id' => 1,
                'username' => 'System Admin',
                'password' => Hash::make('Merc1234!'),
                'role' => 'systemAdmin',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $user = User::find(1);
        if ($user && $user->role == 'systemAdmin') {
            $user->delete();
        }
    }
};
