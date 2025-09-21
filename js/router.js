class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '/';
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        this.handleRoute();
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.currentRoute = path;
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const handler = this.routes[path];
        
        if (handler) {
            handler();
        } else {
            this.loadPage(path);
        }
    }

    async loadPage(path) {
        const app = document.getElementById('app');
        
        try {
            let htmlPath = '';
            
            if (path === '/' || path === '') {
                this.showHomePage();
                return;
            }
            
            if (path.startsWith('/admin/')) {
                htmlPath = `pages/admin/${path.split('/')[2]}.html`;
            } else if (path.startsWith('/aluno/')) {
                htmlPath = `pages/aluno/${path.split('/')[2]}.html`;
            }
            
            const response = await fetch(htmlPath);
            if (response.ok) {
                const html = await response.text();
                app.innerHTML = html;
                this.executePageScript(path);
            } else {
                this.show404();
            }
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.show404();
        }
    }

    showHomePage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-primary">
                <div class="card shadow-lg" style="width: 400px;">
                    <div class="card-body text-center">
                        <h2 class="card-title mb-4">🎓 Sistema Escolar</h2>
                        <p class="text-muted mb-4">Selecione o tipo de acesso:</p>
                        
                        <div class="d-grid gap-3">
                            <button class="btn btn-success btn-lg" onclick="router.navigate('/admin/login')">
                                👨‍💼 Acesso Administrativo
                            </button>
                            <button class="btn btn-info btn-lg" onclick="router.navigate('/aluno/login')">
                                👨‍🎓 Acesso do Aluno
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    show404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
                <div class="text-center">
                    <h1 class="display-1">404</h1>
                    <p class="fs-3"><span class="text-danger">Oops!</span> Página não encontrada.</p>
                    <button class="btn btn-primary" onclick="router.navigate('/')">Voltar ao Início</button>
                </div>
            </div>
        `;
    }

    executePageScript(path) {
        // Executar scripts específicos da página
        switch(path) {
            case '/admin/login':
                this.initAdminLogin();
                break;
            case '/admin/cadastro':
                this.initAdminCadastro();
                break;
            case '/admin/home':
                this.initAdminHome();
                break;
            case '/admin/cadastro-dados':
                this.initCadastroDados();
                break;
            case '/aluno/login':
                this.initAlunoLogin();
                break;
            case '/aluno/home':
                this.initAlunoHome();
                break;
        }
    }

    // Métodos de inicialização das páginas
    initAdminLogin() {
        const form = document.getElementById('adminLoginForm');
        if (form) {
            form.addEventListener('submit', auth.loginAdmin);
        }
    }

    initAdminCadastro() {
        const form = document.getElementById('adminCadastroForm');
        if (form) {
            form.addEventListener('submit', auth.cadastroAdmin);
        }
    }

    initAdminHome() {
        if (auth.checkAdminAuth()) {
            adminPanel.loadStudents();
            adminPanel.loadFilters();
        } else {
            router.navigate('/admin/login');
        }
    }

    initCadastroDados() {
        if (auth.checkAdminAuth()) {
            cadastroPanel.init();
        } else {
            router.navigate('/admin/login');
        }
    }

    initAlunoLogin() {
        const form = document.getElementById('alunoLoginForm');
        if (form) {
            form.addEventListener('submit', auth.loginAluno);
        }
    }

    initAlunoHome() {
        if (auth.checkAlunoAuth()) {
            alunoPanel.loadProfile();
        } else {
            router.navigate('/aluno/login');
        }
    }
}

const router = new Router();
