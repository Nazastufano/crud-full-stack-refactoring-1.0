/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 2.0 ( prototype )
*/

import { studentsAPI } from '../apiConsumers/studentsAPI.js';

//2.0
//For pagination:
let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
    setupPaginationControls();//2.0
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const student = getFormData();
    
        try 
        {
            if (student.id) 
            {
                await studentsAPI.update(student);
            } 
            else 
            {
                await studentsAPI.create(student);
            }
            clearForm();
            loadStudents();
        }
        catch (err)
        {
            // Mostrar error en un modal de W3.CSS
            const errorMessage = err.message || 'Error desconocido';
            console.error(err.message);
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}

//2.0
function setupPaginationControls() 
{
    document.getElementById('prevPage').addEventListener('click', () => 
    {
        if (currentPage > 1) 
        {
            currentPage--;
            loadStudents();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => 
    {
        if (currentPage < totalPages) 
        {
            currentPage++;
            loadStudents();
        }
    });

    document.getElementById('resultsPerPage').addEventListener('change', e => 
    {
        currentPage = 1;
        loadStudents();
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

//2.0
async function loadStudents()
{
    try 
    {
        const resPerPage = parseInt(document.getElementById('resultsPerPage').value, 10) || limit;
        const data = await studentsAPI.fetchPaginated(currentPage, resPerPage);
        console.log(data);
        renderStudentTable(data.students);
        totalPages = Math.ceil(data.total / resPerPage);
        document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren();
  
    students.forEach(student => 
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await studentsAPI.remove(id);
        loadStudents();
    } 
    catch (err) 
    {
        console.error('Error al borrar:', err.message);
    }
}
//MUESTRA CARTEL
function showErrorMessage(msg) {
    // Opción 1: alert simple
    // alert(msg);

    // Opción 2: Modal W3.CSS (más elegante)
    const modal = document.getElementById('errorModal') ||
        createErrorModal(); // si no existe, lo creamos

    document.getElementById('errorModalContent').textContent = msg;
    document.getElementById('errorModal').style.display = 'block';
}

function createErrorModal() {
    const modal = document.createElement('div');
    modal.id = 'errorModal';
    modal.className = 'w3-modal';
    modal.innerHTML = `
        <div class="w3-modal-content w3-card-4 w3-animate-zoom" style="max-width:400px">
            <header class="w3-container w3-red">
                <span onclick="document.getElementById('errorModal').style.display='none'"
                      class="w3-button w3-display-topright">&times;</span>
                <h2>Error</h2>
            </header>
            <div class="w3-container">
                <p id="errorModalContent"></p>
            </div>
            <footer class="w3-container w3-red">
                <button class="w3-button w3-white"
                        onclick="document.getElementById('errorModal').style.display='none'">
                    Cerrar
                </button>
            </footer>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}