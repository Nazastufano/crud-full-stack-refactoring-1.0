<?php
/**
*    File        : backend/routes/studentsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/
require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/studentsController.php");

routeRequest($conn, [
    'POST' => function($conn) {
        $input = json_decode(file_get_contents("php://input"), true);

        // Validar campos requeridos
        if (empty($input['fullname']) || empty($input['email']) || !isset($input['age'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos requeridos"]);
            return;
        }

        // ✅ Validar que el email no exista
        require_once("./repositories/students.php");
        if (emailExists($conn, $input['email'])) {
            http_response_code(409); // Conflict
            echo json_encode(["error" => "El correo ya está registrado"]);
            return;
        }

        // Si pasa las validaciones, delegar al controlador
        handlePost($conn);
    }
]);