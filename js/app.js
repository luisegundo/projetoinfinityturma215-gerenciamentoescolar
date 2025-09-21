// Classes principais do sistema
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
        
        if (!tbody) return;
        
        if (filteredAlunos.length === 0) {
            tbody.innerHTML = '';
            if (noDataMessage) noDataMessage.style.display = 'block';
            return;
        }
        
        if (noDataMessage) noDataMessage.style.display = 'none';
        
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
        if (filtroTurma) {
            filtroTurma.innerHTML = '<option value="">Todas as Turmas</option>' +
                turmas.map(turma => `<option value="${turma.id}">${turma.nome}</option>`).join('');
            
            filtroTurma.addEventListener('change', (e) => {
                this.currentFilter.turma = e.target.value;
                this.loadStudents();
            });
        }
        
        // Carregar filtro de cursos
        const filtroCurso = document.getElementById('filtroCurso');
        if (filtroCurso) {
            filtroCurso.innerHTML = '<option value="">Todos os Cursos</option>' +
                cursos.map(curso => `<option value="${curso.id}">${curso.nome}</option>`).join('');
            
            filtroCurso.addEventListener('change', (e) => {
                this.currentFilter.curso = e.target.value;
                this.loadStudents();
            });
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.loadStudents();
            });
        }
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
        if (editTurma) {
            editTurma.innerHTML = '<option value="">Selecione uma turma</option>' +
                turmas.map(turma => `<option value="${turma.id}" ${turma.id === aluno.turmaId ? 'selected' : ''}>${turma.nome}</option>`).join('');
        }
        
        const editCurso = document.getElementById('editCurso');
        if (editCurso) {
            editCurso.innerHTML = '<option value="">Selecione um curso</option>' +
                cursos.map(curso => `<option value="${curso.id}" ${curso.id === aluno.cursoId ? 'selected' : ''}>${curso.nome}</option>`).join('');
        }
        
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

class CadastroPanel {
    constructor() {
        this.currentSection = 'aluno';
    }

    init() {
        this.setupEventListeners();
        this.loadSelectOptions();
        this.loadTurmasTable();
        this.loadCursosTable();
    }

    setupEventListeners() {
        // Formulário de cadastro de aluno
        const alunoForm = document.getElementById('cadastroAlunoForm');
        if (alunoForm) {
            alunoForm.addEventListener('submit', this.cadastrarAluno.bind(this));
        }

        // Formulário de cadastro de turma
        const turmaForm = document.getElementById('cadastroTurmaForm');
        if (turmaForm) {
            turmaForm.addEventListener('submit', this.cadastrarTurma.bind(this));
        }

        // Formulário de cadastro de curso
        const cursoForm = document.getElementById('cadastroCursoForm');
        if (cursoForm) {
            cursoForm.addEventListener('submit', this.cadastrarCurso.bind(this));
        }
    }

