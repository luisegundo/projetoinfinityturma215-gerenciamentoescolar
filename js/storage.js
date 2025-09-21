class Storage {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Inicializar dados padrão se não existirem
        if (!localStorage.getItem('admins')) {
            const defaultAdmin = [{
                id: 1,
                nome: 'Administrador',
                email: 'admin@escola.com',
                cpf: '12345678901'
            }];
            this.saveAdmins(defaultAdmin);
        }

        if (!localStorage.getItem('alunos')) {
            this.saveAlunos([]);
        }

        if (!localStorage.getItem('turmas')) {
            this.saveTurmas([]);
        }

        if (!localStorage.getItem('cursos')) {
            this.saveCursos([]);
        }
    }

    // Administradores
    getAdmins() {
        return JSON.parse(localStorage.getItem('admins')) || [];
    }

    saveAdmins(admins) {
        localStorage.setItem('admins', JSON.stringify(admins));
    }

    // Alunos
    getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    // Turmas
    getTurmas() {
        return JSON.parse(localStorage.getItem('turmas')) || [];
    }

    saveTurmas(turmas) {
        localStorage.setItem('turmas', JSON.stringify(turmas));
    }

    // Cursos
    getCursos() {
        return JSON.parse(localStorage.getItem('cursos')) || [];
    }

    saveCursos(cursos) {
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }

    // Utilitários
    generateId() {
        return Date.now().toString();
    }

    generateMatricula() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${year}${random}`;
    }
}

const storage = new Storage();
