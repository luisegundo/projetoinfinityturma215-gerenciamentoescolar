class AdminPanel {
    constructor() {
        this.currentFilter = {
            turma: '',
            curso: '',
            search: ''
        };
    }

    loadStudents() {
        const alunos = crud.getAlunos();
        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();
        
        const filteredAlunos = this.applyFilters(alunos);
        const tbody = document.getElementById('alunosTableBody');
        const noDataMessage = document.getElementById('noDataMessage');
        
        if (filteredAlunos.length === 0) {
            tbody.innerHTML = '';
            noDataMessage.style.display = 'block';
            return;
        }
        
        noDataMessage.style.display = 'none';
        
        tbody.innerHTML = filteredAlunos.map(aluno => {
            const turma = turmas.find(t => t.id === aluno.turmaId);
            const curso = cursos.find(c => c.id === aluno.cursoId);
            
            return `
                <tr>
                    <td>${aluno.matricula}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.cpf}</td>
                    <td>${turma ? turma.nome : 'N/A'}</td>
                    <td>${curso ? curso.nome : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" onclick="adminPanel.editAluno('${aluno.id}')">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteAluno('${aluno.id}')">
                            🗑️ Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadFilters() {
        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();
        
        // Carregar filtro de turmas
        const filtroTurma = document.getElementById('filtroTurma');
        filtroTurma.innerHTML = '<option value="">Todas as Turmas</option>' +
            turmas.map(turma => `<option value="${turma.id}">${turma.nome}</option>`).join('');
        
        // Carregar filtro de cursos
        const filtroCurso = document.getElementById('filtroCurso');
        filtroCurso.innerHTML = '<option value="">Todos os Cursos</option>' +
            cursos.map(curso => `<option value="${curso.id}">${curso.nome}</option>`).join('');
        
        // Eventos de filtro
        filtroTurma.addEventListener('change', (e) => {
            this.currentFilter.turma = e.target.value;
            this.loadStudents();
        });
        
        filtroCurso.addEventListener('change', (e) => {
            this.currentFilter.curso = e.target.value;
            this.loadStudents();
        });
        
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.loadStudents();
        });
    }

    applyFilters(alunos) {
        return alunos.filter(aluno => {
            const matchTurma = !this.currentFilter.turma || aluno.turmaId === this.currentFilter.turma;
            const matchCurso = !this.currentFilter.curso || aluno.cursoId === this.currentFilter.curso;
            const matchSearch = !this.currentFilter.search || 
                aluno.nome.toLowerCase().includes(this.currentFilter.search.toLowerCase()) ||
                aluno.matricula.includes(this.currentFilter.search) ||
                aluno.cpf.includes(this.currentFilter.search);
            
            return matchTurma && matchCurso && matchSearch;
        });
    }

    editAluno(id) {
        const aluno = crud.getAlunoById(id);
        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();
        
        if (!aluno) return;
        
        // Preencher modal
        document.getElementById('editAlunoId').value = aluno.id;
        document.getElementById('editNome').value = aluno.nome;
        document.getElementById('editIdade').value = aluno.idade;
        document.getElementById('editCpf').value = aluno.cpf;
        
        // Carregar selects
        const editTurma = document.getElementById('editTurma');
        editTurma.innerHTML = '<option value="">Selecione uma turma</option>' +
            turmas.map(turma => `<option value="${turma.id}" ${turma.id === aluno.turmaId ? 'selected' : ''}>${turma.nome}</option>`).join('');
        
        const editCurso = document.getElementById('editCurso');
        editCurso.innerHTML = '<option value="">Selecione um curso</option>' +
            cursos.map(curso => `<option value="${curso.id}" ${curso.id === aluno.cursoId ? 'selected' : ''}>${curso.nome}</option>`).join('');
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('editAlunoModal'));
        modal.show();
    }

    saveEdit() {
        const id = document.getElementById('editAlunoId').value;
        const updatedData = {
            nome: document.getElementById('editNome').value,
            idade: parseInt(document.getElementById('editIdade').value),
            cpf: document.getElementById('editCpf').value,
            turmaId: document.getElementById('editTurma').value,
            cursoId: document.getElementById('editCurso').value
        };
        
        if (crud.updateAluno(id, updatedData)) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAlunoModal'));
            modal.hide();
            this.loadStudents();
            auth.showSuccess('Aluno atualizado com sucesso!');
        }
    }

    deleteAluno(id) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            if (crud.deleteAluno(id)) {
                this.loadStudents();
                auth.showSuccess('Aluno excluído com sucesso!');
            }
        }
    }
}

// Outras classes para cadastros e painel do aluno
class CadastroPanel {
    init() {
        this.loadForms();
    }

    loadForms() {
        // Implementar formulários de cadastro
        // Esta parte será expandida conforme necessário
    }
}

class AlunoPanel {
    loadProfile() {
        const aluno = auth.currentAluno;
        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();
        
        const turma = turmas.find(t => t.id === aluno.turmaId);
        const curso = cursos.find(c => c.id === aluno.cursoId);
        
        // Atualizar interface com dados do aluno
        // Esta parte será implementada na página do aluno
    }
}

// Instâncias globais
const adminPanel = new AdminPanel();
const cadastroPanel = new CadastroPanel();
const alunoPanel = new AlunoPanel();

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema Escolar carregado!');
});