    showSection(section) {
        // Esconder todas as seções
        const sections = ['cadastroAlunoSection', 'cadastroTurmaSection', 'cadastroCursoSection'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) element.style.display = 'none';
        });

        // Remover classe active de todos os botões
        document.querySelectorAll('.btn-group .btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(`cadastro${section.charAt(0).toUpperCase() + section.slice(1)}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Adicionar classe active ao botão correspondente
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        this.currentSection = section;

        // Recarregar dados se necessário
        if (section === 'turma') {
            this.loadTurmasTable();
        } else if (section === 'curso') {
            this.loadCursosTable();
        } else if (section === 'aluno') {
            this.loadSelectOptions();
        }
    }

    loadSelectOptions() {
        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();

        // Carregar turmas no select
        const turmaSelect = document.getElementById('alunoTurma');
        if (turmaSelect) {
            turmaSelect.innerHTML = '<option value="">Selecione uma turma</option>' +
                turmas.map(turma => `<option value="${turma.id}">${turma.nome} - ${turma.turno}</option>`).join('');
        }

        // Carregar cursos no select
        const cursoSelect = document.getElementById('alunoCurso');
        if (cursoSelect) {
            cursoSelect.innerHTML = '<option value="">Selecione um curso</option>' +
                cursos.map(curso => `<option value="${curso.id}">${curso.nome}</option>`).join('');
        }
    }

    cadastrarAluno(e) {
        e.preventDefault();

        const alunoData = {
            nome: document.getElementById('alunoNome').value,
            idade: parseInt(document.getElementById('alunoIdade').value),
            cpf: document.getElementById('alunoCpfCadastro').value,
            turmaId: document.getElementById('alunoTurma').value,
            cursoId: document.getElementById('alunoCurso').value
        };

        // Validar CPF único
        const alunosExistentes = crud.getAlunos();
        if (alunosExistentes.find(a => a.cpf === alunoData.cpf)) {
            auth.showError('CPF já cadastrado!');
            return;
        }

        const novoAluno = crud.createAluno(alunoData);
        if (novoAluno) {
            auth.showSuccess(`Aluno cadastrado com sucesso! Matrícula: ${novoAluno.matricula}`);
            document.getElementById('cadastroAlunoForm').reset();
        }
    }

    cadastrarTurma(e) {
        e.preventDefault();

        const turmaData = {
            nome: document.getElementById('turmaNome').value,
            ano: document.getElementById('turmaAno').value,
            turno: document.getElementById('turmaTurno').value
        };

        // Validar nome único
        const turmasExistentes = crud.getTurmas();
        if (turmasExistentes.find(t => t.nome === turmaData.nome && t.ano === turmaData.ano)) {
            auth.showError('Já existe uma turma com este nome neste ano!');
            return;
        }

        const novaTurma = crud.createTurma(turmaData);
        if (novaTurma) {
            auth.showSuccess('Turma cadastrada com sucesso!');
            document.getElementById('cadastroTurmaForm').reset();
            this.loadTurmasTable();
            this.loadSelectOptions();
        }
    }

    cadastrarCurso(e) {
        e.preventDefault();

        const cursoData = {
            nome: document.getElementById('cursoNome').value,
            descricao: document.getElementById('cursoDescricao').value
        };

        // Validar nome único
        const cursosExistentes = crud.getCursos();
        if (cursosExistentes.find(c => c.nome === cursoData.nome)) {
            auth.showError('Já existe um curso com este nome!');
            return;
        }

        const novoCurso = crud.createCurso(cursoData);
        if (novoCurso) {
            auth.showSuccess('Curso cadastrado com sucesso!');
            document.getElementById('cadastroCursoForm').reset();
            this.loadCursosTable();
            this.loadSelectOptions();
        }
    }

    loadTurmasTable() {
        const turmas = crud.getTurmas();
        const tbody = document.getElementById('turmasTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = turmas.map(turma => `
            <tr>
                <td>${turma.nome}</td>
                <td>${turma.ano}</td>
                <td>${turma.turno}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="cadastroPanel.editTurma('${turma.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cadastroPanel.deleteTurma('${turma.id}')">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadCursosTable() {
        const cursos = crud.getCursos();
        const tbody = document.getElementById('cursosTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = cursos.map(curso => `
            <tr>
                <td>${curso.nome}</td>
                <td>${curso.descricao.substring(0, 50)}${curso.descricao.length > 50 ? '...' : ''}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="cadastroPanel.editCurso('${curso.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cadastroPanel.deleteCurso('${curso.id}')">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    }

    editTurma(id) {
        const turma = crud.getTurmaById(id);
        if (!turma) return;

        document.getElementById('editTurmaId').value = turma.id;
        document.getElementById('editTurmaNome').value = turma.nome;
        document.getElementById('editTurmaAno').value = turma.ano;
        document.getElementById('editTurmaTurno').value = turma.turno;

        const modal = new bootstrap.Modal(document.getElementById('editTurmaModal'));
        modal.show();
    }

    saveTurmaEdit() {
        const id = document.getElementById('editTurmaId').value;
        const updatedData = {
            nome: document.getElementById('editTurmaNome').value,
            ano: document.getElementById('editTurmaAno').value,
            turno: document.getElementById('editTurmaTurno').value
        };

        if (crud.updateTurma(id, updatedData)) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTurmaModal'));
            modal.hide();
            this.loadTurmasTable();
            this.loadSelectOptions();
            auth.showSuccess('Turma atualizada com sucesso!');
        }
    }

    deleteTurma(id) {
        // Verificar se há alunos nesta turma
        const alunosNaTurma = crud.filterAlunosByTurma(id);
        if (alunosNaTurma.length > 0) {
            auth.showError('Não é possível excluir uma turma que possui alunos matriculados!');
            return;
        }

        if (confirm('Tem certeza que deseja excluir esta turma?')) {
            if (crud.deleteTurma(id)) {
                this.loadTurmasTable();
                this.loadSelectOptions();
                auth.showSuccess('Turma excluída com sucesso!');
            }
        }
    }

    editCurso(id) {
        const curso = crud.getCursoById(id);
        if (!curso) return;

        document.getElementById('editCursoId').value = curso.id;
        document.getElementById('editCursoNome').value = curso.nome;
        document.getElementById('editCursoDescricao').value = curso.descricao;

        const modal = new bootstrap.Modal(document.getElementById('editCursoModal'));
        modal.show();
    }

    saveCursoEdit() {
        const id = document.getElementById('editCursoId').value;
        const updatedData = {
            nome: document.getElementById('editCursoNome').value,
            descricao: document.getElementById('editCursoDescricao').value
        };

        if (crud.updateCurso(id, updatedData)) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCursoModal'));
            modal.hide();
            this.loadCursosTable();
            this.loadSelectOptions();
            auth.showSuccess('Curso atualizado com sucesso!');
        }
    }

    deleteCurso(id) {
        // Verificar se há alunos neste curso
        const alunosNoCurso = crud.filterAlunosByCurso(id);
        if (alunosNoCurso.length > 0) {
            auth.showError('Não é possível excluir um curso que possui alunos matriculados!');
            return;
        }

        if (confirm('Tem certeza que deseja excluir este curso?')) {
            if (crud.deleteCurso(id)) {
                this.loadCursosTable();
                this.loadSelectOptions();
                auth.showSuccess('Curso excluído com sucesso!');
            }
        }
    }
}

