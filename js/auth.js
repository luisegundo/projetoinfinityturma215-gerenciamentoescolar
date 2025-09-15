class Auth {
    constructor() {
        this.currentAdmin = null;
        this.currentAluno = null;
    }

    // Login do Administrador
    loginAdmin = (e) => {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const cpf = document.getElementById('adminCpf').value;
        
        const admins = storage.getAdmins();
        const admin = admins.find(a => a.email === email && a.cpf === cpf);
        
        if (admin) {
            this.currentAdmin = admin;
            localStorage.setItem('currentAdmin', JSON.stringify(admin));
            router.navigate('/admin/home');
        } else {
            this.showError('Email ou CPF incorretos!');
        }
    }

    // Cadastro do Administrador
    cadastroAdmin = (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('adminNome').value;
        const email = document.getElementById('adminEmail').value;
        const cpf = document.getElementById('adminCpf').value;
        
        const admins = storage.getAdmins();
        
        // Verificar se já existe
        if (admins.find(a => a.email === email || a.cpf === cpf)) {
            this.showError('Email ou CPF já cadastrado!');
            return;
        }
        
        const newAdmin = {
            id: Date.now(),
            nome,
            email,
            cpf
        };
        
        admins.push(newAdmin);
        storage.saveAdmins(admins);
        
        this.showSuccess('Administrador cadastrado com sucesso!');
        setTimeout(() => router.navigate('/admin/login'), 2000);
    }

    // Login do Aluno
    loginAluno = (e) => {
        e.preventDefault();
        
        const matricula = document.getElementById('alunoMatricula').value;
        const cpf = document.getElementById('alunoCpf').value;
        
        const alunos = storage.getAlunos();
        const aluno = alunos.find(a => a.matricula === matricula && a.cpf === cpf);
        
        if (aluno) {
            this.currentAluno = aluno;
            localStorage.setItem('currentAluno', JSON.stringify(aluno));
            router.navigate('/aluno/home');
        } else {
            this.showError('Matrícula ou CPF incorretos!');
        }
    }

    // Verificar autenticação
    checkAdminAuth() {
        const admin = localStorage.getItem('currentAdmin');
        if (admin) {
            this.currentAdmin = JSON.parse(admin);
            return true;
        }
        return false;
    }

    checkAlunoAuth() {
        const aluno = localStorage.getItem('currentAluno');
        if (aluno) {
            this.currentAluno = JSON.parse(aluno);
            return true;
        }
        return false;
    }

    // Logout
    logout() {
        this.currentAdmin = null;
        this.currentAluno = null;
        localStorage.removeItem('currentAdmin');
        localStorage.removeItem('currentAluno');
        router.navigate('/');
    }

    // Utilitários
    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container') || document.querySelector('.card-body');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }

    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container') || document.querySelector('.card-body');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

const auth = new Auth();