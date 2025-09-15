class CRUD {
    // ===== ALUNOS =====
    createAluno(aluno) {
        const alunos = storage.getAlunos();
        const newAluno = {
            id: storage.generateId(),
            matricula: storage.generateMatricula(),
            ...aluno,
            dataCadastro: new Date().toISOString()
        };
        alunos.push(newAluno);
        storage.saveAlunos(alunos);
        return newAluno;
    }

    getAlunos() {
        return storage.getAlunos();
    }

    getAlunoById(id) {
        const alunos = storage.getAlunos();
        return alunos.find(aluno => aluno.id === id);
    }

    updateAluno(id, updatedData) {
        const alunos = storage.getAlunos();
        const index = alunos.findIndex(aluno => aluno.id === id);
        
        if (index !== -1) {
            alunos[index] = { ...alunos[index], ...updatedData };
            storage.saveAlunos(alunos);
            return alunos[index];
        }
        return null;
    }

    deleteAluno(id) {
        const alunos = storage.getAlunos();
        const filteredAlunos = alunos.filter(aluno => aluno.id !== id);
        storage.saveAlunos(filteredAlunos);
        return true;
    }

    // ===== TURMAS =====
    createTurma(turma) {
        const turmas = storage.getTurmas();
        const newTurma = {
            id: storage.generateId(),
            ...turma,
            dataCadastro: new Date().toISOString()
        };
        turmas.push(newTurma);
        storage.saveTurmas(turmas);
        return newTurma;
    }

    getTurmas() {
        return storage.getTurmas();
    }

    getTurmaById(id) {
        const turmas = storage.getTurmas();
        return turmas.find(turma => turma.id === id);
    }

    updateTurma(id, updatedData) {
        const turmas = storage.getTurmas();
        const index = turmas.findIndex(turma => turma.id === id);
        
        if (index !== -1) {
            turmas[index] = { ...turmas[index], ...updatedData };
            storage.saveTurmas(turmas);
            return turmas[index];
        }
        return null;
    }

    deleteTurma(id) {
        const turmas = storage.getTurmas();
        const filteredTurmas = turmas.filter(turma => turma.id !== id);
        storage.saveTurmas(filteredTurmas);
        return true;
    }

    // ===== CURSOS =====
    createCurso(curso) {
        const cursos = storage.getCursos();
        const newCurso = {
            id: storage.generateId(),
            ...curso,
            dataCadastro: new Date().toISOString()
        };
        cursos.push(newCurso);
        storage.saveCursos(cursos);
        return newCurso;
    }

    getCursos() {
        return storage.getCursos();
    }

    getCursoById(id) {
        const cursos = storage.getCursos();
        return cursos.find(curso => curso.id === id);
    }

    updateCurso(id, updatedData) {
        const cursos = storage.getCursos();
        const index = cursos.findIndex(curso => curso.id === id);
        
        if (index !== -1) {
            cursos[index] = { ...cursos[index], ...updatedData };
            storage.saveCursos(cursos);
            return cursos[index];
        }
        return null;
    }

    deleteCurso(id) {
        const cursos = storage.getCursos();
        const filteredCursos = cursos.filter(curso => curso.id !== id);
        storage.saveCursos(filteredCursos);
        return true;
    }

    // ===== FILTROS E PESQUISAS =====
    filterAlunosByTurma(turmaId) {
        const alunos = this.getAlunos();
        return alunos.filter(aluno => aluno.turmaId === turmaId);
    }

    filterAlunosByCurso(cursoId) {
        const alunos = this.getAlunos();
        return alunos.filter(aluno => aluno.cursoId === cursoId);
    }

    searchAlunos(searchTerm) {
        const alunos = this.getAlunos();
        const term = searchTerm.toLowerCase();
        
        return alunos.filter(aluno => 
            aluno.nome.toLowerCase().includes(term) ||
            aluno.matricula.includes(term) ||
            aluno.cpf.includes(term)
        );
    }
}

const crud = new CRUD();