class AlunoPanel {
    loadProfile() {
        const aluno = auth.currentAluno;
        if (!aluno) {
            router.navigate('/aluno/login');
            return;
        }

        const turmas = crud.getTurmas();
        const cursos = crud.getCursos();
        
        const turma = turmas.find(t => t.id === aluno.turmaId);
        const curso = cursos.find(c => c.id === aluno.cursoId);

        // Atualizar welcome message
        const welcomeElement = document.getElementById('alunoWelcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Bem-vindo, ${aluno.nome}!`;
        }

        // Dados pessoais
        this.updateElement('alunoNomeDisplay', aluno.nome);
        this.updateElement('alunoMatriculaDisplay', aluno.matricula);
        this.updateElement('alunoIdadeDisplay', `${aluno.idade} anos`);
        this.updateElement('alunoCpfDisplay', this.formatCPF(aluno.cpf));

        // Dados acadêmicos
        this.updateElement('alunoTurmaDisplay', turma ? turma.nome : 'Não informado');
        this.updateElement('alunoTurnoDisplay', turma ? turma.turno : 'Não informado');
        this.updateElement('alunoAnoDisplay', turma ? turma.ano : 'Não informado');

        // Dados do curso
        this.updateElement('alunoCursoNomeDisplay', curso ? curso.nome : 'Não informado');
        this.updateElement('alunoCursoDescricaoDisplay', curso ? curso.descricao : 'Não informado');

        // Informações adicionais
        this.updateElement('alunoDataCadastroDisplay', this.formatDate(aluno.dataCadastro));
        this.loadColegasCount(aluno.turmaId);
        this.updateElement('alunoPeriodoDisplay', this.getCurrentPeriod());
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    loadColegasCount(turmaId) {
        const alunosNaTurma = crud.filterAlunosByTurma(turmaId);
        const count = alunosNaTurma.length - 1; // Subtrair o próprio aluno
        this.updateElement('alunoColegasDisplay', `${count} colegas`);
    }

    getCurrentPeriod() {
        const now = new Date();
        const month = now.getMonth() + 1; // getMonth() retorna 0-11
        
        if (month >= 2 && month <= 6) {
            return '1º Semestre';
        } else if (month >= 8 && month <= 12) {
            return '2º Semestre';
        } else {
            return 'Férias';
        }
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
